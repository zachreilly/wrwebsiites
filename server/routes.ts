import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactRequestSchema, insertPageViewSchema, insertClickEventSchema, insertAdminSessionSchema } from "@shared/schema";
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
        totalClickEvents
      ] = await Promise.all([
        storage.getPageViewStats(daysNumber),
        storage.getClickEventStats(daysNumber),
        storage.getTotalPageViews(daysNumber),
        storage.getTotalClickEvents(daysNumber)
      ]);

      res.json({
        success: true,
        data: {
          pageViewStats,
          clickEventStats,
          totalPageViews,
          totalClickEvents,
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

  const httpServer = createServer(app);
  return httpServer;
}
