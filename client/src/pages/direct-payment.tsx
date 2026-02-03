import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, ArrowLeft, Shield, CreditCard, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { termsAndConditions, directDebitGuarantee } from "@/components/legal/terms-and-conditions";
import { getCurrentPricing, isDiscountActive } from "@shared/pricing";

const directPaymentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  businessName: z.string().min(1, "Business name is required"),
  phone: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postcode: z.string().min(1, "Postcode is required"),
  packageType: z.enum(["basic", "premium"], { required_error: "Please select a package" }),
  agreedToTerms: z.boolean().refine(val => val === true, "You must agree to the terms"),
  agreedToDirectDebit: z.boolean().refine(val => val === true, "You must agree to the Direct Debit Guarantee"),
});

type DirectPaymentForm = z.infer<typeof directPaymentSchema>;

export default function DirectPaymentPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Get package from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const urlPackage = urlParams.get('package') as "basic" | "premium" | null;
  
  const [selectedPackage, setSelectedPackage] = useState<"basic" | "premium">(urlPackage || "basic");
  
  const basicPricing = getCurrentPricing('basic');
  const premiumPricing = getCurrentPricing('premium');
  const discountActive = isDiscountActive();

  const form = useForm<DirectPaymentForm>({
    resolver: zodResolver(directPaymentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      businessName: "",
      phone: "",
      address: "",
      city: "",
      postcode: "",
      packageType: urlPackage || "basic",
      agreedToTerms: false,
      agreedToDirectDebit: false,
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: DirectPaymentForm) => {
      const pricing = data.packageType === 'basic' ? basicPricing : premiumPricing;
      
      const response = await apiRequest("POST", "/api/payment/create-billing-request", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        businessName: data.businessName,
        phone: data.phone || '',
        address: data.address,
        city: data.city,
        postcode: data.postcode,
        packageType: data.packageType,
        setupFeeAmount: pricing.setupPrice * 100,
      });
      return await response.json();
    },
    onSuccess: (response: any) => {
      if (response?.authorizationUrl) {
        window.location.href = response.authorizationUrl;
      } else {
        toast({
          title: "Error",
          description: "Failed to create payment link. Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Payment Setup Failed",
        description: error.message || "Please check your details and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: DirectPaymentForm) => {
    submitMutation.mutate(data);
  };

  const currentPricing = selectedPackage === 'basic' ? basicPricing : premiumPricing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Direct Payment</h1>
            <p className="text-slate-600">Quick payment setup for existing clients</p>
          </div>
        </div>

        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Secure GoCardless Payment</h3>
              <p className="text-sm text-blue-800">
                You'll be redirected to GoCardless to securely set up your Direct Debit. Your bank details are never stored on our servers.
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Your Package</CardTitle>
            <CardDescription>Choose the website package discussed with your consultant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPackage === 'basic' 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setSelectedPackage('basic');
                  form.setValue('packageType', 'basic');
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">Basic Website</h3>
                  {selectedPackage === 'basic' && (
                    <CheckCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {discountActive && basicPricing.originalSetupPrice && (
                    <span className="text-lg text-gray-400 line-through mr-2">£{basicPricing.originalSetupPrice}</span>
                  )}
                  £{basicPricing.setupPrice}
                  <span className="text-sm font-normal text-gray-600"> setup</span>
                </div>
                <p className="text-sm text-gray-600">+ £{basicPricing.monthlyPrice}/month</p>
              </div>

              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPackage === 'premium' 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setSelectedPackage('premium');
                  form.setValue('packageType', 'premium');
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">Premium Website</h3>
                  {selectedPackage === 'premium' && (
                    <CheckCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {discountActive && premiumPricing.originalSetupPrice && (
                    <span className="text-lg text-gray-400 line-through mr-2">£{premiumPricing.originalSetupPrice}</span>
                  )}
                  £{premiumPricing.setupPrice}
                  <span className="text-sm font-normal text-gray-600"> setup</span>
                </div>
                <p className="text-sm text-gray-600">+ £{premiumPricing.monthlyPrice}/month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Your Details
            </CardTitle>
            <CardDescription>Enter your details to proceed to payment</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Business Ltd" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="07123 456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street" {...field} />
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
                          <Input placeholder="London" {...field} />
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
                          <Input placeholder="SW1A 1AA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <FormField
                    control={form.control}
                    name="agreedToTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
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

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Setup Fee:</span>
                    <span className="font-bold text-lg">£{currentPricing.setupPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monthly Fee:</span>
                    <span className="font-bold text-lg">£{currentPricing.monthlyPrice}/month</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white py-6 text-lg"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Proceed to Payment
                      </>
                    )}
                  </Button>
                  <p className="text-center text-sm text-gray-500 mt-3">
                    You'll be redirected to GoCardless to securely set up your Direct Debit
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
