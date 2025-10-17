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
  
  // Template & Design Preferences
  templateStyle: varchar("template_style"), // 'modern', 'classic', 'minimalist', 'bold'
  colorScheme: varchar("color_scheme"), // 'gradient-emerald', 'gradient-blue', 'solid-navy', etc.
  layoutPreference: varchar("layout_preference"), // 'single-page', 'multi-page'
  
  status: varchar("status").notNull().default("pending"), // 'pending', 'approved', 'active', 'cancelled'
  projectStatus: varchar("project_status").notNull().default("pending_payment"), // 'pending_payment', 'paid_pending_build', 'built_awaiting_approval', 'approved', 'published'
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
  templateStyle: varchar("template_style"), // 'modern', 'classic', 'minimalist', 'bold'
  colorScheme: varchar("color_scheme").notNull(),
  layoutPreference: varchar("layout_preference"), // 'single-page', 'multi-page'
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

// Website update requests table
export const websiteUpdateRequests = pgTable("website_update_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Contact Information
  fullName: varchar("full_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone").notNull(),
  businessName: varchar("business_name").notNull(),
  
  // Website Information
  websiteDomain: varchar("website_domain").notNull(),
  currentHostingProvider: varchar("current_hosting_provider"),
  hasWPAccess: varchar("has_wp_access"), // 'yes', 'no'
  wpLoginDetails: text("wp_login_details"), // if they want to share it
  
  // Update Type
  updateType: varchar("update_type").notNull(), // 'basic', 'medium', 'larger'
  updateDescription: text("update_description").notNull(),
  specificChanges: text("specific_changes"),
  
  // Payment Information
  estimatedCost: varchar("estimated_cost"),
  accountHolderName: varchar("account_holder_name"),
  sortCode: varchar("sort_code"),
  accountNumber: varchar("account_number"),
  address: varchar("address"),
  city: varchar("city"),
  postcode: varchar("postcode"),
  
  // Terms agreement
  agreedToTerms: boolean("agreed_to_terms").default(false),
  agreedToDirectDebit: boolean("agreed_to_direct_debit").default(false),
  
  status: varchar("status").notNull().default("pending"), // 'pending', 'quoted', 'approved', 'in_progress', 'completed'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWebsiteUpdateRequestSchema = createInsertSchema(websiteUpdateRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export type WebsiteUpdateRequest = typeof websiteUpdateRequests.$inferSelect;
export type InsertWebsiteUpdateRequest = z.infer<typeof insertWebsiteUpdateRequestSchema>;

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

// Customer table for client portal and subscription management
export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull().unique(),
  phone: varchar("phone"),
  businessName: varchar("business_name"),
  
  // GoCardless customer information
  gocardlessCustomerId: varchar("gocardless_customer_id").unique(),
  gocardlessMandateId: varchar("gocardless_mandate_id"),
  
  // Subscription status
  subscriptionStatus: varchar("subscription_status").default("inactive"), // 'inactive', 'active', 'cancelled', 'paused'
  subscriptionStartDate: timestamp("subscription_start_date"),
  nextBillingDate: timestamp("next_billing_date"),
  
  // Package information
  package: varchar("package").notNull(), // 'basic' or 'premium'
  setupFeesPaid: boolean("setup_fees_paid").default(false),
  monthlyFee: integer("monthly_fee").default(1000), // in pence, so £10.00 = 1000
  googleBusinessSetup: boolean("google_business_setup").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects table for tracking customer projects
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => customers.id),
  
  projectName: varchar("project_name").notNull(),
  projectDescription: text("project_description"),
  status: varchar("status").notNull().default("planning"), // 'planning', 'design', 'development', 'review', 'completed'
  priority: varchar("priority").default("medium"), // 'low', 'medium', 'high'
  
  // Timeline
  estimatedCompletionDate: timestamp("estimated_completion_date"),
  actualCompletionDate: timestamp("actual_completion_date"),
  
  // Project details
  domainName: varchar("domain_name"),
  pagesRequired: text("pages_required"),
  designNotes: text("design_notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Design assets and approvals
export const designApprovals = pgTable("design_approvals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  customerId: varchar("customer_id").notNull().references(() => customers.id),
  
  designType: varchar("design_type").notNull(), // 'mockup', 'homepage', 'logo', 'color_scheme'
  designTitle: varchar("design_title").notNull(),
  designDescription: text("design_description"),
  designImageUrl: varchar("design_image_url"), // for uploaded designs
  
  status: varchar("status").notNull().default("pending"), // 'pending', 'approved', 'rejected', 'revision_requested'
  customerFeedback: text("customer_feedback"),
  
  submittedAt: timestamp("submitted_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
});

// Change requests from customers
export const changeRequests = pgTable("change_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  customerId: varchar("customer_id").notNull().references(() => customers.id),
  
  requestType: varchar("request_type").notNull(), // 'content_change', 'design_change', 'functionality_change'
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  priority: varchar("priority").default("medium"), // 'low', 'medium', 'high', 'urgent'
  
  status: varchar("status").notNull().default("pending"), // 'pending', 'in_progress', 'completed', 'rejected'
  adminResponse: text("admin_response"),
  estimatedHours: integer("estimated_hours"),
  actualHours: integer("actual_hours"),
  additionalCost: integer("additional_cost"), // in pence
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payment transactions and billing history
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => customers.id),
  
  // GoCardless payment information
  gocardlessPaymentId: varchar("gocardless_payment_id").unique(),
  
  type: varchar("type").notNull(), // 'setup_fee', 'monthly_subscription', 'addon', 'change_request'
  description: varchar("description").notNull(),
  amount: integer("amount").notNull(), // in pence
  currency: varchar("currency").default("GBP"),
  
  status: varchar("status").notNull(), // 'pending', 'confirmed', 'paid_out', 'cancelled', 'failed'
  
  // Billing details
  billingDate: timestamp("billing_date").notNull(),
  paidDate: timestamp("paid_date"),
  failureReason: text("failure_reason"),
  
  // Receipt information
  receiptUrl: varchar("receipt_url"),
  receiptSent: boolean("receipt_sent").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Invoices for customer viewing
export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => customers.id),
  
  invoiceNumber: varchar("invoice_number").notNull().unique(),
  
  // Invoice details
  subtotal: integer("subtotal").notNull(), // in pence
  vatAmount: integer("vat_amount").default(0), // in pence
  total: integer("total").notNull(), // in pence
  
  status: varchar("status").notNull().default("draft"), // 'draft', 'sent', 'paid', 'overdue', 'cancelled'
  
  // Dates
  issueDate: timestamp("issue_date").defaultNow(),
  dueDate: timestamp("due_date").notNull(),
  paidDate: timestamp("paid_date"),
  
  // Invoice content
  description: text("description"),
  lineItems: text("line_items"), // JSON string of invoice items
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;
export type DesignApproval = typeof designApprovals.$inferSelect;
export type InsertDesignApproval = typeof designApprovals.$inferInsert;
export type ChangeRequest = typeof changeRequests.$inferSelect;
export type InsertChangeRequest = typeof changeRequests.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDesignApprovalSchema = createInsertSchema(designApprovals).omit({
  id: true,
  submittedAt: true,
});

export const insertChangeRequestSchema = createInsertSchema(changeRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Portfolio/testimonials table for showcasing completed projects
export const portfolioItems = pgTable("portfolio_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Project details
  projectTitle: varchar("project_title").notNull(),
  clientName: varchar("client_name").notNull(),
  websiteUrl: varchar("website_url").notNull(),
  imageUrl: varchar("image_url").notNull(), // Main project image
  
  // Screenshot/image
  screenshotUrl: varchar("screenshot_url"), // URL to screenshot image
  
  // Project categorization
  projectType: varchar("project_type").notNull(), // 'basic', 'premium', 'custom'
  industry: varchar("industry"), // 'restaurant', 'retail', 'services', etc.
  
  // Features/technologies used
  features: text("features"), // JSON string of features used
  
  // Client testimonial (optional)
  testimonialText: text("testimonial_text"),
  clientRating: integer("client_rating"), // 1-5 star rating
  
  // Display settings
  isPublic: boolean("is_public").default(true),
  displayOrder: integer("display_order").default(0),
  isFeatured: boolean("is_featured").default(false),
  
  // Dates
  projectCompletedDate: timestamp("project_completed_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
