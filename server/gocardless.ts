import { Request, Response } from 'express';
import { storage } from './storage';
import { createRequire } from 'module';

// Use createRequire for GoCardless CommonJS modules
const require = createRequire(import.meta.url);
const gocardless = require('gocardless-nodejs');
const constants = require('gocardless-nodejs/constants');

// GoCardless client instance
let gc: any;

async function initializeGoCardless() {
  if (!gc) {
    if (!process.env.GOCARDLESS_API_KEY) {
      console.warn('GOCARDLESS_API_KEY environment variable not set - GoCardless features will be unavailable');
      gc = null;
      return gc;
    }

    try {
      const environment = process.env.GOCARDLESS_ENVIRONMENT || 'sandbox';
      const accessToken = process.env.GOCARDLESS_API_KEY;
      
      // Determine environment constant
      const environmentConstant = environment === 'live' 
        ? constants.Environments.Live 
        : constants.Environments.Sandbox;
      
      // Initialize GoCardless client
      gc = gocardless(accessToken, environmentConstant);
      
      console.log(`GoCardless client initialized in ${environment} mode`);
    } catch (error) {
      console.error('Failed to initialize GoCardless:', error);
      gc = null;
    }
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
  // Create a billing request and return payment link (Billing Request Flow)
  async createPaymentLink(paymentData: {
    email: string;
    firstName: string;
    lastName: string;
    addressLine1: string;
    city: string;
    postalCode: string;
    setupFeeAmount: number; // in pence
    description: string;
    customerId: string;
    redirectUri?: string;
    exitUri?: string;
  }) {
    try {
      const client = await initializeGoCardless();
      
      if (!client) {
        throw new Error('GoCardless client not initialized. Please check API credentials.');
      }
      
      // Step 1: Create Billing Request with both payment and mandate
      const billingRequest = await client.billingRequests.create({
        payment_request: {
          description: paymentData.description,
          amount: paymentData.setupFeeAmount,
          currency: 'GBP',
          app_fee: null,
        },
        mandate_request: {
          currency: 'GBP',
          scheme: 'bacs', // UK Direct Debit
        },
        metadata: {
          customer_id: paymentData.customerId,
        }
      });

      console.log('Billing request created:', JSON.stringify(billingRequest, null, 2));

      // Extract billing request ID from response
      const billingRequestId = billingRequest?.billingRequests?.id || billingRequest?.id;
      
      if (!billingRequestId) {
        console.error('No billing request ID in response:', billingRequest);
        throw new Error('Failed to create billing request - no ID returned');
      }

      // Step 2: Create Billing Request Flow to generate payment link
      const baseUrl = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
        : 'http://localhost:5000';
      
      const flow = await client.billingRequestFlows.create({
        redirect_uri: paymentData.redirectUri || `${baseUrl}/customer-dashboard?payment=success`,
        exit_uri: paymentData.exitUri || `${baseUrl}/customer-dashboard?payment=cancelled`,
        lock_customer_details: false,
        lock_bank_account: false,
        prefilled_customer: {
          given_name: paymentData.firstName,
          family_name: paymentData.lastName,
          email: paymentData.email,
          address_line1: paymentData.addressLine1,
          city: paymentData.city,
          postal_code: paymentData.postalCode,
          country_code: 'GB',
        },
        links: {
          billing_request: billingRequestId,
        },
      });

      console.log('Billing request flow created:', JSON.stringify(flow, null, 2));

      // Extract authorization URL from response
      const authUrl = flow?.billingRequestFlows?.authorisation_url || flow?.authorisation_url;
      
      if (!authUrl) {
        console.error('No authorization URL in response:', flow);
        throw new Error('Failed to create payment link - no URL returned');
      }

      return {
        billingRequestId: billingRequestId,
        authorizationUrl: authUrl,
      };
    } catch (error) {
      console.error('GoCardless billing request creation error:', error);
      throw error;
    }
  }

  // Create a customer in GoCardless (legacy - kept for backward compatibility)
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
      const client = await initializeGoCardless();
      const response = await client.customers.create({
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
      const client = await initializeGoCardless();
      const bankAccountResponse = await client.customerBankAccounts.create({
        account_holder_name: bankAccount.accountHolderName,
        account_number: bankAccount.accountNumber,
        branch_code: bankAccount.sortCode,
        country_code: 'GB',
        links: {
          customer: customerId,
        },
      });

      // Create mandate for direct debit
      const mandateResponse = await client.mandates.create({
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
      const client = await initializeGoCardless();
      const response = await client.payments.create({
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
      googleBusinessSetup,
      clientOnboardingId // NEW: Link to onboarding record if present
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

    // Fetch onboarding data if available to get clientCode and password
    let clientCode = null;
    let portalPassword = null;
    if (clientOnboardingId) {
      const onboarding = await storage.getClientOnboarding(clientOnboardingId);
      if (onboarding) {
        clientCode = onboarding.clientCode;
        portalPassword = onboarding.portalPassword;
      }
    }

    // Create customer in our database
    const customer = await storage.createCustomer({
      firstName,
      lastName,
      email,
      phone,
      businessName,
      clientCode: clientCode || undefined,
      password: portalPassword || undefined,
      gocardlessCustomerId: gocardlessCustomer.id,
      gocardlessMandateId: mandate.id,
      package: packageType,
      googleBusinessSetup: googleBusinessSetup || false,
      subscriptionStatus: 'inactive',
      monthlyFee: 1000, // £10 in pence
      clientOnboardingId: clientOnboardingId || undefined, // Link to onboarding record
    });

    // Calculate setup fee
    const setupFee = packageType === 'premium' ? 15000 : 7500; // £150 or £75 in pence
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
      clientOnboardingId: clientOnboardingId || undefined, // Link to onboarding record
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

    console.log('Received GoCardless webhook:', event.action, event.resource_type);

    switch (event.action) {
      case 'fulfilled':
      case 'completed':
        if (event.resource_type === 'billing_requests') {
          await handleBillingRequestEvent(event);
        }
        break;
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

async function handleBillingRequestEvent(event: any) {
  try {
    console.log('Processing billing request event:', event);
    
    // Validate event structure
    if (event.resource_type !== 'billing_requests') {
      console.error('Invalid resource type for billing request event:', event.resource_type);
      return;
    }
    
    if (!event.links?.billing_request) {
      console.error('Missing billing_request link in event');
      return;
    }
    
    const billingRequestId = event.links.billing_request;
    
    // Find customer by billing request ID
    const customer = await storage.getCustomerByBillingRequestId(billingRequestId);
    
    if (!customer) {
      console.error('Customer not found for billing request:', billingRequestId);
      return;
    }

    const client = await initializeGoCardless();
    
    if (!client) {
      console.error('GoCardless client not initialized - cannot process webhook');
      return;
    }
    
    // Fetch the billing request details
    const billingRequest = await client.billingRequests.find(billingRequestId);
    const brData = billingRequest.billingRequests;
    
    console.log('Billing request fulfilled:', brData);

    // Extract mandate and payment info from billing request
    const mandateId = brData.mandate_request?.links?.mandate;
    const paymentId = brData.payment_request?.links?.payment;
    const gcCustomerId = brData.links?.customer;

    if (!mandateId || !gcCustomerId) {
      console.error('Missing mandate or customer ID in billing request');
      return;
    }

    // Update customer with GoCardless details
    await storage.updateCustomer(customer.id, {
      gocardlessCustomerId: gcCustomerId,
      gocardlessMandateId: mandateId,
      subscriptionStatus: 'active',
    });

    console.log(`Updated customer ${customer.id} with mandate ${mandateId}`);

    // Create monthly subscription (starts next month)
    const subscriptionStartDate = new Date();
    subscriptionStartDate.setMonth(subscriptionStartDate.getMonth() + 1);
    subscriptionStartDate.setDate(1); // First of next month

    try {
      const subscription = await gocardlessService.createSubscription({
        amount: 1000, // £10 in pence
        name: `Monthly hosting and support for ${customer.businessName || customer.email}`,
        mandateId: mandateId,
        customerId: customer.id,
        startDate: subscriptionStartDate.toISOString().split('T')[0],
      });

      console.log(`Created subscription for customer ${customer.id}`);

      // Update customer with subscription dates
      await storage.updateCustomer(customer.id, {
        subscriptionStartDate,
        nextBillingDate: subscriptionStartDate,
      });
    } catch (subError) {
      console.error('Failed to create subscription:', subError);
      // Continue anyway - payment was successful
    }

    // Mark setup fees as paid when payment is confirmed
    if (paymentId) {
      await storage.updateCustomer(customer.id, {
        setupFeesPaid: true,
      });

      // Also update client_onboarding if linked
      if (customer.clientOnboardingId) {
        await storage.updateClientOnboardingPaymentStatus(customer.clientOnboardingId, true);
        console.log(`Updated client_onboarding ${customer.clientOnboardingId} setupFeesPaid to true`);
      }

      // AUTO-CREATE PROJECT when payment is confirmed
      try {
        const existingProjects = await storage.getProjectsByCustomer(customer.id);
        if (existingProjects.length === 0) {
          let onboarding = null;
          if (customer.clientOnboardingId) {
            onboarding = await storage.getClientOnboarding(customer.clientOnboardingId);
          }

          const project = await storage.createProject({
            customerId: customer.id,
            projectName: `${customer.businessName || customer.firstName + ' ' + customer.lastName} Website`,
            projectDescription: onboarding?.businessDescription || `${customer.package} website development project`,
            status: 'planning',
            priority: 'medium',
            domainName: onboarding?.existingDomain || null,
            estimatedCompletionDate: onboarding?.desiredCompletionDate || null
          });
          
          console.log(`✅ AUTO-CREATED PROJECT: ${project.id} for customer ${customer.id} (${customer.email})`);
        }
      } catch (error) {
        console.error('Failed to auto-create project:', error);
        // Don't throw - we don't want to break the webhook
      }
    }

  } catch (error) {
    console.error('Error handling billing request event:', error);
    throw error;
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

  // If setup fee payment completed, mark customer as setup fees paid AND auto-create project
  if (paymentDetails.status === 'confirmed') {
    const transaction = await storage.getTransactionByGoCardlessId(payment);
    if (transaction && transaction.type === 'setup_fee') {
      // Update customer table
      await storage.updateCustomer(transaction.customerId, {
        setupFeesPaid: true,
      });
      
      // ALSO update client_onboarding if this payment came from onboarding flow
      if (transaction.clientOnboardingId) {
        await storage.updateClientOnboardingPaymentStatus(transaction.clientOnboardingId, true);
        console.log(`Updated client_onboarding ${transaction.clientOnboardingId} setupFeesPaid to true`);
      }
      
      // AUTO-CREATE PROJECT when payment is confirmed
      try {
        const customer = await storage.getCustomer(transaction.customerId);
        if (customer && customer.clientOnboardingId) {
          const onboarding = await storage.getClientOnboarding(customer.clientOnboardingId);
          if (onboarding) {
            // Check if project already exists for this customer
            const existingProjects = await storage.getProjectsByCustomer(customer.id);
            if (existingProjects.length === 0) {
              // Create initial project
              const project = await storage.createProject({
                customerId: customer.id,
                projectName: `${onboarding.businessName || customer.businessName || 'Client'} Website`,
                projectDescription: onboarding.businessDescription || null,
                status: 'planning',
                priority: 'medium',
                domainName: onboarding.existingDomain || null,
                estimatedCompletionDate: onboarding.desiredCompletionDate || null
              });
              console.log(`✅ AUTO-CREATED PROJECT: ${project.id} for customer ${customer.id} (${customer.email})`);
            } else {
              console.log(`Project already exists for customer ${customer.id}, skipping auto-creation`);
            }
          }
        }
      } catch (error) {
        console.error('Failed to auto-create project:', error);
        // Don't throw - we don't want to break the webhook if project creation fails
      }
    }
  }
}

async function handleSubscriptionEvent(event: any) {
  // Handle subscription status changes
  console.log('Subscription event:', event);
  // Add subscription event handling logic here
}