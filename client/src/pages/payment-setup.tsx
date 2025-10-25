import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, ArrowLeft, Shield, CreditCard } from "lucide-react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { termsAndConditions, directDebitGuarantee } from "@/components/legal/terms-and-conditions";

const paymentSchema = z.object({
  accountHolderName: z.string().min(1, "Account holder name is required"),
  sortCode: z.string().regex(/^\d{2}-\d{2}-\d{2}$/, "Sort code must be in format XX-XX-XX"),
  accountNumber: z.string().min(6, "Account number must be at least 6 digits").max(8, "Account number must be at most 8 digits"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postcode: z.string().min(1, "Postcode is required"),
  agreedToTerms: z.boolean().refine(val => val === true, "You must agree to the terms"),
  agreedToDirectDebit: z.boolean().refine(val => val === true, "You must agree to the Direct Debit Guarantee"),
});

type PaymentForm = z.infer<typeof paymentSchema>;

export default function PaymentSetupPage() {
  const [, setLocation] = useLocation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [clientCode, setClientCode] = useState<string>('');
  const { toast } = useToast();
  
  // Get client info from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const clientEmail = urlParams.get('email') || '';
  const clientName = urlParams.get('name') || '';
  const businessName = urlParams.get('businessName') || clientName;
  const packageType = urlParams.get('package') || '';
  const clientId = urlParams.get('clientId') || '';
  const urlClientCode = urlParams.get('clientCode') || '';
  const urlPassword = urlParams.get('password') || '';

  const form = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      accountHolderName: clientName,
      sortCode: "",
      accountNumber: "",
      address: "",
      city: "",
      postcode: "",
      agreedToTerms: false,
      agreedToDirectDebit: false,
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: PaymentForm) => {
      // Split name into first and last
      const nameParts = clientName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || nameParts[0] || 'Customer';
      
      return await apiRequest("POST", "/api/payment/direct-debit", {
        firstName,
        lastName,
        email: clientEmail,
        phone: '',
        businessName: businessName,
        package: packageType,
        accountHolderName: data.accountHolderName,
        sortCode: data.sortCode.replace(/-/g, ''),
        accountNumber: data.accountNumber,
        address: data.address,
        city: data.city,
        postcode: data.postcode,
        googleBusinessSetup: false,
        clientOnboardingId: clientId || undefined, // Link to onboarding record if present
      });
    },
    onSuccess: (response: any) => {
      setIsSubmitted(true);
      if (response?.clientCode) {
        setClientCode(response.clientCode);
      }
      toast({
        title: "Payment Setup Complete!",
        description: "Your direct debit has been set up successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Setup Failed",
        description: error.message || "Please check your details and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PaymentForm) => {
    submitMutation.mutate(data);
  };

  const formatSortCode = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 4)}-${numbers.slice(4, 6)}`;
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center px-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-emerald-600 text-center mb-2">Payment Setup Complete!</h2>
            <p className="text-slate-600 text-center mb-4">
              Your direct debit has been configured. We'll be in touch within 24 hours to begin your website project.
            </p>
            
            {/* Client Code Display */}
            {clientCode && (
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-blue-700 mb-2">Your Client Reference Code</p>
                  <div className="inline-block px-6 py-3 bg-blue-600 text-white text-2xl font-bold rounded-lg shadow-lg">
                    {clientCode}
                  </div>
                  <p className="text-xs text-blue-600 mt-3">
                    Save this code - you'll need it when communicating with us about your website project
                  </p>
                </div>
              </div>
            )}
            
            <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200 mb-6">
              <h3 className="font-semibold text-emerald-800 mb-4">What Happens Next?</h3>
              <ul className="space-y-3 text-emerald-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>We'll email you at <strong>{clientEmail}</strong> within 24 hours</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Your website development will begin immediately</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Setup fee collected when your website goes live</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Monthly £10 payments start automatically after that</span>
                </li>
              </ul>
            </div>

            <div className="text-center space-y-4">
              <Button 
                onClick={() => window.location.href = '/customer/login'} 
                className="bg-emerald-600 hover:bg-emerald-700 w-full"
                data-testid="button-customer-portal"
              >
                Access Customer Portal
              </Button>
              <Button 
                onClick={() => setLocation('/')} 
                variant="outline" 
                className="w-full"
                data-testid="button-return-home"
              >
                Return to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => {
              // Restore onboarding completion data to sessionStorage
              const dataToStore = {
                clientCode: urlClientCode,
                password: urlPassword,
                email: clientEmail,
                name: clientName,
                businessName,
                package: packageType,
                clientId
              };
              sessionStorage.setItem('onboardingComplete', JSON.stringify(dataToStore));
              window.location.href = '/onboarding-complete';
            }}
            className="mr-4"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Thank You Page
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Payment Setup</h1>
            <p className="text-slate-600">Configure your direct debit for automatic payments</p>
          </div>
        </div>

        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Secure Payment Setup</h3>
              <p className="text-sm text-blue-800">
                Setting up payment for <strong>{clientEmail}</strong>
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Bank Account Details
            </CardTitle>
            <CardDescription>Enter your bank details for direct debit payments</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <FormField
                  control={form.control}
                  name="accountHolderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="As it appears on your bank account" {...field} data-testid="input-account-holder" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sortCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort Code</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="XX-XX-XX" 
                            {...field}
                            onChange={(e) => field.onChange(formatSortCode(e.target.value))}
                            maxLength={8}
                            data-testid="input-sort-code"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="12345678" 
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                            maxLength={8}
                            data-testid="input-account-number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Street address" {...field} data-testid="input-address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} data-testid="input-city" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postcode</FormLabel>
                        <FormControl>
                          <Input placeholder="AB12 3CD" {...field} data-testid="input-postcode" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="agreedToTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-terms"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to the{" "}
                            <Dialog>
                              <DialogTrigger asChild>
                                <button type="button" className="text-blue-600 hover:underline">
                                  Terms and Conditions
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Terms and Conditions</DialogTitle>
                                  <DialogDescription>
                                    Please read our terms and conditions carefully
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: termsAndConditions }} />
                              </DialogContent>
                            </Dialog>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agreedToDirectDebit"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-direct-debit"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to the{" "}
                            <Dialog>
                              <DialogTrigger asChild>
                                <button type="button" className="text-blue-600 hover:underline">
                                  Direct Debit Guarantee
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Direct Debit Guarantee</DialogTitle>
                                  <DialogDescription>
                                    Your protection under the Direct Debit Guarantee
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: directDebitGuarantee }} />
                              </DialogContent>
                            </Dialog>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={submitMutation.isPending}
                    data-testid="button-submit-payment"
                  >
                    {submitMutation.isPending ? "Setting up..." : "Complete Payment Setup"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
