import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { analytics } from "@/lib/analytics";
import { Calculator, Mail, ArrowLeft, CheckCircle } from "lucide-react";

const consultationSchema = z.object({
  // Contact Information
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  businessName: z.string().min(2, "Business name is required"),

  // Project Details
  serviceType: z.string().min(1, "Please select a service type"),
  projectComplexity: z.string().min(1, "Please select project complexity"),
  timeline: z.string().min(1, "Please select a timeline"),
  
  // Additional Services
  seoSetup: z.boolean().default(false),
  contentWriting: z.boolean().default(false),
  ongoingSupport: z.boolean().default(false),
  customIntegrations: z.boolean().default(false),
  ecommerceFeatures: z.boolean().default(false),
  
  // Description
  projectDescription: z.string().min(10, "Please provide more details about your project"),
  specialRequests: z.string().optional(),
});

type ConsultationForm = z.infer<typeof consultationSchema>;

// Pricing configuration
const PRICING_CONFIG = {
  serviceTypes: {
    consultation: { base: 50, label: "Initial Consultation" },
    customDevelopment: { base: 200, label: "Custom Development" },
    websiteRedesign: { base: 150, label: "Website Redesign" },
    ecommerce: { base: 300, label: "E-commerce Solution" },
    integration: { base: 100, label: "Third-party Integration" },
  },
  complexity: {
    basic: { multiplier: 1.0, label: "Basic" },
    intermediate: { multiplier: 1.5, label: "Intermediate" },
    advanced: { multiplier: 2.0, label: "Advanced" },
    enterprise: { multiplier: 3.0, label: "Enterprise" },
  },
  timeline: {
    flexible: { multiplier: 1.0, label: "Flexible (4-6 weeks)" },
    standard: { multiplier: 1.2, label: "Standard (2-3 weeks)" },
    rush: { multiplier: 1.8, label: "Rush (1 week)" },
  },
  additionalServices: {
    seoSetup: { price: 75, label: "SEO Setup" },
    contentWriting: { price: 100, label: "Content Writing" },
    ongoingSupport: { price: 50, label: "Monthly Support" },
    customIntegrations: { price: 150, label: "Custom Integrations" },
    ecommerceFeatures: { price: 200, label: "E-commerce Features" },
  },
};

