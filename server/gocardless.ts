import { Request, Response } from 'express';
import { storage } from './storage';

// Use dynamic import for GoCardless to handle CommonJS module
let gc: any;

async function initializeGoCardless() {
  if (!gc) {
    const gocardless = await import('gocardless-nodejs');
    const constants = await import('gocardless-nodejs/constants');
    
    if (!process.env.GOCARDLESS_API_KEY) {
      throw new Error('GOCARDLESS_API_KEY environment variable must be set');
    }

    gc = gocardless.default(
      process.env.GOCARDLESS_API_KEY,
      process.env.NODE_ENV === 'production' 
        ? constants.Environments.Live 
        : constants.Environments.Sandbox
    );
  }
  return gc;
}

export interface PaymentIntentData {
  amount: number; // in pence
  currency: string;
  description: string;
  customerId: string;
  type: 'setup_fee' | 'monthly_subscription' | 'addon' | 'change_request';
}

export class GoCardlessService {
  // Create a customer in GoCardless
  async createCustomer(customerData: {
    email: string;
    firstName: string;
    lastName: string;
    addressLine1: string;
    city: string;
    postalCode: string;
    countryCode: string;
  }) {
    try {
      const response = await gc.customers.create({
        email: customerData.email,
        given_name: customerData.firstName,
        family_name: customerData.lastName,
        address_line1: customerData.addressLine1,
        city: customerData.city,
        postal_code: customerData.postalCode,
        country_code: customerData.countryCode,
      });
      
      return response.customers;
    } catch (error) {
      console.error('GoCardless customer creation error:', error);
      throw error;
    }
  }

  // Create a direct debit mandate
  async createMandate(customerId: string, bankAccount: {
    accountHolderName: string;
    sortCode: string;
    accountNumber: string;
  }) {
    try {
      // Create customer bank account
      const bankAccountResponse = await gc.customerBankAccounts.create({
        account_holder_name: bankAccount.accountHolderName,
        account_number: bankAccount.accountNumber,
        branch_code: bankAccount.sortCode,
        country_code: 'GB',
        links: {
          customer: customerId,
        },
      });

      // Create mandate for direct debit
      const mandateResponse = await gc.mandates.create({
        links: {
          customer_bank_account: bankAccountResponse.customerBankAccounts.id,
        },
        scheme: 'bacs', // UK direct debit scheme
      });

      return {
        bankAccount: bankAccountResponse.customerBankAccounts,
        mandate: mandateResponse.mandates,
      };
    } catch (error) {
      console.error('GoCardless mandate creation error:', error);
      throw error;
    }
  }

  // Create a one-time payment
  async createPayment(paymentData: PaymentIntentData & { mandateId: string }) {
    try {
      const response = await gc.payments.create({
        amount: paymentData.amount,
        currency: paymentData.currency,
        description: paymentData.description,
        links: {
          mandate: paymentData.mandateId,
        },
        metadata: {
          customer_id: paymentData.customerId,
          payment_type: paymentData.type,
        },
      });

      return response.payments;
    } catch (error) {
      console.error('GoCardless payment creation error:', error);
      throw error;
    }
  }

  // Create a subscription for recurring monthly payments
  async createSubscription(subscriptionData: {
    amount: number; // in pence
    name: string;
    mandateId: string;
    customerId: string;
    startDate?: string; // ISO date string
  }) {
    try {
      const response = await gc.subscriptions.create({
        amount: subscriptionData.amount,
        currency: 'GBP',
        name: subscriptionData.name,
        interval_unit: 'monthly',
        interval: 1,
        links: {
          mandate: subscriptionData.mandateId,
        },
        start_date: subscriptionData.startDate,
        metadata: {
          customer_id: subscriptionData.customerId,
        },
      });

      return response.subscriptions;
    } catch (error) {
      console.error('GoCardless subscription creation error:', error);
      throw error;
    }
  }

  // Get payment status
  async getPaymentStatus(paymentId: string) {
    try {
      const response = await gc.payments.find(paymentId);
      return response.payments;
    } catch (error) {
      console.error('GoCardless payment status error:', error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string) {
    try {
      const response = await gc.subscriptions.cancel(subscriptionId);
      return response.subscriptions;
    } catch (error) {
      console.error('GoCardless subscription cancellation error:', error);
      throw error;
    }
  }

  // Retry failed payment
  async retryFailedPayment(paymentId: string) {
    try {
      const response = await gc.payments.retry(paymentId);
      return response.payments;
    } catch (error) {
      console.error('GoCardless payment retry error:', error);
      throw error;
    }
  }
}

export const gocardlessService = new GoCardlessService();

// Express route handlers for GoCardless integration
export async function setupDirectDebit(req: Request, res: Response) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      businessName,
      address,
      city,
      postcode,
      accountHolderName,
      sortCode,
      accountNumber,
      package: packageType,
      googleBusinessSetup
    } = req.body;

