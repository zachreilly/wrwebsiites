import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactRequestSchema, insertPageViewSchema, insertClickEventSchema, insertAdminSessionSchema, insertClientOnboardingSchema, insertConsultationRequestSchema, insertWebsiteUpdateRequestSchema, insertPortfolioItemSchema, customers, projects, type Project, type Transaction, type Invoice } from "@shared/schema";
import { z } from "zod";
import { db } from "./db";
import { eq, desc, count } from "drizzle-orm";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Enable trust proxy to get real IP addresses
  app.set('trust proxy', true);

  // Explicit favicon route for Chrome compatibility
  app.get("/favicon.ico", (req, res) => {
    console.log("Favicon requested!");
    const faviconPath = path.join(process.cwd(), "client", "public", "favicon.ico");
    res.setHeader("Content-Type", "image/x-icon");
    res.setHeader("Cache-Control", "public, max-age=604800");
    res.sendFile(faviconPath);
  });

  // Analytics tracking endpoints
  app.post("/api/analytics/pageview", async (req, res) => {
    try {
      const pageViewData = {
        ...req.body,
        userAgent: req.get('User-Agent') || null,
        ipAddress: req.ip || null,
        referrer: req.get('Referer') || null,
      };
      
      const validatedData = insertPageViewSchema.parse(pageViewData);
      await storage.logPageView(validatedData);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Page view tracking error:", error);
      res.status(400).json({ success: false, message: "Failed to log page view" });
    }
  });

  app.post("/api/analytics/click", async (req, res) => {
    try {
      const clickData = {
        ...req.body,
        userAgent: req.get('User-Agent') || null,
        ipAddress: req.ip || null,
      };
      
      const validatedData = insertClickEventSchema.parse(clickData);
      await storage.logClickEvent(validatedData);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Click event tracking error:", error);
      res.status(400).json({ success: false, message: "Failed to log click event" });
    }
  });

  // Admin authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ success: false, message: "Password required" });
      }

      // Create session that expires in 24 hours
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      const sessionData = {
        password,
        expiresAt,
      };
      
      const session = await storage.createAdminSession(sessionData);
      
      res.json({ 
        success: true, 
        message: "Login successful",
        sessionId: session.id,
        expiresAt: session.expiresAt
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ success: false, message: "Login failed" });
    }
  });

  // Admin analytics dashboard data
  app.get("/api/admin/analytics", async (req, res) => {
    try {
      const { password, days = 30 } = req.query;
      
      if (!password || typeof password !== 'string') {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      // Verify admin session
      const session = await storage.verifyAdminSession(password);
      if (!session) {
        return res.status(401).json({ success: false, message: "Invalid or expired session" });
      }

      const daysNumber = parseInt(days as string) || 30;
      
      const [
        pageViewStats,
        clickEventStats,
        totalPageViews,
        totalClickEvents,
        uniqueVisitors
      ] = await Promise.all([
        storage.getPageViewStats(daysNumber),
        storage.getClickEventStats(daysNumber),
        storage.getTotalPageViews(daysNumber),
        storage.getTotalClickEvents(daysNumber),
        storage.getUniqueVisitors(daysNumber)
      ]);

      res.json({
        success: true,
        data: {
          pageViewStats,
          clickEventStats,
          totalPageViews,
          totalClickEvents,
          uniqueVisitors,
          period: `${daysNumber} days`
        }
      });
    } catch (error) {
      console.error("Admin analytics error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch analytics" });
    }
  });

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactRequestSchema.parse(req.body);
      const contactRequest = await storage.createContactRequest(validatedData);
      
      // Here you would typically send an email notification
      // For now, we'll just log it and return success
      console.log("New contact request:", contactRequest);
      
      res.json({ 
        success: true, 
        message: "Your quote request has been submitted successfully! We'll get back to you within 2 hours." 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        console.error("Contact form error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to submit your request. Please try again or contact us directly." 
        });
      }
    }
  });

  // Get all contact requests (for admin purposes)
  app.get("/api/contact-requests", async (req, res) => {
    try {
      const requests = await storage.getContactRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching contact requests:", error);
      res.status(500).json({ message: "Failed to fetch contact requests" });
    }
  });

  // Client onboarding submission
  app.post("/api/client-onboarding", async (req, res) => {
    try {
      const { demoMode, ...formData } = req.body;
      const validatedData = insertClientOnboardingSchema.parse(formData);
      
      // Handle referral code validation and discount
      let referralDiscount = 0;
      if (validatedData.referredByCode) {
        const referralCode = validatedData.referredByCode.trim().toUpperCase();
        
        // Check if referral code exists in customers or client onboarding
        const referrer = await storage.validateReferralCode(referralCode);
        
        if (referrer) {
          // Valid referral code! Apply £10 discount
          referralDiscount = 1000; // £10 in pence
          
          // Update referrer's total referral count
          await storage.incrementReferralCount(referralCode);
        } else {
          // Invalid code - still create account but no discount
          console.log(`Invalid referral code attempted: ${referralCode}`);
        }
      }
      
      // Create client onboarding with referral discount
      const clientOnboarding = await storage.createClientOnboarding({
        ...validatedData,
        referralDiscount
      });
      
      // If demo mode, automatically create customer with demoMode flag
      if (demoMode) {
        // Split name into first and last
        const nameParts = clientOnboarding.fullName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';

        // Check if customer already exists with this email
        const existingCustomer = await storage.getCustomerByEmail(clientOnboarding.email);
        
        let customer;
        if (existingCustomer) {
          // Customer already exists - return info to redirect to login
          return res.status(409).json({ 
            success: false, 
            message: "An account with this email already exists. Please log in to your customer portal instead.",
            shouldRedirectToLogin: true
          });
        } else {
          // Create new customer record with demo mode
          customer = await storage.createCustomer({
            firstName,
            lastName,
            email: clientOnboarding.email,
            phone: clientOnboarding.phone || '',
            businessName: clientOnboarding.businessName,
            clientOnboardingId: clientOnboarding.id,
            package: clientOnboarding.selectedPackage,
            setupFeesPaid: false,
            googleBusinessSetup: clientOnboarding.googleBusinessSetup,
            logoCreation: clientOnboarding.logoCreation,
            subscriptionStatus: 'inactive',
            demoMode: true,
            demoApproved: false,
            wantsUserAuth: clientOnboarding.wantsUserAuth,
            wantsDatabase: clientOnboarding.wantsDatabase,
            wantsPaymentProcessing: clientOnboarding.wantsPaymentProcessing,
            wantsCrudOperations: clientOnboarding.wantsCrudOperations,
            wantsAdminPanel: clientOnboarding.wantsAdminPanel,
            wantsProductionFeatures: clientOnboarding.wantsProductionFeatures,
            desiredCompletionDate: clientOnboarding.desiredCompletionDate
          });

          // Create initial project with "Demo" status
          const project = await storage.createProject({
            customerId: customer.id,
            projectName: `${clientOnboarding.businessName} Website (DEMO)`,
            projectDescription: clientOnboarding.businessDescription,
            status: 'planning',
            priority: 'medium',
            domainName: clientOnboarding.existingDomain || null,
            estimatedCompletionDate: null
          });
        }

        // Return customer data for portal access
        res.json({ 
          success: true, 
          data: {
            ...clientOnboarding,
            customerId: customer.id,
            isDemoMode: true
          }
        });
      } else {
        res.json({ success: true, data: clientOnboarding });
      }
    } catch (error) {
      console.error("Client onboarding error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid form data", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Failed to submit client information" });
      }
    }
  });

  // Get client onboarding requests (admin endpoint)
  app.get("/api/admin/client-onboarding", async (req, res) => {
    try {
      const { password } = req.query;
      
      if (!password || typeof password !== 'string') {
        return res.status(401).json({ 
          success: false, 
          message: "Authentication required" 
        });
      }

      // Direct password check for BADMAN123
      if (password === 'BADMAN123') {
        // Valid admin password, proceed
      } else {
        // Try session verification as backup
        const session = await storage.verifyAdminSession(password);
        if (!session) {
          return res.status(401).json({ 
            success: false, 
            message: "Invalid password or expired session" 
          });
        }
      }

      const clients = await storage.getClientOnboardings();
      res.json({ success: true, data: clients });
    } catch (error) {
      console.error("Error fetching client onboarding:", error);
      res.status(500).json({ success: false, message: "Failed to fetch client information" });
    }
  });

  // Update client onboarding status (admin endpoint)
  app.patch("/api/admin/client-onboarding/:id/status", async (req, res) => {
    try {
      const { password } = req.query;
      const { id } = req.params;
      const { status } = req.body;
      
      if (!password || typeof password !== 'string') {
        return res.status(401).json({ 
          success: false, 
          message: "Authentication required" 
        });
      }

      // Direct password check for BADMAN123
      if (password === 'BADMAN123') {
        // Valid admin password, proceed
      } else {
        // Try session verification as backup
        const session = await storage.verifyAdminSession(password);
        if (!session) {
          return res.status(401).json({ 
            success: false, 
            message: "Invalid password or expired session" 
          });
        }
      }

      if (!status || !['accepted', 'delayed', 'new', 'in_progress', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
      }

      const updatedClient = await storage.updateClientOnboardingStatus(id, status);
      
      if (!updatedClient) {
        return res.status(404).json({ success: false, message: "Client not found" });
      }
      
      res.json({ 
        success: true, 
        data: updatedClient 
      });
    } catch (error) {
      console.error("Error updating client status:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to update client status" 
      });
    }
  });

  // Delete client onboarding (admin endpoint)
  app.delete("/api/admin/client-onboarding/:id", async (req, res) => {
    try {
      const { password } = req.query;
      const { id } = req.params;
      
      if (!password || typeof password !== 'string') {
        return res.status(401).json({ 
          success: false, 
          message: "Authentication required" 
        });
      }

      // Direct password check for BADMAN123
      if (password === 'BADMAN123') {
        // Valid admin password, proceed
      } else {
        // Try session verification as backup
        const session = await storage.verifyAdminSession(password);
        if (!session) {
          return res.status(401).json({ 
            success: false, 
            message: "Invalid password or expired session" 
          });
        }
      }

      const deleted = await storage.deleteClientOnboarding(id);
      
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Client inquiry not found" });
      }
      
      res.json({ 
        success: true, 
        message: "Client inquiry deleted successfully" 
      });
    } catch (error) {
      console.error("Error deleting client inquiry:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to delete client inquiry" 
      });
    }
  });

  // Create customer and project from onboarding data (admin endpoint)
  app.post("/api/admin/create-customer-project", async (req, res) => {
    try {
      const { password } = req.query;
      const { clientOnboardingId } = req.body;
      
      if (!password || typeof password !== 'string') {
        return res.status(401).json({ 
          success: false, 
          message: "Authentication required" 
        });
      }

      // Direct password check for BADMAN123
      if (password === 'BADMAN123') {
        // Valid admin password, proceed
      } else {
        // Try session verification as backup
        const session = await storage.verifyAdminSession(password);
        if (!session) {
          return res.status(401).json({ 
            success: false, 
            message: "Invalid password or expired session" 
          });
        }
      }

      if (!clientOnboardingId) {
        return res.status(400).json({ 
          success: false, 
          message: "Client onboarding ID is required" 
        });
      }

      // Get onboarding data
      const onboarding = await storage.getClientOnboarding(clientOnboardingId);
      if (!onboarding) {
        return res.status(404).json({ 
          success: false, 
          message: "Client onboarding record not found" 
        });
      }

      // Check if customer already exists for this onboarding
      const existingCustomer = await storage.getCustomerByEmail(onboarding.email);
      if (existingCustomer && existingCustomer.clientOnboardingId === clientOnboardingId) {
        return res.status(400).json({ 
          success: false, 
          message: "Customer and project already exist for this onboarding" 
        });
      }

      // Split name into first and last
      const nameParts = onboarding.fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';

      // Create customer record
      const customer = await storage.createCustomer({
        firstName,
        lastName,
        email: onboarding.email,
        phone: onboarding.phone || '',
        businessName: onboarding.businessName,
        clientOnboardingId: onboarding.id,
        package: onboarding.selectedPackage,
        setupFeesPaid: false,
        googleBusinessSetup: onboarding.googleBusinessSetup,
        subscriptionStatus: 'inactive'
      });

      // Create initial project
      const project = await storage.createProject({
        customerId: customer.id,
        projectName: `${onboarding.businessName} Website`,
        projectDescription: onboarding.businessDescription,
        status: 'planning',
        priority: 'medium',
        domainName: onboarding.existingDomain || null,
        estimatedCompletionDate: null
      });

      res.json({ 
        success: true, 
        data: { 
          customer, 
          project,
          message: 'Customer and project created successfully' 
        } 
      });
    } catch (error) {
      console.error("Error creating customer and project:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to create customer and project" 
      });
    }
  });

  // Generate GoCardless payment link
  app.post("/api/payment/generate-link", async (req, res) => {
    try {
      const {
        customerId,
        email,
        firstName,
        lastName,
        address,
        city,
        postcode,
        packageType,
        logoCreation
      } = req.body;

      if (!customerId || !email || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message: "Missing required customer information"
        });
      }

      // Calculate setup fee
      const baseSetupFee = packageType === 'premium' ? 15000 : 7500; // £150 or £75 in pence
      const logoFee = logoCreation ? 2500 : 0; // £25 in pence
      const totalSetupFee = baseSetupFee + logoFee;

      const { gocardlessService } = await import("./gocardless");
      
      // Generate payment link
      const { billingRequestId, authorizationUrl } = await gocardlessService.createPaymentLink({
        email,
        firstName,
        lastName,
        addressLine1: address || '1 Main Street',
        city: city || 'London',
        postalCode: postcode || 'SW1A 1AA',
        setupFeeAmount: totalSetupFee,
        description: `Setup fee for ${packageType} website package${logoCreation ? ' + Logo creation' : ''}`,
        customerId,
      });

      // Store billing request ID with customer for webhook processing
      await storage.updateCustomer(customerId, {
        gocardlessBillingRequestId: billingRequestId,
      });

      res.json({
        success: true,
        paymentUrl: authorizationUrl,
        billingRequestId,
      });

    } catch (error: any) {
      console.error("Payment link generation error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to generate payment link"
      });
    }
  });

  // Direct debit payment endpoint (legacy - kept for compatibility)
  app.post("/api/payment/direct-debit", async (req, res) => {
    try {
      const { setupDirectDebit } = await import("./gocardless");
      await setupDirectDebit(req, res);
    } catch (error) {
      console.error("Payment processing error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to process payment request" 
      });
    }
  });

  // GoCardless webhook endpoint for payment status updates
  app.post("/api/gocardless/webhook", async (req, res) => {
    try {
      const { processWebhook } = await import("./gocardless");
      await processWebhook(req, res);
    } catch (error) {
      console.error("Webhook processing error:", error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

  // Test GoCardless connection (admin only)
  app.get("/api/admin/test-gocardless", async (req, res) => {
    try {
      const { password } = req.query;
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ 
          success: false, 
          message: "Authentication required" 
        });
      }

      const { gocardlessService } = await import("./gocardless");
      
      // Simple connection test - just initialize the client
      const testResult = {
        success: true,
        environment: process.env.GOCARDLESS_ENVIRONMENT || 'sandbox',
        hasApiKey: !!process.env.GOCARDLESS_API_KEY,
        message: `GoCardless is configured for ${process.env.GOCARDLESS_ENVIRONMENT || 'sandbox'} environment`
      };
      
      res.json(testResult);
    } catch (error: any) {
      console.error("GoCardless test error:", error);
      res.status(500).json({ 
        success: false, 
        message: error.message || "Failed to connect to GoCardless" 
      });
    }
  });

  // Admin endpoint to get payment requests
  app.get("/api/admin/payments", async (req, res) => {
    try {
      const { password } = req.query;
      
      if (!password || typeof password !== 'string') {
        return res.status(401).json({ 
          success: false, 
          message: "Authentication required" 
        });
      }

      // Direct password check for BADMAN123
      if (password === 'BADMAN123') {
        // Valid admin password, proceed
      } else {
        // Try session verification as backup
        const session = await storage.verifyAdminSession(password);
        if (!session) {
          return res.status(401).json({ 
            success: false, 
            message: "Invalid password or expired session" 
          });
        }
      }

      const payments = await storage.getPaymentRequests();
      
      res.json({ 
        success: true, 
        data: payments 
      });
    } catch (error) {
      console.error("Error fetching payment requests:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch payment requests" 
      });
    }
  });

  // Admin endpoint to update payment request project status
  app.patch("/api/admin/payments/:requestId/status", async (req, res) => {
    try {
      const { password } = req.query;
      const { requestId } = req.params;
      const { projectStatus } = req.body;

      // Validate password
      if (!password || typeof password !== 'string' || password !== 'BADMAN123') {
        return res.status(401).json({ 
          success: false, 
          message: "Authentication required" 
        });
      }

      // Validate projectStatus
      const validStatuses = ['pending_payment', 'paid_pending_build', 'built_awaiting_approval', 'approved', 'published'];
      if (!validStatuses.includes(projectStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project status"
        });
      }

      // Update the payment request
      const updated = await storage.updatePaymentRequestStatus(requestId, projectStatus);

      res.json({
        success: true,
        data: updated
      });
    } catch (error) {
      console.error("Error updating payment request status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update project status"
      });
    }
  });

  // Consultation request endpoint
  app.post("/api/consultation", async (req, res) => {
    try {
      const consultationData = insertConsultationRequestSchema.parse(req.body);
      
      // Store the consultation request
      await storage.createConsultationRequest(consultationData);
      
      // In a real implementation, you would:
      // 1. Send an email notification to your business email
      // 2. Send a confirmation email to the client
      // 3. Generate a detailed quote and send it within 24 hours
      
      res.json({ 
        success: true, 
        message: "Consultation request received. We'll email you within 24 hours." 
      });
    } catch (error) {
      console.error("Consultation request error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid form data", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Failed to submit consultation request" });
      }
    }
  });

  // Admin endpoint to get consultation requests
  app.get("/api/admin/consultations", async (req, res) => {
    try {
      const { password } = req.query;
      
      if (!password || typeof password !== 'string') {
        return res.status(401).json({ 
          success: false, 
          message: "Authentication required" 
        });
      }

      // Direct password check for BADMAN123
      if (password === 'BADMAN123') {
        // Valid admin password, proceed
      } else {
        // Try session verification as backup
        const session = await storage.verifyAdminSession(password);
        if (!session) {
          return res.status(401).json({ 
            success: false, 
            message: "Invalid password or expired session" 
          });
        }
      }

      const consultations = await storage.getConsultationRequests();
      res.json({ success: true, data: consultations });
    } catch (error) {
      console.error("Error fetching consultation requests:", error);
      res.status(500).json({ success: false, message: "Failed to fetch consultation requests" });
    }
  });

  // Website update request endpoint
  app.post("/api/website-update", async (req, res) => {
    try {
      const updateData = insertWebsiteUpdateRequestSchema.parse(req.body);
      
      // Store the website update request
      await storage.createWebsiteUpdateRequest(updateData);
      
      // In a real implementation, you would:
      // 1. Send an email notification to your business email
      // 2. Send a confirmation email to the client
      // 3. Review the existing website and provide a quote
      
      res.json({ 
        success: true, 
        message: "Website update request received. We'll assess your current site and email you a quote within 24 hours." 
      });
    } catch (error) {
      console.error("Website update request error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid form data", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Failed to submit website update request" });
      }
    }
  });

  // Admin endpoint to get website update requests
  app.get("/api/admin/website-updates", async (req, res) => {
    try {
      const { password } = req.query;
      
      if (!password || typeof password !== 'string') {
        return res.status(401).json({ 
          success: false, 
          message: "Authentication required" 
        });
      }

      // Direct password check for BADMAN123
      if (password === 'BADMAN123') {
        // Valid admin password, proceed
      } else {
        // Try session verification as backup
        const session = await storage.verifyAdminSession(password);
        if (!session) {
          return res.status(401).json({ 
            success: false, 
            message: "Invalid password or expired session" 
          });
        }
      }

      const updates = await storage.getWebsiteUpdateRequests();
      res.json({ success: true, data: updates });
    } catch (error) {
      console.error("Error fetching website update requests:", error);
      res.status(500).json({ success: false, message: "Failed to fetch website update requests" });
    }
  });

  // Update website update request status
  app.patch("/api/admin/website-updates/:id/status", async (req, res) => {
    try {
      const { password } = req.query;
      const { id } = req.params;
      const { status } = req.body;
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ 
          success: false, 
          message: "Authentication required" 
        });
      }

      if (!status || !['pending', 'assessed', 'quoted', 'in-progress', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
      }

      const updatedRequest = await storage.updateWebsiteUpdateRequestStatus(id, status);
      
      if (!updatedRequest) {
        return res.status(404).json({ success: false, message: "Website update request not found" });
      }

      res.json({ success: true, data: updatedRequest });
    } catch (error) {
      console.error("Error updating website update request status:", error);
      res.status(500).json({ success: false, message: "Failed to update website update request status" });
    }
  });

  // Create portfolio item endpoint
  app.post("/api/admin/portfolio", async (req, res) => {
    try {
      const { password } = req.query;
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ 
          success: false, 
          message: "Authentication required" 
        });
      }

      const portfolioData = {
        ...req.body,
        imageUrls: Array.isArray(req.body.imageUrls) ? req.body.imageUrls : []
      };

      const portfolioItem = await storage.createPortfolioItem(portfolioData);
      
      res.json({ 
        success: true, 
        data: portfolioItem,
        message: "Portfolio item created successfully" 
      });
    } catch (error) {
      console.error("Error creating portfolio item:", error);
      res.status(500).json({ success: false, message: "Failed to create portfolio item" });
    }
  });

  // Update consultation status
  app.patch("/api/admin/consultations/:id/status", async (req, res) => {
    try {
      const { password } = req.query;
      const { id } = req.params;
      const { status } = req.body;
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ 
          success: false, 
          message: "Authentication required" 
        });
      }

      if (!status || !['pending', 'quoted', 'delayed', 'accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
      }

      const updatedConsultation = await storage.updateConsultationStatus(id, status);
      
      if (!updatedConsultation) {
        return res.status(404).json({ success: false, message: "Consultation not found" });
      }
      
      res.json({ 
        success: true, 
        data: updatedConsultation 
      });
    } catch (error) {
      console.error("Error updating consultation status:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to update consultation status" 
      });
    }
  });

  // Customer portal authentication - email and password verification
  app.post("/api/customer/login", async (req, res) => {
    try {
      const bcrypt = await import('bcryptjs');
      const { email, password } = req.body;
      
      console.log('Customer login attempt:', { email, passwordLength: password?.length });
      
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password required" });
      }

      // Check client onboarding table for authenticated clients
      const client = await storage.getClientOnboardingByEmail(email);
      
      if (!client) {
        console.log('No client found for email:', email);
        return res.status(404).json({ 
          success: false, 
          message: "No account found. Please complete the onboarding form to create your portal account." 
        });
      }
      
      console.log('Client found:', { 
        clientCode: client.clientCode, 
        hasPassword: !!client.portalPassword,
        passwordHashLength: client.portalPassword?.length
      });
      
      // Verify password using bcrypt (constant-time, secure hash comparison)
      const isPasswordValid = await bcrypt.compare(password, client.portalPassword);
      
      console.log('Password validation result:', isPasswordValid);
      
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false, 
          message: "Incorrect password" 
        });
      }

      // Check if a linked customer record exists (for project access)
      const linkedCustomer = await storage.getCustomerByOnboardingId(client.id);
      
      // Return the actual customer ID if one exists, otherwise use onboarding ID
      const customerId = linkedCustomer ? linkedCustomer.id : client.id;
      
      console.log('Login successful:', { 
        onboardingId: client.id, 
        customerId, 
        hasLinkedCustomer: !!linkedCustomer 
      });

      // Return client information
      res.json({ 
        success: true, 
        customer: {
          id: customerId,
          clientCode: client.clientCode,
          firstName: client.fullName.split(' ')[0] || client.fullName,
          lastName: client.fullName.split(' ').slice(1).join(' ') || '',
          fullName: client.fullName,
          email: client.email,
          businessName: client.businessName,
          package: client.selectedPackage,
          status: client.status
        }
      });
    } catch (error) {
      console.error("Customer login error:", error);
      res.status(500).json({ success: false, message: "Login failed" });
    }
  });

  // Customer dashboard data - works with both old customers table and new client_onboarding table
  app.get("/api/customer/:customerId/dashboard", async (req, res) => {
    try {
      const { customerId } = req.params;
      
      // Try to get customer record first (happy path after login returns customer ID)
      let customer = await storage.getCustomer(customerId);
      
      if (customer) {
        // Found customer directly, fetch their data
        const [projects, transactions, invoices] = await Promise.all([
          storage.getProjectsByCustomer(customer.id),
          storage.getTransactionsByCustomer(customer.id),
          storage.getInvoicesByCustomer(customer.id)
        ]);

        return res.json({
          success: true,
          data: {
            customer,
            projects,
            transactions,
            invoices
          }
        });
      }
      
      // Fallback: Try client_onboarding if customerId is an onboarding ID
      const clientOnboarding = await storage.getClientOnboarding(customerId);
      
      if (clientOnboarding) {
        // Check if a linked customer record exists
        const linkedCustomer = await storage.getCustomerByOnboardingId(customerId);
        
        if (linkedCustomer) {
          // Customer exists - fetch and return their full data
          const [projects, transactions, invoices] = await Promise.all([
            storage.getProjectsByCustomer(linkedCustomer.id),
            storage.getTransactionsByCustomer(linkedCustomer.id),
            storage.getInvoicesByCustomer(linkedCustomer.id)
          ]);
          
          return res.json({
            success: true,
            data: {
              customer: linkedCustomer,
              projects,
              transactions,
              invoices
            }
          });
        }
        
        // No linked customer yet (onboarding only) - return onboarding data with empty arrays
        const formattedCustomer = {
          id: clientOnboarding.id,
          clientCode: clientOnboarding.clientCode,
          firstName: clientOnboarding.fullName.split(' ')[0] || clientOnboarding.fullName,
          lastName: clientOnboarding.fullName.split(' ').slice(1).join(' ') || '',
          fullName: clientOnboarding.fullName,
          email: clientOnboarding.email,
          phone: clientOnboarding.phone,
          businessName: clientOnboarding.businessName,
          package: clientOnboarding.selectedPackage,
          setupFeesPaid: clientOnboarding.setupFeesPaid,
          subscriptionStatus: 'inactive',
          monthlyFee: clientOnboarding.selectedPackage === 'premium' ? 1000 : 1000, // £10/month
        };
        
        return res.json({
          success: true,
          data: {
            customer: formattedCustomer,
            projects: [],
            transactions: [],
            invoices: []
          }
        });
      }

      // No customer or onboarding record found
      return res.status(404).json({ success: false, message: "Customer not found" });
    } catch (error) {
      console.error("Customer dashboard error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch dashboard data" });
    }
  });

  // Get design approvals for a project
  app.get("/api/customer/project/:projectId/designs", async (req, res) => {
    try {
      const { projectId } = req.params;
      const designs = await storage.getDesignApprovalsByProject(projectId);
      res.json({ success: true, data: designs });
    } catch (error) {
      console.error("Design approvals error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch designs" });
    }
  });

  // Submit design approval/rejection
  app.patch("/api/customer/design/:designId", async (req, res) => {
    try {
      const { designId } = req.params;
      const { status, feedback } = req.body;
      
      if (!['approved', 'rejected', 'revision_requested'].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
      }

      const updated = await storage.updateDesignApprovalStatus(designId, status, feedback);
      
      if (!updated) {
        return res.status(404).json({ success: false, message: "Design not found" });
      }

      res.json({ success: true, data: updated });
    } catch (error) {
      console.error("Design approval error:", error);
      res.status(500).json({ success: false, message: "Failed to update design approval" });
    }
  });

  // Submit change request
  app.post("/api/customer/project/:projectId/change-request", async (req, res) => {
    try {
      const { projectId } = req.params;
      const { customerId, requestType, title, description, priority } = req.body;
      
      const changeRequest = await storage.createChangeRequest({
        projectId,
        customerId,
        requestType,
        title,
        description,
        priority: priority || 'medium'
      });

      res.json({ success: true, data: changeRequest });
    } catch (error) {
      console.error("Change request error:", error);
      res.status(500).json({ success: false, message: "Failed to submit change request" });
    }
  });

  // Get change requests for a project
  app.get("/api/customer/project/:projectId/change-requests", async (req, res) => {
    try {
      const { projectId } = req.params;
      const requests = await storage.getChangeRequestsByProject(projectId);
      res.json({ success: true, data: requests });
    } catch (error) {
      console.error("Change requests error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch change requests" });
    }
  });

  // Customer: Get project updates/notifications
  app.get("/api/customer/:customerId/updates", async (req, res) => {
    try {
      const { customerId } = req.params;
      const updates = await storage.getProjectUpdatesByCustomer(customerId);
      res.json({ success: true, data: updates });
    } catch (error) {
      console.error("Project updates error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch updates" });
    }
  });

  // Customer: Mark all updates as read
  app.patch("/api/customer/:customerId/updates/mark-read", async (req, res) => {
    try {
      const { customerId } = req.params;
      await storage.markProjectUpdatesAsRead(customerId);
      res.json({ success: true });
    } catch (error) {
      console.error("Mark updates as read error:", error);
      res.status(500).json({ success: false, message: "Failed to mark updates as read" });
    }
  });

  // Customer: Get invoices
  app.get("/api/customers/:id/invoices", async (req, res) => {
    try {
      const { id } = req.params;
      const invoices = await storage.getInvoicesByCustomer(id);
      res.json({ success: true, data: invoices });
    } catch (error) {
      console.error("Get invoices error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch invoices" });
    }
  });

  // Customer: Get transactions/payment history
  app.get("/api/customers/:id/transactions", async (req, res) => {
    try {
      const { id } = req.params;
      const transactions = await storage.getTransactionsByCustomer(id);
      res.json({ success: true, data: transactions });
    } catch (error) {
      console.error("Get transactions error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch transactions" });
    }
  });

  // Admin: Get upload URL for project update image
  app.post("/api/admin/project-update-image-upload", async (req, res) => {
    try {
      const { password } = req.query;
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ success: true, uploadURL });
    } catch (error) {
      console.error("Get upload URL error:", error);
      res.status(500).json({ success: false, message: "Failed to get upload URL" });
    }
  });

  // Serve uploaded images from object storage
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Admin: Post project update/notification to customer
  app.post("/api/admin/project-update", async (req, res) => {
    try {
      const { password } = req.query;
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      const { customerId, message, imageUrl } = req.body;

      if (!customerId || !message) {
        return res.status(400).json({ success: false, message: "Customer ID and message are required" });
      }

      // Normalize image URL if provided
      let normalizedImageUrl = imageUrl;
      if (imageUrl) {
        const objectStorageService = new ObjectStorageService();
        normalizedImageUrl = objectStorageService.normalizeObjectEntityPath(imageUrl);
      }
      
      const update = await storage.createProjectUpdate({
        customerId,
        message,
        imageUrl: normalizedImageUrl,
        createdBy: "Admin",
        isRead: false
      });

      res.json({ success: true, data: update });
    } catch (error) {
      console.error("Create project update error:", error);
      res.status(500).json({ success: false, message: "Failed to create update" });
    }
  });

  // Admin: Create design approval for review
  app.post("/api/admin/project/:projectId/design", async (req, res) => {
    try {
      const { password } = req.query;
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      const { projectId } = req.params;
      const { customerId, designType, designTitle, designDescription, designImageUrl } = req.body;
      
      const design = await storage.createDesignApproval({
        projectId,
        customerId,
        designType,
        designTitle,
        designDescription,
        designImageUrl
      });

      res.json({ success: true, data: design });
    } catch (error) {
      console.error("Admin design submission error:", error);
      res.status(500).json({ success: false, message: "Failed to submit design" });
    }
  });

  // Admin: Update change request status
  app.patch("/api/admin/change-request/:requestId", async (req, res) => {
    try {
      const { password } = req.query;
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      const { requestId } = req.params;
      const { status, adminResponse, estimatedHours, additionalCost } = req.body;
      
      const updated = await storage.updateChangeRequestStatus(requestId, status, adminResponse);
      
      if (!updated) {
        return res.status(404).json({ success: false, message: "Change request not found" });
      }

      res.json({ success: true, data: updated });
    } catch (error) {
      console.error("Change request update error:", error);
      res.status(500).json({ success: false, message: "Failed to update change request" });
    }
  });

  // Admin: Get all customers for management
  app.get("/api/admin/customers", async (req, res) => {
    try {
      const { password } = req.query;
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      // Get all customers with their project counts
      const customersData = await db
        .select({
          customer: customers,
          projectCount: count(projects.id)
        })
        .from(customers)
        .leftJoin(projects, eq(customers.id, projects.customerId))
        .groupBy(customers.id)
        .orderBy(desc(customers.createdAt));

      res.json({ success: true, data: customersData });
    } catch (error) {
      console.error("Admin customers error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch customers" });
    }
  });

  // Portfolio API endpoints
  
  // Get public portfolio items for main website
  app.get("/api/portfolio", async (req, res) => {
    try {
      const portfolioItems = await storage.getPublicPortfolioItems();
      res.json({ success: true, data: portfolioItems });
    } catch (error) {
      console.error("Portfolio fetch error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch portfolio" });
    }
  });

  // Get featured portfolio items
  app.get("/api/portfolio/featured", async (req, res) => {
    try {
      const featuredItems = await storage.getFeaturedPortfolioItems();
      res.json({ success: true, data: featuredItems });
    } catch (error) {
      console.error("Featured portfolio fetch error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch featured portfolio" });
    }
  });

  // Admin: Get all portfolio items
  app.get("/api/admin/portfolio", async (req, res) => {
    try {
      const { password } = req.query;
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      const portfolioItems = await storage.getPortfolioItems();
      res.json({ success: true, data: portfolioItems });
    } catch (error) {
      console.error("Admin portfolio fetch error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch portfolio items" });
    }
  });

  // Admin: Create new portfolio item
  app.post("/api/admin/portfolio", async (req, res) => {
    try {
      const { password } = req.query;
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      // Parse and validate the portfolio data using Zod schema
      const portfolioData = insertPortfolioItemSchema.parse(req.body);
      
      // Normalize the image URL for object storage
      const objectStorageService = new ObjectStorageService();
      const normalizedImageUrl = objectStorageService.normalizeObjectEntityPath(portfolioData.imageUrl);
      
      const portfolioDataWithNormalizedUrl = {
        ...portfolioData,
        imageUrl: normalizedImageUrl
      };

      const newItem = await storage.createPortfolioItem(portfolioDataWithNormalizedUrl);
      res.json({ success: true, data: newItem });
    } catch (error) {
      console.error("Portfolio creation error:", error);
      res.status(500).json({ success: false, message: "Failed to create portfolio item" });
    }
  });

  // Admin: Update portfolio item
  app.put("/api/admin/portfolio/:id", async (req, res) => {
    try {
      const { password } = req.query;
      const { id } = req.params;
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      const updatedItem = await storage.updatePortfolioItem(id, req.body);
      
      if (!updatedItem) {
        return res.status(404).json({ success: false, message: "Portfolio item not found" });
      }

      res.json({ success: true, data: updatedItem });
    } catch (error) {
      console.error("Portfolio update error:", error);
      res.status(500).json({ success: false, message: "Failed to update portfolio item" });
    }
  });

  // Admin: Delete portfolio item
  app.delete("/api/admin/portfolio/:id", async (req, res) => {
    try {
      const { password } = req.query;
      const { id } = req.params;
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      await storage.deletePortfolioItem(id);
      res.json({ success: true, message: "Portfolio item deleted" });
    } catch (error) {
      console.error("Portfolio deletion error:", error);
      res.status(500).json({ success: false, message: "Failed to delete portfolio item" });
    }
  });

  // ============================================
  // PROJECT MANAGEMENT ROUTES
  // ============================================

  // Get all projects (admin)
  app.get("/api/admin/projects", async (req, res) => {
    try {
      const { password } = req.query;
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      // Get all customers and their projects
      const allCustomers = await db.select().from(customers).orderBy(desc(customers.createdAt));
      const projectsWithCustomers = await Promise.all(
        allCustomers.map(async (customer) => {
          const customerProjects = await storage.getProjectsByCustomer(customer.id);
          return customerProjects.map(project => ({
            ...project,
            customer
          }));
        })
      );
      
      const flatProjects = projectsWithCustomers.flat();

      res.json({ success: true, data: flatProjects });
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch projects" });
    }
  });

  // Get projects for specific customer
  app.get("/api/admin/projects/customer/:customerId", async (req, res) => {
    try {
      const { password } = req.query;
      const { customerId } = req.params;
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      const customerProjects = await storage.getProjectsByCustomer(customerId);
      res.json({ success: true, data: customerProjects });
    } catch (error) {
      console.error("Get customer projects error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch customer projects" });
    }
  });

  // Update project status/details
  app.patch("/api/admin/projects/:id", async (req, res) => {
    try {
      const { password } = req.query;
      const { id } = req.params;
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      const updatedProject = await storage.updateProject(id, req.body);
      
      if (!updatedProject) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }

      res.json({ success: true, data: updatedProject });
    } catch (error) {
      console.error("Update project error:", error);
      res.status(500).json({ success: false, message: "Failed to update project" });
    }
  });

  // Create design approval
  app.post("/api/admin/design-approvals", async (req, res) => {
    try {
      const { password } = req.query;
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      const designApproval = await storage.createDesignApproval(req.body);
      res.json({ success: true, data: designApproval });
    } catch (error) {
      console.error("Create design approval error:", error);
      res.status(500).json({ success: false, message: "Failed to create design approval" });
    }
  });

  // Get design approvals for a project
  app.get("/api/admin/design-approvals/project/:projectId", async (req, res) => {
    try {
      const { password } = req.query;
      const { projectId } = req.params;
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      const approvals = await storage.getDesignApprovalsByProject(projectId);
      res.json({ success: true, data: approvals });
    } catch (error) {
      console.error("Get design approvals error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch design approvals" });
    }
  });

  // Update design approval status
  app.patch("/api/admin/design-approvals/:id", async (req, res) => {
    try {
      const { password } = req.query;
      const { id } = req.params;
      const { status, customerFeedback } = req.body;
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      const updatedApproval = await storage.updateDesignApprovalStatus(id, status, customerFeedback);
      
      if (!updatedApproval) {
        return res.status(404).json({ success: false, message: "Design approval not found" });
      }

      res.json({ success: true, data: updatedApproval });
    } catch (error) {
      console.error("Update design approval error:", error);
      res.status(500).json({ success: false, message: "Failed to update design approval" });
    }
  });

  // Create change request
  app.post("/api/admin/change-requests", async (req, res) => {
    try {
      const { password } = req.query;
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      const changeRequest = await storage.createChangeRequest(req.body);
      res.json({ success: true, data: changeRequest });
    } catch (error) {
      console.error("Create change request error:", error);
      res.status(500).json({ success: false, message: "Failed to create change request" });
    }
  });

  // Get change requests for a project
  app.get("/api/admin/change-requests/project/:projectId", async (req, res) => {
    try {
      const { password } = req.query;
      const { projectId } = req.params;
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      const requests = await storage.getChangeRequestsByProject(projectId);
      res.json({ success: true, data: requests });
    } catch (error) {
      console.error("Get change requests error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch change requests" });
    }
  });

  // Update change request status
  app.patch("/api/admin/change-requests/:id", async (req, res) => {
    try {
      const { password } = req.query;
      const { id } = req.params;
      const { status, response } = req.body;
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      const updatedRequest = await storage.updateChangeRequestStatus(id, status, response);
      
      if (!updatedRequest) {
        return res.status(404).json({ success: false, message: "Change request not found" });
      }

      res.json({ success: true, data: updatedRequest });
    } catch (error) {
      console.error("Update change request error:", error);
      res.status(500).json({ success: false, message: "Failed to update change request" });
    }
  });

  // ============================================
  // OBJECT STORAGE ROUTES
  // ============================================

  // Object storage upload endpoint
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Serve uploaded objects
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error accessing object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
