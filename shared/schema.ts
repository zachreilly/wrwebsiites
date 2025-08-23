import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactRequests = pgTable("contact_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").default(""),
  package: text("package").default(""),
  projectDetails: text("project_details").default(""),
  timeline: text("timeline").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pageViews = pgTable("page_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  page: text("page").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  referrer: text("referrer"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const clickEvents = pgTable("click_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  element: text("element").notNull(), // button name, link text, etc.
  page: text("page").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adminSessions = pgTable("admin_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  password: text("password").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactRequestSchema = createInsertSchema(contactRequests).omit({
  id: true,
  createdAt: true,
});

export const insertPageViewSchema = createInsertSchema(pageViews).omit({
  id: true,
  createdAt: true,
});

export const insertClickEventSchema = createInsertSchema(clickEvents).omit({
  id: true,
  createdAt: true,
});

export const insertAdminSessionSchema = createInsertSchema(adminSessions).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactRequest = z.infer<typeof insertContactRequestSchema>;
export type ContactRequest = typeof contactRequests.$inferSelect;
export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type PageView = typeof pageViews.$inferSelect;
export type InsertClickEvent = z.infer<typeof insertClickEventSchema>;
export type ClickEvent = typeof clickEvents.$inferSelect;

// Payment requests table for direct debit setup
export const paymentRequests = pgTable("payment_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  package: varchar("package").notNull(), // 'basic' or 'premium'
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone").notNull(),
  businessName: varchar("business_name").notNull(),
  accountHolderName: varchar("account_holder_name").notNull(),
  sortCode: varchar("sort_code").notNull(),
  accountNumber: varchar("account_number").notNull(),
  address: varchar("address").notNull(),
  city: varchar("city").notNull(),
  postcode: varchar("postcode").notNull(),
  googleBusinessSetup: boolean("google_business_setup").default(false), // £25 add-on
  status: varchar("status").notNull().default("pending"), // 'pending', 'approved', 'active', 'cancelled'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type PaymentRequest = typeof paymentRequests.$inferSelect;
export type InsertPaymentRequest = typeof paymentRequests.$inferInsert;
export type InsertAdminSession = z.infer<typeof insertAdminSessionSchema>;
export type AdminSession = typeof adminSessions.$inferSelect;

// Client onboarding information table
export const clientOnboarding = pgTable("client_onboarding", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: varchar("full_name").notNull(),
  businessName: varchar("business_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  
  // Domain & Hosting
  hasDomain: varchar("has_domain"), // 'yes', 'no', or null
  existingDomain: varchar("existing_domain"),
  desiredDomains: text("desired_domains"),
  
  // Website Content
  businessDescription: text("business_description").notNull(),
  pagesNeeded: text("pages_needed").notNull(),
  textContent: text("text_content"),
  hasImages: text("has_images").default("false"), // stored as string for consistency
  
  // Design Preferences
  hasLogo: text("has_logo").default("false"), // stored as string for consistency
  colorScheme: varchar("color_scheme").notNull(),
  exampleWebsites: text("example_websites"),
  
  // Extras
  wantsContactForm: text("wants_contact_form").default("false"), // stored as string for consistency
  googleBusinessSetup: text("google_business_setup").default("false"), // stored as string for consistency
  socialMediaLinks: text("social_media_links"),
  specialRequests: text("special_requests"),
  
  // Package selection
  selectedPackage: varchar("selected_package").notNull(), // 'basic' or 'premium'
  
  status: varchar("status").notNull().default("new"), // 'new', 'in_progress', 'completed', 'cancelled'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertClientOnboardingSchema = createInsertSchema(clientOnboarding).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export type ClientOnboarding = typeof clientOnboarding.$inferSelect;
export type InsertClientOnboarding = z.infer<typeof insertClientOnboardingSchema>;

// Consultation requests table for custom pricing
export const consultationRequests = pgTable("consultation_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Contact Information
  fullName: varchar("full_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone").notNull(),
  businessName: varchar("business_name").notNull(),
  
  // Project Configuration
  serviceType: varchar("service_type").notNull(),
  projectComplexity: varchar("project_complexity").notNull(),
  timeline: varchar("timeline").notNull(),
  
  // Additional Services (stored as boolean)
  seoSetup: boolean("seo_setup").default(false),
  contentWriting: boolean("content_writing").default(false),
  ongoingSupport: boolean("ongoing_support").default(false),
  customIntegrations: boolean("custom_integrations").default(false),
  ecommerceFeatures: boolean("ecommerce_features").default(false),
  
  // Project Details
  projectDescription: text("project_description").notNull(),
  specialRequests: text("special_requests"),
  
  // Pricing
  estimatedPrice: integer("estimated_price").notNull(),
  
  status: varchar("status").notNull().default("pending"), // 'pending', 'quoted', 'accepted', 'rejected'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertConsultationRequestSchema = createInsertSchema(consultationRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export type ConsultationRequest = typeof consultationRequests.$inferSelect;
export type InsertConsultationRequest = z.infer<typeof insertConsultationRequestSchema>;
