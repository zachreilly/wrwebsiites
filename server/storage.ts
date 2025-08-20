import { 
  users, 
  contactRequests, 
  pageViews, 
  clickEvents, 
  adminSessions,
  paymentRequests,
  clientOnboarding,
  consultationRequests,
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
  type InsertConsultationRequest
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
  
  // Client onboarding operations
  createClientOnboarding(client: InsertClientOnboarding): Promise<ClientOnboarding>;
  getClientOnboardings(): Promise<ClientOnboarding[]>;
  updateClientOnboardingStatus(id: string, status: string): Promise<ClientOnboarding | undefined>;
  
  // Consultation request operations
  createConsultationRequest(request: InsertConsultationRequest): Promise<ConsultationRequest>;
  getConsultationRequests(): Promise<ConsultationRequest[]>;
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
}

export const storage = new DatabaseStorage();