    // Create customer in GoCardless
    const gocardlessCustomer = await gocardlessService.createCustomer({
      email,
      firstName,
      lastName,
      addressLine1: address,
      city,
      postalCode: postcode,
      countryCode: 'GB',
    });

    // Create bank account and mandate
    const { mandate } = await gocardlessService.createMandate(
      gocardlessCustomer.id,
      {
        accountHolderName,
        sortCode: sortCode.replace(/\s/g, ''), // Remove spaces
        accountNumber,
      }
    );

    // Create customer in our database
    const customer = await storage.createCustomer({
      firstName,
      lastName,
      email,
      phone,
      businessName,
      gocardlessCustomerId: gocardlessCustomer.id,
      gocardlessMandateId: mandate.id,
      package: packageType,
      googleBusinessSetup: googleBusinessSetup || false,
      subscriptionStatus: 'inactive',
      monthlyFee: 1000, // £10 in pence
    });

    // Calculate setup fee
    const setupFee = packageType === 'premium' ? 15000 : 5000; // £150 or £50 in pence
    const googleFee = googleBusinessSetup ? 2500 : 0; // £25 in pence
    const totalSetupFee = setupFee + googleFee;

    // Create setup fee payment
    const setupPayment = await gocardlessService.createPayment({
      amount: totalSetupFee,
      currency: 'GBP',
      description: `Setup fee for ${packageType} website package${googleBusinessSetup ? ' + Google Business setup' : ''}`,
      customerId: customer.id,
      mandateId: mandate.id,
      type: 'setup_fee',
    });

    // Record setup fee transaction
    await storage.createTransaction({
      customerId: customer.id,
      gocardlessPaymentId: setupPayment.id,
      type: 'setup_fee',
      description: `Setup fee for ${packageType} website package${googleBusinessSetup ? ' + Google Business setup' : ''}`,
      amount: totalSetupFee,
      currency: 'GBP',
      status: 'pending',
      billingDate: new Date(),
    });

    // Create monthly subscription (starts next month)
    const subscriptionStartDate = new Date();
    subscriptionStartDate.setMonth(subscriptionStartDate.getMonth() + 1);
    subscriptionStartDate.setDate(1); // First of next month

    const subscription = await gocardlessService.createSubscription({
      amount: 1000, // £10 in pence
      name: `Monthly hosting and support for ${businessName}`,
      mandateId: mandate.id,
      customerId: customer.id,
      startDate: subscriptionStartDate.toISOString().split('T')[0],
    });

    // Update customer with subscription info
    await storage.updateCustomer(customer.id, {
      subscriptionStatus: 'active',
      subscriptionStartDate,
      nextBillingDate: subscriptionStartDate,
    });

    // Create initial project
    await storage.createProject({
      customerId: customer.id,
      projectName: `${packageType.charAt(0).toUpperCase() + packageType.slice(1)} Website for ${businessName}`,
      projectDescription: `${packageType} website development project`,
      status: 'planning',
      priority: 'medium',
    });

    res.json({
      success: true,
      message: 'Direct debit setup successful! Setup fee will be collected within 3 business days.',
      customer: {
        id: customer.id,
        email: customer.email,
        setupFee: totalSetupFee / 100, // Convert back to pounds for display
        monthlyFee: 10,
        nextBillingDate: subscriptionStartDate,
      },
    });

  } catch (error) {
    console.error('Direct debit setup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to setup direct debit. Please try again or contact support.',
    });
  }
}

export async function processWebhook(req: Request, res: Response) {
  try {
    const event = req.body;

    switch (event.action) {
      case 'payments':
        if (event.resource_type === 'payments') {
          await handlePaymentEvent(event);
        }
        break;
      case 'subscriptions':
        if (event.resource_type === 'subscriptions') {
          await handleSubscriptionEvent(event);
        }
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handlePaymentEvent(event: any) {
  const payment = event.links.payment;
  const paymentDetails = await gocardlessService.getPaymentStatus(payment);
  
  // Update transaction status in database
  await storage.updateTransactionByGoCardlessId(payment, {
    status: paymentDetails.status,
    paidDate: paymentDetails.charge_date ? new Date(paymentDetails.charge_date) : null,
    failureReason: paymentDetails.status === 'failed' ? 'Payment failed' : null,
  });

  // If setup fee payment completed, mark customer as setup fees paid
  if (paymentDetails.status === 'confirmed') {
    const transaction = await storage.getTransactionByGoCardlessId(payment);
    if (transaction && transaction.type === 'setup_fee') {
      await storage.updateCustomer(transaction.customerId, {
        setupFeesPaid: true,
      });
    }
  }
}

async function handleSubscriptionEvent(event: any) {
  // Handle subscription status changes
  console.log('Subscription event:', event);
  // Add subscription event handling logic here
}