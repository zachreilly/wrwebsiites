import { 
  users, 
  contactRequests, 
  pageViews, 
  clickEvents, 
  adminSessions,
  paymentRequests,
  clientOnboarding,
  consultationRequests,
  websiteUpdateRequests,
  customers,
  projects,
  designApprovals,
  changeRequests,
  transactions,
  invoices,
  portfolioItems,
  type User, 
  type InsertUser, 
  type ContactRequest, 
  type InsertContactRequest,
  type PageView,
  type InsertPageView,
  type ClickEvent,
  type InsertClickEvent,
  type AdminSession,
  type InsertAdminSession,
  type PaymentRequest,
  type InsertPaymentRequest,
  type ClientOnboarding,
  type InsertClientOnboarding,
  type ConsultationRequest,
  type InsertConsultationRequest,
  type WebsiteUpdateRequest,
  type InsertWebsiteUpdateRequest,
  type Customer,
  type InsertCustomer,
  type Project,
  type InsertProject,
  type DesignApproval,
  type InsertDesignApproval,
  type ChangeRequest,
  type InsertChangeRequest,
  type Transaction,
  type InsertTransaction,
  type Invoice,
  type InsertInvoice,
  type PortfolioItem,
  type InsertPortfolioItem
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sql, gt } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact request operations
  createContactRequest(request: InsertContactRequest): Promise<ContactRequest>;
  getContactRequests(): Promise<ContactRequest[]>;
  
  // Analytics operations
  logPageView(pageView: InsertPageView): Promise<PageView>;
  logClickEvent(clickEvent: InsertClickEvent): Promise<ClickEvent>;
  getPageViewStats(days?: number): Promise<{ page: string; views: number }[]>;
  getClickEventStats(days?: number): Promise<{ element: string; clicks: number }[]>;
  getTotalPageViews(days?: number): Promise<number>;
  getTotalClickEvents(days?: number): Promise<number>;
  getUniqueVisitors(days?: number): Promise<number>;
  
  // Admin session operations
  createAdminSession(session: InsertAdminSession): Promise<AdminSession>;
  verifyAdminSession(password: string): Promise<AdminSession | undefined>;
  cleanExpiredSessions(): Promise<void>;
  
  // Payment request operations
  createPaymentRequest(request: InsertPaymentRequest): Promise<PaymentRequest>;
  getPaymentRequests(): Promise<PaymentRequest[]>;
  updatePaymentRequestStatus(requestId: string, projectStatus: string): Promise<PaymentRequest>;
  
  // Client onboarding operations
  createClientOnboarding(client: InsertClientOnboarding): Promise<ClientOnboarding>;
  getClientOnboardings(): Promise<ClientOnboarding[]>;
  updateClientOnboardingStatus(id: string, status: string): Promise<ClientOnboarding | undefined>;
  
  // Consultation request operations
  createConsultationRequest(request: InsertConsultationRequest): Promise<ConsultationRequest>;
  getConsultationRequests(): Promise<ConsultationRequest[]>;
  
  // Website update request operations
  createWebsiteUpdateRequest(request: InsertWebsiteUpdateRequest): Promise<WebsiteUpdateRequest>;
  getWebsiteUpdateRequests(): Promise<WebsiteUpdateRequest[]>;
  updateWebsiteUpdateRequestStatus(id: string, status: string): Promise<WebsiteUpdateRequest | undefined>;
  
  // Customer operations
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | undefined>;
  
  // Project operations
  createProject(project: InsertProject): Promise<Project>;
  getProjectsByCustomer(customerId: string): Promise<Project[]>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined>;
  
  // Design approval operations
  createDesignApproval(approval: InsertDesignApproval): Promise<DesignApproval>;
  getDesignApprovalsByProject(projectId: string): Promise<DesignApproval[]>;
  updateDesignApprovalStatus(id: string, status: string, feedback?: string): Promise<DesignApproval | undefined>;
  
  // Change request operations
  createChangeRequest(request: InsertChangeRequest): Promise<ChangeRequest>;
  getChangeRequestsByProject(projectId: string): Promise<ChangeRequest[]>;
  updateChangeRequestStatus(id: string, status: string, response?: string): Promise<ChangeRequest | undefined>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByCustomer(customerId: string): Promise<Transaction[]>;
  updateTransactionByGoCardlessId(gocardlessId: string, updates: Partial<Transaction>): Promise<Transaction | undefined>;
  getTransactionByGoCardlessId(gocardlessId: string): Promise<Transaction | undefined>;
  
  // Invoice operations
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  getInvoicesByCustomer(customerId: string): Promise<Invoice[]>;
  updateInvoiceStatus(id: string, status: string): Promise<Invoice | undefined>;
  
  // Portfolio operations
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  getPortfolioItems(): Promise<PortfolioItem[]>;
  getPublicPortfolioItems(): Promise<PortfolioItem[]>;
  getFeaturedPortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItem(id: string): Promise<PortfolioItem | undefined>;
  updatePortfolioItem(id: string, updates: Partial<PortfolioItem>): Promise<PortfolioItem | undefined>;
  deletePortfolioItem(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Contact request operations
  async createContactRequest(insertRequest: InsertContactRequest): Promise<ContactRequest> {
    const [request] = await db
      .insert(contactRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async getContactRequests(): Promise<ContactRequest[]> {
    return await db
      .select()
      .from(contactRequests)
      .orderBy(desc(contactRequests.createdAt));
  }

  // Analytics operations
  async logPageView(pageView: InsertPageView): Promise<PageView> {
    const [view] = await db
      .insert(pageViews)
      .values(pageView)
      .returning();
    return view;
  }

  async logClickEvent(clickEvent: InsertClickEvent): Promise<ClickEvent> {
    const [event] = await db
      .insert(clickEvents)
      .values(clickEvent)
      .returning();
    return event;
  }

  async getPageViewStats(days = 30): Promise<{ page: string; views: number }[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return await db
      .select({
        page: pageViews.page,
        views: count(),
      })
      .from(pageViews)
      .where(gt(pageViews.createdAt, cutoffDate))
      .groupBy(pageViews.page)
      .orderBy(desc(count()));
  }

  async getClickEventStats(days = 30): Promise<{ element: string; clicks: number }[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return await db
      .select({
        element: clickEvents.element,
        clicks: count(),
      })
      .from(clickEvents)
      .where(gt(clickEvents.createdAt, cutoffDate))
      .groupBy(clickEvents.element)
      .orderBy(desc(count()));
  }

  async getTotalPageViews(days = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const [result] = await db
      .select({ total: count() })
      .from(pageViews)
      .where(gt(pageViews.createdAt, cutoffDate));
    
    return result.total;
  }

  async getTotalClickEvents(days = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const [result] = await db
      .select({ total: count() })
      .from(clickEvents)
      .where(gt(clickEvents.createdAt, cutoffDate));
    
    return result.total;
  }

  async getUniqueVisitors(days = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // Count unique IP addresses that visited the homepage (main website)
    const [result] = await db
      .select({ 
        uniqueVisitors: sql<number>`COUNT(DISTINCT ${pageViews.ipAddress})` 
      })
      .from(pageViews)
      .where(
        sql`${pageViews.page} = '/' AND ${pageViews.createdAt} > ${cutoffDate}`
      );
    
    return result.uniqueVisitors || 0;
  }

  // Admin session operations
  async createAdminSession(insertSession: InsertAdminSession): Promise<AdminSession> {
    const [session] = await db
      .insert(adminSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async verifyAdminSession(password: string): Promise<AdminSession | undefined> {
    const [session] = await db
      .select()
      .from(adminSessions)
      .where(
        sql`${adminSessions.password} = ${password} AND ${adminSessions.expiresAt} > NOW()`
      );
    
    return session;
  }

  async cleanExpiredSessions(): Promise<void> {
    await db
      .delete(adminSessions)
      .where(sql`${adminSessions.expiresAt} < NOW()`);
  }

  // Payment request operations
  async createPaymentRequest(insertRequest: InsertPaymentRequest): Promise<PaymentRequest> {
    const [request] = await db
      .insert(paymentRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async getPaymentRequests(): Promise<PaymentRequest[]> {
    return await db
      .select()
      .from(paymentRequests)
      .orderBy(desc(paymentRequests.createdAt));
  }

  async updatePaymentRequestStatus(requestId: string, projectStatus: string): Promise<PaymentRequest> {
    const [updated] = await db
      .update(paymentRequests)
      .set({ 
        projectStatus,
        updatedAt: new Date()
      })
      .where(eq(paymentRequests.id, requestId))
      .returning();
    
    if (!updated) {
      throw new Error('Payment request not found');
    }
    
    return updated;
  }

  // Client onboarding operations
  async createClientOnboarding(insertClient: InsertClientOnboarding): Promise<ClientOnboarding> {
    // Convert boolean values to strings for database storage
    const clientData = {
      ...insertClient,
      hasImages: insertClient.hasImages?.toString() || "false",
      hasLogo: insertClient.hasLogo?.toString() || "false", 
      wantsContactForm: insertClient.wantsContactForm?.toString() || "false"
    };
    
    const [client] = await db
      .insert(clientOnboarding)
      .values(clientData)
      .returning();
    return client;
  }

  async getClientOnboardings(): Promise<ClientOnboarding[]> {
    return await db
      .select()
      .from(clientOnboarding)
      .orderBy(clientOnboarding.createdAt); // Oldest first for priority
  }

  async updateClientOnboardingStatus(id: string, status: string): Promise<ClientOnboarding | undefined> {
    const [updated] = await db
      .update(clientOnboarding)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(clientOnboarding.id, id))
      .returning();
    
    return updated;
  }

  async updateConsultationStatus(id: string, status: string): Promise<ConsultationRequest | undefined> {
    const [updated] = await db
      .update(consultationRequests)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(consultationRequests.id, id))
      .returning();
    
    return updated;
  }

  // Consultation request operations
  async createConsultationRequest(request: InsertConsultationRequest): Promise<ConsultationRequest> {
    const [consultation] = await db
      .insert(consultationRequests)
      .values(request)
      .returning();
    return consultation;
  }

  async getConsultationRequests(): Promise<ConsultationRequest[]> {
    return await db
      .select()
      .from(consultationRequests)
      .orderBy(desc(consultationRequests.createdAt));
  }

  // Website update request operations
  async createWebsiteUpdateRequest(request: InsertWebsiteUpdateRequest): Promise<WebsiteUpdateRequest> {
    const [updateRequest] = await db
      .insert(websiteUpdateRequests)
      .values(request)
      .returning();
    return updateRequest;
  }

  async getWebsiteUpdateRequests(): Promise<WebsiteUpdateRequest[]> {
    return await db
      .select()
      .from(websiteUpdateRequests)
      .orderBy(desc(websiteUpdateRequests.createdAt));
  }

  async updateWebsiteUpdateRequestStatus(id: string, status: string): Promise<WebsiteUpdateRequest | undefined> {
    const [updated] = await db
      .update(websiteUpdateRequests)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(websiteUpdateRequests.id, id))
      .returning();
    
    return updated;
  }

  // Customer operations
  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const [customer] = await db
      .insert(customers)
      .values(insertCustomer)
      .returning();
    return customer;
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.email, email));
    return customer;
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | undefined> {
    const [updated] = await db
      .update(customers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning();
    return updated;
  }

  // Project operations
  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  async getProjectsByCustomer(customerId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.customerId, customerId))
      .orderBy(desc(projects.createdAt));
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined> {
    const [updated] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updated;
  }

  // Design approval operations
  async createDesignApproval(insertApproval: InsertDesignApproval): Promise<DesignApproval> {
    const [approval] = await db
      .insert(designApprovals)
      .values(insertApproval)
      .returning();
    return approval;
  }

  async getDesignApprovalsByProject(projectId: string): Promise<DesignApproval[]> {
    return await db
      .select()
      .from(designApprovals)
      .where(eq(designApprovals.projectId, projectId))
      .orderBy(desc(designApprovals.submittedAt));
  }

  async updateDesignApprovalStatus(id: string, status: string, feedback?: string): Promise<DesignApproval | undefined> {
    const [updated] = await db
      .update(designApprovals)
      .set({ 
        status, 
        customerFeedback: feedback,
        respondedAt: new Date()
      })
      .where(eq(designApprovals.id, id))
      .returning();
    return updated;
  }

  // Change request operations
  async createChangeRequest(insertRequest: InsertChangeRequest): Promise<ChangeRequest> {
    const [request] = await db
      .insert(changeRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async getChangeRequestsByProject(projectId: string): Promise<ChangeRequest[]> {
    return await db
      .select()
      .from(changeRequests)
      .where(eq(changeRequests.projectId, projectId))
      .orderBy(desc(changeRequests.createdAt));
  }

  async updateChangeRequestStatus(id: string, status: string, response?: string): Promise<ChangeRequest | undefined> {
    const [updated] = await db
      .update(changeRequests)
      .set({ 
        status, 
        adminResponse: response,
        updatedAt: new Date()
      })
      .where(eq(changeRequests.id, id))
      .returning();
    return updated;
  }

  // Transaction operations
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async getTransactionsByCustomer(customerId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.customerId, customerId))
      .orderBy(desc(transactions.billingDate));
  }

  async updateTransactionByGoCardlessId(gocardlessId: string, updates: Partial<Transaction>): Promise<Transaction | undefined> {
    const [updated] = await db
      .update(transactions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(transactions.gocardlessPaymentId, gocardlessId))
      .returning();
    return updated;
  }

  async getTransactionByGoCardlessId(gocardlessId: string): Promise<Transaction | undefined> {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.gocardlessPaymentId, gocardlessId));
    return transaction;
  }

  // Invoice operations
  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db
      .insert(invoices)
      .values(insertInvoice)
      .returning();
    return invoice;
  }

  async getInvoicesByCustomer(customerId: string): Promise<Invoice[]> {
    return await db
      .select()
      .from(invoices)
      .where(eq(invoices.customerId, customerId))
      .orderBy(desc(invoices.issueDate));
  }

  async updateInvoiceStatus(id: string, status: string): Promise<Invoice | undefined> {
    const [updated] = await db
      .update(invoices)
      .set({ 
        status,
        paidDate: status === 'paid' ? new Date() : undefined,
        updatedAt: new Date()
      })
      .where(eq(invoices.id, id))
      .returning();
    return updated;
  }

  // Portfolio operations
  async createPortfolioItem(insertItem: InsertPortfolioItem): Promise<PortfolioItem> {
    const [item] = await db
      .insert(portfolioItems)
      .values(insertItem)
      .returning();
    return item;
  }

  async getPortfolioItems(): Promise<PortfolioItem[]> {
    return await db
      .select()
      .from(portfolioItems)
      .orderBy(desc(portfolioItems.displayOrder), desc(portfolioItems.createdAt));
  }

  async getPublicPortfolioItems(): Promise<PortfolioItem[]> {
    return await db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.isPublic, true))
      .orderBy(desc(portfolioItems.displayOrder), desc(portfolioItems.createdAt));
  }

  async getFeaturedPortfolioItems(): Promise<PortfolioItem[]> {
    return await db
      .select()
      .from(portfolioItems)
      .where(sql`${portfolioItems.isPublic} = true AND ${portfolioItems.isFeatured} = true`)
      .orderBy(desc(portfolioItems.displayOrder), desc(portfolioItems.createdAt));
  }

  async getPortfolioItem(id: string): Promise<PortfolioItem | undefined> {
    const [item] = await db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.id, id));
    return item;
  }

  async updatePortfolioItem(id: string, updates: Partial<PortfolioItem>): Promise<PortfolioItem | undefined> {
    const [updated] = await db
      .update(portfolioItems)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(portfolioItems.id, id))
      .returning();
    return updated;
  }

  async deletePortfolioItem(id: string): Promise<void> {
    await db
      .delete(portfolioItems)
      .where(eq(portfolioItems.id, id));
  }
}

export const storage = new DatabaseStorage();