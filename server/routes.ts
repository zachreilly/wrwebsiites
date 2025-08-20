import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactRequestSchema, insertPageViewSchema, insertClickEventSchema, insertAdminSessionSchema, insertClientOnboardingSchema, insertConsultationRequestSchema } from "@shared/schema";
import { z } from "zod";

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
      const paymentData = req.body;
      
      // Store the payment request in the database
      await storage.createPaymentRequest({
        package: paymentData.package,
        firstName: paymentData.firstName,
        lastName: paymentData.lastName,
        email: paymentData.email,
        phone: paymentData.phone,
        businessName: paymentData.businessName,
        accountHolderName: paymentData.accountHolderName,
        sortCode: paymentData.sortCode,
        accountNumber: paymentData.accountNumber,
        address: paymentData.address,
        city: paymentData.city,
        postcode: paymentData.postcode,
        status: 'pending'
      });

      // In a real implementation, you would:
      // 1. Integrate with a direct debit provider (like GoCardless)
      // 2. Send confirmation emails
      // 3. Set up the direct debit mandate
      
      res.json({ 
        success: true, 
        message: "Direct debit setup successful" 
      });
    } catch (error) {
      console.error("Payment processing error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to process payment request" 
      });
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

  const httpServer = createServer(app);
  return httpServer;
}
