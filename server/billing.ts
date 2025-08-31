import { storage } from './storage';
import { gocardlessService } from './gocardless';

// Automated billing system for monthly recurring payments
export class BillingService {
  
  // Process monthly subscription billing for all active customers
  async processMonthlyBilling() {
    try {
      console.log('Starting monthly billing process...');
      
      // For now, this is a placeholder - GoCardless handles recurring billing automatically
      // We'll track payments through webhooks instead
      console.log('Monthly billing is handled automatically by GoCardless subscriptions');
      
    } catch (error) {
      console.error('Monthly billing process failed:', error);
    }
  }

  // Process billing for a specific customer
  async processCustomerBilling(customer: any) {
    try {
      // Create monthly payment through GoCardless subscription
      const paymentDescription = `Monthly hosting and support - ${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`;
      
      // Record transaction in our database
      const transaction = await storage.createTransaction({
        customerId: customer.id,
        type: 'monthly_subscription',
        description: paymentDescription,
        amount: customer.monthlyFee, // £10 in pence
        currency: 'GBP',
        status: 'pending',
        billingDate: new Date(),
      });

      // Update customer's next billing date (30 days from now)
      const nextBilling = new Date();
      nextBilling.setDate(nextBilling.getDate() + 30);
      
      await storage.updateCustomer(customer.id, {
        nextBillingDate: nextBilling,
      });

      // Create invoice record
      await storage.createInvoice({
        customerId: customer.id,
        invoiceNumber: `INV-${Date.now()}-${customer.id.slice(-4)}`,
        subtotal: customer.monthlyFee,
        total: customer.monthlyFee,
        status: 'sent',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        description: paymentDescription
      });

      console.log(`Billing processed for customer ${customer.email} - £${customer.monthlyFee / 100}`);
      
    } catch (error) {
      console.error(`Customer billing error for ${customer.id}:`, error);
      
      // Mark customer billing as failed and schedule retry
      await storage.updateCustomer(customer.id, {
        subscriptionStatus: 'payment_failed',
      });
      
      throw error;
    }
  }

  // Handle failed payment recovery
  async retryFailedPayments() {
    try {
      console.log('Processing failed payment retries...');
      
      // Note: getCustomersWithFailedPayments method not implemented yet
      const failedCustomers: any[] = []; // await storage.getCustomersWithFailedPayments();
      
      for (const customer of failedCustomers) {
        try {
          // Attempt to retry payment through GoCardless
          if (customer.gocardlessSubscriptionId) {
            // GoCardless automatically retries failed payments, so we just need to check status
            // Note: getSubscriptionStatus method not implemented yet
            const subscriptionStatus = { status: 'active' }; // await gocardlessService.getSubscriptionStatus(customer.gocardlessSubscriptionId);
            
            if (subscriptionStatus.status === 'active') {
              // Payment recovered
              await storage.updateCustomer(customer.id, {
                subscriptionStatus: 'active',
              });
              console.log(`Payment recovered for customer ${customer.email}`);
            }
          }
        } catch (error) {
          console.error(`Failed payment retry error for customer ${customer.id}:`, error);
        }
      }
      
    } catch (error) {
      console.error('Failed payment retry process failed:', error);
    }
  }

  // Send billing notifications and reminders
  async sendBillingNotifications() {
    try {
      // Get customers with upcoming billing dates (3 days notice)
      // Note: getCustomersWithUpcomingBilling method not implemented yet
      const upcomingBilling: any[] = []; // await storage.getCustomersWithUpcomingBilling(3);
      
      for (const customer of upcomingBilling) {
        // In a real implementation, send email notification
        console.log(`Billing reminder for ${customer.email} - next billing: ${customer.nextBillingDate}`);
        
        // Update notification sent flag
        // Note: lastNotificationSent field not in schema
        // await storage.updateCustomer(customer.id, { lastNotificationSent: new Date() });
      }
      
    } catch (error) {
      console.error('Billing notification process failed:', error);
    }
  }

  // Generate monthly billing report
  async generateMonthlyReport() {
    try {
      const currentMonth = new Date();
      const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
      const thisMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      
      // Note: getBillingReport method not implemented yet
    const report = { 
      totalRevenue: 0, 
      successfulPayments: 0, 
      failedPayments: 0, 
      newCustomers: 0, 
      activeSubscriptions: 0 
    }; // await storage.getBillingReport(lastMonth, thisMonth);
      
      return {
        period: `${lastMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`,
        totalRevenue: report.totalRevenue,
        successfulPayments: report.successfulPayments,
        failedPayments: report.failedPayments,
        newCustomers: report.newCustomers,
        activeSubscriptions: report.activeSubscriptions
      };
      
    } catch (error) {
      console.error('Monthly report generation failed:', error);
      throw error;
    }
  }
}

export const billingService = new BillingService();

// Cron job functions for automated billing
export async function runDailyBillingTasks() {
  console.log('Running daily billing tasks...');
  
  // Check for customers due for billing today
  await billingService.processMonthlyBilling();
  
  // Retry failed payments
  await billingService.retryFailedPayments();
  
  // Send billing notifications
  await billingService.sendBillingNotifications();
  
  console.log('Daily billing tasks completed');
}

// Setup automated billing schedule (would typically use a cron job service)
export function setupBillingSchedule() {
  // Run daily billing tasks every day at 9 AM
  const dailyInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  setInterval(async () => {
    const now = new Date();
    if (now.getHours() === 9) { // 9 AM
      await runDailyBillingTasks();
    }
  }, 60 * 60 * 1000); // Check every hour
  
  console.log('Automated billing schedule setup complete');
}