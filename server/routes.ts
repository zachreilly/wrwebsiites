import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactRequestSchema, insertPageViewSchema, insertClickEventSchema, insertAdminSessionSchema, insertClientOnboardingSchema, insertConsultationRequestSchema, insertWebsiteUpdateRequestSchema, customers, projects } from "@shared/schema";
import { z } from "zod";
import { db } from "./db";
import { eq, desc, count } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Enable trust proxy to get real IP addresses
  app.set('trust proxy', true);

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
      const validatedData = insertClientOnboardingSchema.parse(req.body);
      const clientOnboarding = await storage.createClientOnboarding(validatedData);
      res.json({ success: true, data: clientOnboarding });
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
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ 
          success: false, 
          message: "Authentication required" 
        });
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
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ 
          success: false, 
          message: "Authentication required" 
        });
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

  // Direct debit payment endpoint
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

  // Admin endpoint to get payment requests
  app.get("/api/admin/payments", async (req, res) => {
    try {
      const { password } = req.query;
      
      console.log("Payment request password:", password); // Debug log
      
      if (!password || typeof password !== 'string') {
        console.log("No password provided or invalid type"); // Debug log
        return res.status(401).json({ 
          success: false, 
          message: "Authentication required" 
        });
      }

      // Direct password check for BADMAN123
      if (password === 'BADMAN123') {
        console.log("Direct password validation successful"); // Debug log
        // Valid admin password, proceed
      } else {
        console.log("Trying session verification for password:", password); // Debug log
        // Try session verification as backup
        const session = await storage.verifyAdminSession(password);
        if (!session) {
          console.log("Session verification failed"); // Debug log
          return res.status(401).json({ 
            success: false, 
            message: "Invalid password or expired session" 
          });
        }
        console.log("Session verification successful"); // Debug log
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
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ 
          success: false, 
          message: "Authentication required" 
        });
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
      
      if (!password || password !== 'BADMAN123') {
        return res.status(401).json({ 
          success: false, 
          message: "Authentication required" 
        });
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

  // Customer portal authentication - simple email-based lookup
  app.post("/api/customer/login", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ success: false, message: "Email required" });
      }

      const customer = await storage.getCustomerByEmail(email);
      
      if (!customer) {
        return res.status(404).json({ 
          success: false, 
          message: "No customer account found with this email address" 
        });
      }

      res.json({ 
        success: true, 
        customer: {
          id: customer.id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          businessName: customer.businessName,
          subscriptionStatus: customer.subscriptionStatus,
          package: customer.package
        }
      });
    } catch (error) {
      console.error("Customer login error:", error);
      res.status(500).json({ success: false, message: "Login failed" });
    }
  });

  // Customer dashboard data
  app.get("/api/customer/:customerId/dashboard", async (req, res) => {
    try {
      const { customerId } = req.params;
      
      const [customer, projects, transactions, invoices] = await Promise.all([
        storage.getCustomer(customerId),
        storage.getProjectsByCustomer(customerId),
        storage.getTransactionsByCustomer(customerId),
        storage.getInvoicesByCustomer(customerId)
      ]);

      if (!customer) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }

      res.json({
        success: true,
        data: {
          customer,
          projects,
          transactions,
          invoices
        }
      });
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

      // Parse and validate the portfolio data
      const portfolioData = req.body;
      
      // Basic validation
      if (!portfolioData.projectTitle || !portfolioData.clientName || !portfolioData.websiteUrl || !portfolioData.description || !portfolioData.projectType) {
        return res.status(400).json({ success: false, message: "Required fields missing" });
      }

      const newItem = await storage.createPortfolioItem(portfolioData);
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

  const httpServer = createServer(app);
  return httpServer;
}