export default function ConsultationPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const { toast } = useToast();

  const form = useForm<ConsultationForm>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      businessName: "",
      serviceType: "",
      projectComplexity: "",
      timeline: "",
      seoSetup: false,
      contentWriting: false,
      ongoingSupport: false,
      customIntegrations: false,
      ecommerceFeatures: false,
      projectDescription: "",
      specialRequests: "",
    },
  });

  const watchedFields = form.watch();

  // Calculate price dynamically
  useEffect(() => {
    const { serviceType, projectComplexity, timeline, seoSetup, contentWriting, ongoingSupport, customIntegrations, ecommerceFeatures } = watchedFields;
    
    let price = 0;
    
    // Base service price
    if (serviceType && PRICING_CONFIG.serviceTypes[serviceType as keyof typeof PRICING_CONFIG.serviceTypes]) {
      price = PRICING_CONFIG.serviceTypes[serviceType as keyof typeof PRICING_CONFIG.serviceTypes].base;
    }
    
    // Apply complexity multiplier
    if (projectComplexity && PRICING_CONFIG.complexity[projectComplexity as keyof typeof PRICING_CONFIG.complexity]) {
      price *= PRICING_CONFIG.complexity[projectComplexity as keyof typeof PRICING_CONFIG.complexity].multiplier;
    }
    
    // Apply timeline multiplier
    if (timeline && PRICING_CONFIG.timeline[timeline as keyof typeof PRICING_CONFIG.timeline]) {
      price *= PRICING_CONFIG.timeline[timeline as keyof typeof PRICING_CONFIG.timeline].multiplier;
    }
    
    // Add additional services
    if (seoSetup) price += PRICING_CONFIG.additionalServices.seoSetup.price;
    if (contentWriting) price += PRICING_CONFIG.additionalServices.contentWriting.price;
    if (ongoingSupport) price += PRICING_CONFIG.additionalServices.ongoingSupport.price;
    if (customIntegrations) price += PRICING_CONFIG.additionalServices.customIntegrations.price;
    if (ecommerceFeatures) price += PRICING_CONFIG.additionalServices.ecommerceFeatures.price;
    
    setCalculatedPrice(Math.round(price));
  }, [watchedFields]);

  const submitMutation = useMutation({
    mutationFn: async (data: ConsultationForm) => {
      return apiRequest("POST", "/api/consultation", { 
        ...data, 
        estimatedPrice: calculatedPrice 
      });
    },
    onSuccess: () => {
      setIsSubmitted(true);
      analytics.trackClick("consultation-submitted");
      toast({
        title: "Consultation Request Sent",
        description: "We'll email you within 24 hours with a detailed quote and next steps.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ConsultationForm) => {
    analytics.trackClick("consultation-form-submit");
    submitMutation.mutate(data);
  };

  // Track page view
  useEffect(() => {
    analytics.trackPageView("/consultation");
  }, []);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Consultation Request Received</h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Thank you for your consultation request. We'll review your requirements and send you a detailed quote via email within 24 hours.
            </p>
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-600 mb-2">Estimated Quote Range:</p>
              <p className="text-2xl font-bold text-primary">£{calculatedPrice}</p>
              <p className="text-xs text-slate-500">*Final quote may vary based on specific requirements</p>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <p><strong>Next Steps:</strong></p>
              <p>• We'll review your project requirements in detail</p>
              <p>• You'll receive a comprehensive quote via email</p>
              <p>• We'll schedule a call to discuss your project</p>
            </div>
            <Button 
              onClick={() => window.location.href = "/"} 
              className="mt-6"
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Button 
            onClick={() => window.location.href = "/"} 
            variant="ghost" 
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Homepage
          </Button>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Custom Project Consultation</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Tell us about your specific requirements and get a personalized quote for your custom web development project.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Project Details
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll send you a detailed quote via email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">Contact Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Smith" {...field} />
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
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john@business.com" {...field} />
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
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="07123456789" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Project Configuration */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">Project Configuration</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="serviceType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Service Type</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select service" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(PRICING_CONFIG.serviceTypes).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>
                                      {value.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="projectComplexity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Complexity</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select complexity" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(PRICING_CONFIG.complexity).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>
                                      {value.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="timeline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Timeline</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select timeline" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(PRICING_CONFIG.timeline).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>
                                      {value.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Additional Services */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">Additional Services</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(PRICING_CONFIG.additionalServices).map(([key, value]) => (
                          <FormField
                            key={key}
                            control={form.control}
                            name={key as keyof ConsultationForm}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value as boolean}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-medium">
                                    {value.label} (+£{value.price})
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Project Description */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">Project Description</h3>
                      <FormField
                        control={form.control}
                        name="projectDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Detailed Project Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please describe your project requirements, goals, and any specific features you need..."
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="specialRequests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special Requirements (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Any special requirements, integrations, or considerations..."
                                className="min-h-24"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={submitMutation.isPending}
                    >
                      {submitMutation.isPending ? "Sending..." : "Request Consultation Quote"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Price Calculator */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Live Price Estimate
                </CardTitle>
                <CardDescription>
                  Real-time pricing based on your selections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">£{calculatedPrice}</div>
                    <p className="text-sm text-slate-600">Estimated Quote</p>
                  </div>
                  
                  {calculatedPrice > 0 && (
                    <div className="space-y-3 text-sm">
                      <div className="border-t pt-3">
                        <h4 className="font-medium text-slate-800 mb-2">Price Breakdown:</h4>
                        
                        {watchedFields.serviceType && (
                          <div className="flex justify-between">
                            <span>{PRICING_CONFIG.serviceTypes[watchedFields.serviceType as keyof typeof PRICING_CONFIG.serviceTypes]?.label}</span>
                            <span>£{PRICING_CONFIG.serviceTypes[watchedFields.serviceType as keyof typeof PRICING_CONFIG.serviceTypes]?.base}</span>
                          </div>
                        )}
                        
                        {watchedFields.projectComplexity && watchedFields.projectComplexity !== 'basic' && (
                          <div className="flex justify-between text-blue-600">
                            <span>{PRICING_CONFIG.complexity[watchedFields.projectComplexity as keyof typeof PRICING_CONFIG.complexity]?.label} complexity</span>
                            <span>×{PRICING_CONFIG.complexity[watchedFields.projectComplexity as keyof typeof PRICING_CONFIG.complexity]?.multiplier}</span>
                          </div>
                        )}
                        
                        {watchedFields.timeline && watchedFields.timeline !== 'flexible' && (
                          <div className="flex justify-between text-purple-600">
                            <span>{PRICING_CONFIG.timeline[watchedFields.timeline as keyof typeof PRICING_CONFIG.timeline]?.label}</span>
                            <span>×{PRICING_CONFIG.timeline[watchedFields.timeline as keyof typeof PRICING_CONFIG.timeline]?.multiplier}</span>
                          </div>
                        )}
                        
                        {Object.entries(watchedFields).map(([key, value]) => {
                          if (value === true && PRICING_CONFIG.additionalServices[key as keyof typeof PRICING_CONFIG.additionalServices]) {
                            const service = PRICING_CONFIG.additionalServices[key as keyof typeof PRICING_CONFIG.additionalServices];
                            return (
                              <div key={key} className="flex justify-between text-green-600">
                                <span>{service.label}</span>
                                <span>+£{service.price}</span>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t pt-3 text-xs text-slate-500">
                    <p>• This is an estimated quote</p>
                    <p>• Final pricing may vary based on specific requirements</p>
                    <p>• We'll provide a detailed breakdown via email</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}