import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, ArrowLeft, ArrowRight, User, Globe, FileText, Palette, Settings, Layout, Sun, Moon, Sparkles } from "lucide-react";

const clientInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  businessName: z.string().min(1, "Business/Brand name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  
  // Template Selection
  templateStyle: z.string().min(1, "Please select a template style"),
  templateVariation: z.enum(["light", "dark"]).default("light"),
  layoutPreference: z.string().min(1, "Please select a layout preference"),
  
  // Domain & Hosting (Premium only)
  hasDomain: z.enum(["yes", "no", ""]).optional(),
  existingDomain: z.string().optional(),
  desiredDomains: z.string().optional(),
  
  // Website Content
  businessDescription: z.string().min(1, "Business description is required"),
  pagesNeeded: z.string().min(1, "Pages needed is required"),
  textContent: z.string().optional(),
  hasImages: z.boolean().default(false),
  
  // Design Preferences
  hasLogo: z.boolean().default(false),
  colorScheme: z.string().min(1, "Color scheme preference is required"),
  exampleWebsites: z.string().optional(),
  
  // Extras
  wantsContactForm: z.boolean().default(false),
  socialMediaLinks: z.string().optional(),
  specialRequests: z.string().optional(),
  
  // Package selection
  selectedPackage: z.enum(["basic", "premium"])
});

type ClientInfoForm = z.infer<typeof clientInfoSchema>;

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const totalSteps = 6;

  // Get package from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const packageFromUrl = urlParams.get('package') as 'basic' | 'premium' | null;

  const form = useForm<ClientInfoForm>({
    resolver: zodResolver(clientInfoSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      email: "",
      phone: "",
      templateStyle: "",
      templateVariation: "light",
      layoutPreference: "",
      hasDomain: "",
      existingDomain: "",
      desiredDomains: "",
      businessDescription: "",
      pagesNeeded: "",
      textContent: "",
      hasImages: false,
      hasLogo: false,
      colorScheme: "",
      exampleWebsites: "",
      wantsContactForm: false,
      socialMediaLinks: "",
      specialRequests: "",
      selectedPackage: packageFromUrl || "basic"
    },
  });

  const submitMutation = useMutation({
    mutationFn: (data: ClientInfoForm) => apiRequest("POST", "/api/client-onboarding", data),
    onSuccess: (response: any) => {
      toast({
        title: "Information Submitted Successfully!",
        description: "Redirecting to payment setup...",
      });
      
      // Redirect to payment setup with client info
      const params = new URLSearchParams({
        email: form.getValues('email'),
        name: form.getValues('fullName'),
        businessName: form.getValues('businessName'),
        package: form.getValues('selectedPackage'),
        clientId: response?.id || ''
      });
      window.location.href = `/payment-setup?${params.toString()}`;
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ClientInfoForm) => {
    submitMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectedPackage = form.watch("selectedPackage");

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8">
            <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
            <p className="text-slate-600 mb-6">
              Your information has been submitted successfully. We'll review your requirements and get back to you within 24 hours to discuss your website project.
            </p>
            <Button onClick={() => window.location.href = "/"} className="w-full">
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Website Project Information</h1>
          <p className="text-slate-600">Help us understand your requirements to create the perfect website</p>
          
          {/* Progress Bar */}
          <div className="mt-6 flex items-center justify-center space-x-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-8 h-2 rounded-full ${
                  i + 1 <= currentStep ? "bg-primary" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-2">Step {currentStep} of {totalSteps}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {currentStep === 1 && <><User className="w-5 h-5 mr-2" />Package & Contact Information</>}
                  {currentStep === 2 && <><Layout className="w-5 h-5 mr-2" />Template Selection</>}
                  {currentStep === 3 && <><Globe className="w-5 h-5 mr-2" />Domain & Hosting</>}
                  {currentStep === 4 && <><FileText className="w-5 h-5 mr-2" />Website Content</>}
                  {currentStep === 5 && <><Palette className="w-5 h-5 mr-2" />Design Preferences</>}
                  {currentStep === 6 && <><Settings className="w-5 h-5 mr-2" />Additional Features</>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Step 1: Package & Contact */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="selectedPackage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Your Package</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose your package" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="basic">Basic Static Website - £75 + £10/month</SelectItem>
                              <SelectItem value="premium">Premium Hosting & Domain - £150 + £10/month</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
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
                          <FormLabel>Business / Brand Name</FormLabel>
                          <FormControl>
                            <Input placeholder="As it should appear on the website" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            For account, billing, and project updates
                          </FormDescription>
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
                            <Input placeholder="Your phone number" {...field} />
                          </FormControl>
                          <FormDescription>
                            In case we need to contact you directly
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Template Selection */}
                {currentStep === 2 && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full mb-4">
                        <Sparkles className="w-5 h-5 text-emerald-600 mr-2" />
                        <span className="text-sm font-semibold text-emerald-900">Choose Your Perfect Design</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">Select Your Website Template</h3>
                      <p className="text-slate-600 max-w-2xl mx-auto">Pick a style that matches your brand personality. Each template is fully customizable with your chosen colors.</p>
                    </div>

                    {/* Light/Dark Toggle */}
                    <FormField
                      control={form.control}
                      name="templateVariation"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-center gap-3 mb-6">
                            <span className="text-sm font-medium text-slate-600">Theme Variation:</span>
                            <div className="inline-flex rounded-lg border-2 border-slate-200 p-1 bg-slate-50">
                              <button
                                type="button"
                                onClick={() => field.onChange("light")}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                                  field.value === "light"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                                }`}
                                data-testid="variation-light"
                              >
                                <Sun className="w-4 h-4" />
                                Light
                              </button>
                              <button
                                type="button"
                                onClick={() => field.onChange("dark")}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                                  field.value === "dark"
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                                }`}
                                data-testid="variation-dark"
                              >
                                <Moon className="w-4 h-4" />
                                Dark
                              </button>
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="templateStyle"
                      render={({ field }) => (
                        <FormItem>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
                            {[
                              { 
                                value: "modern", 
                                label: "Modern Pro", 
                                desc: "Clean lines, bold typography, perfect for tech & startups",
                                category: "Popular"
                              },
                              { 
                                value: "classic", 
                                label: "Classic Business", 
                                desc: "Traditional elegance for professional services",
                                category: "Professional"
                              },
                              { 
                                value: "minimalist", 
                                label: "Minimalist", 
                                desc: "Simple & focused, maximum impact with minimal design",
                                category: "Popular"
                              },
                              { 
                                value: "bold", 
                                label: "Bold Impact", 
                                desc: "Eye-catching vibrancy for creative businesses",
                                category: "Creative"
                              },
                              { 
                                value: "creative", 
                                label: "Creative Studio", 
                                desc: "Artistic layouts for agencies & portfolios",
                                category: "Creative"
                              },
                              { 
                                value: "corporate", 
                                label: "Corporate Elite", 
                                desc: "Enterprise-grade design for established companies",
                                category: "Professional"
                              },
                              { 
                                value: "elegant", 
                                label: "Elegant Luxury", 
                                desc: "Sophisticated style for premium brands",
                                category: "Premium"
                              },
                              { 
                                value: "tech", 
                                label: "Tech Forward", 
                                desc: "Futuristic design for technology companies",
                                category: "Tech"
                              }
                            ].map((template) => {
                              const templateVariation = form.watch("templateVariation");
                              const isLight = templateVariation === "light";
                              
                              // Generate preview based on template type and variation
                              let previewContent;
                              const bgColor = isLight ? "bg-white" : "bg-slate-900";
                              const textColor = isLight ? "text-slate-900" : "text-white";
                              const borderColor = isLight ? "border-slate-200" : "border-slate-700";
                              
                              if (template.value === "modern") {
                                previewContent = (
                                  <div className={`${bgColor} rounded-lg p-4 border ${borderColor} shadow-sm`}>
                                    <div className={`h-7 ${isLight ? "bg-slate-900" : "bg-white"} rounded mb-3 flex items-center px-3`}>
                                      <div className="w-14 h-2 bg-emerald-500 rounded"></div>
                                      <div className="ml-auto flex gap-2">
                                        <div className={`w-6 h-1 ${isLight ? "bg-white" : "bg-slate-900"} rounded`}></div>
                                        <div className={`w-6 h-1 ${isLight ? "bg-white" : "bg-slate-900"} rounded`}></div>
                                      </div>
                                    </div>
                                    <div className="h-24 bg-gradient-to-r from-emerald-500 to-blue-500 rounded mb-2 flex items-center justify-center">
                                      <div className="w-20 h-5 bg-white/90 rounded"></div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                      <div className={`h-14 ${isLight ? "bg-slate-100" : "bg-slate-800"} rounded`}></div>
                                      <div className={`h-14 ${isLight ? "bg-slate-100" : "bg-slate-800"} rounded`}></div>
                                      <div className={`h-14 ${isLight ? "bg-slate-100" : "bg-slate-800"} rounded`}></div>
                                    </div>
                                  </div>
                                );
                              } else if (template.value === "classic") {
                                previewContent = (
                                  <div className={`${bgColor} rounded-lg p-4 border ${borderColor} shadow-sm`}>
                                    <div className="text-center mb-3">
                                      <div className={`w-16 h-4 ${isLight ? "bg-slate-700" : "bg-slate-300"} rounded mx-auto mb-2`}></div>
                                      <div className="flex gap-1 justify-center mb-3">
                                        <div className={`w-8 h-1 ${isLight ? "bg-slate-400" : "bg-slate-600"} rounded`}></div>
                                        <div className={`w-8 h-1 ${isLight ? "bg-slate-400" : "bg-slate-600"} rounded`}></div>
                                        <div className={`w-8 h-1 ${isLight ? "bg-slate-400" : "bg-slate-600"} rounded`}></div>
                                      </div>
                                    </div>
                                    <div className={`h-20 ${isLight ? "bg-slate-100 border-slate-300" : "bg-slate-800 border-slate-600"} rounded border mb-2`}></div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className={`h-12 ${isLight ? "bg-slate-50 border-slate-200" : "bg-slate-800/50 border-slate-700"} rounded border`}></div>
                                      <div className={`h-12 ${isLight ? "bg-slate-50 border-slate-200" : "bg-slate-800/50 border-slate-700"} rounded border`}></div>
                                    </div>
                                  </div>
                                );
                              } else if (template.value === "minimalist") {
                                previewContent = (
                                  <div className={`${bgColor} rounded-lg p-4 border ${borderColor} shadow-sm`}>
                                    <div className="flex justify-between items-center mb-4">
                                      <div className={`w-12 h-2 ${textColor} rounded`}></div>
                                      <div className="flex gap-3">
                                        <div className={`w-5 h-0.5 ${isLight ? "bg-slate-400" : "bg-slate-500"} rounded`}></div>
                                        <div className={`w-5 h-0.5 ${isLight ? "bg-slate-400" : "bg-slate-500"} rounded`}></div>
                                      </div>
                                    </div>
                                    <div className="h-24 flex items-center justify-center mb-4">
                                      <div className={`w-28 h-4 ${textColor} rounded`}></div>
                                    </div>
                                    <div className={`h-px ${isLight ? "bg-slate-200" : "bg-slate-700"} w-full mb-3`}></div>
                                    <div className="space-y-1.5">
                                      <div className={`h-1 ${isLight ? "bg-slate-100" : "bg-slate-800"} rounded w-3/4`}></div>
                                      <div className={`h-1 ${isLight ? "bg-slate-100" : "bg-slate-800"} rounded w-full`}></div>
                                      <div className={`h-1 ${isLight ? "bg-slate-100" : "bg-slate-800"} rounded w-2/3`}></div>
                                    </div>
                                  </div>
                                );
                              } else if (template.value === "bold") {
                                previewContent = (
                                  <div className={`${isLight ? "bg-gradient-to-br from-slate-900 to-slate-800" : "bg-gradient-to-br from-slate-100 to-white"} rounded-lg p-4 shadow-sm`}>
                                    <div className="flex justify-between items-center mb-3">
                                      <div className={`w-14 h-3 ${isLight ? "bg-yellow-400" : "bg-purple-600"} rounded`}></div>
                                      <div className="flex gap-1">
                                        <div className={`w-5 h-5 ${isLight ? "bg-white/20" : "bg-slate-900/20"} rounded`}></div>
                                        <div className={`w-5 h-5 ${isLight ? "bg-white/20" : "bg-slate-900/20"} rounded`}></div>
                                      </div>
                                    </div>
                                    <div className={`h-20 ${isLight ? "bg-gradient-to-r from-yellow-400 to-orange-500" : "bg-gradient-to-r from-purple-600 to-pink-600"} rounded mb-2 flex items-center justify-center`}>
                                      <div className={`w-18 h-3 ${isLight ? "bg-white" : "bg-white"} rounded`}></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className={`h-14 ${isLight ? "bg-white/10 border-2 border-yellow-400" : "bg-slate-900/10 border-2 border-purple-500"} rounded`}></div>
                                      <div className={`h-14 ${isLight ? "bg-white/10 border-2 border-yellow-400" : "bg-slate-900/10 border-2 border-purple-500"} rounded`}></div>
                                    </div>
                                  </div>
                                );
                              } else if (template.value === "creative") {
                                previewContent = (
                                  <div className={`${bgColor} rounded-lg p-4 border ${borderColor} shadow-sm overflow-hidden`}>
                                    <div className="flex items-center gap-2 mb-3">
                                      <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full"></div>
                                      <div className={`w-16 h-2 ${textColor} rounded`}></div>
                                    </div>
                                    <div className="relative h-20 mb-2">
                                      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full opacity-50 blur-xl"></div>
                                      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-50 blur-xl"></div>
                                      <div className="relative h-full flex items-center justify-center">
                                        <div className={`w-24 h-4 ${textColor} rounded`}></div>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-1">
                                      <div className="h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded"></div>
                                      <div className="h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded"></div>
                                      <div className="h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded"></div>
                                      <div className="h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded"></div>
                                    </div>
                                  </div>
                                );
                              } else if (template.value === "corporate") {
                                previewContent = (
                                  <div className={`${bgColor} rounded-lg p-4 border ${borderColor} shadow-sm`}>
                                    <div className="flex justify-between items-center mb-3">
                                      <div className="flex items-center gap-2">
                                        <div className={`w-6 h-6 ${isLight ? "bg-blue-900" : "bg-blue-400"} rounded`}></div>
                                        <div className={`w-16 h-2 ${textColor} rounded`}></div>
                                      </div>
                                      <div className="flex gap-2">
                                        <div className={`w-10 h-1 ${isLight ? "bg-slate-600" : "bg-slate-400"} rounded`}></div>
                                        <div className={`w-10 h-1 ${isLight ? "bg-slate-600" : "bg-slate-400"} rounded`}></div>
                                      </div>
                                    </div>
                                    <div className={`h-18 ${isLight ? "bg-gradient-to-r from-blue-900 to-blue-700" : "bg-gradient-to-r from-blue-600 to-cyan-600"} rounded mb-2 px-3 flex items-center`}>
                                      <div className="w-20 h-3 bg-white rounded"></div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                      <div className={`h-14 ${isLight ? "bg-slate-100 border border-slate-200" : "bg-slate-800 border border-slate-700"} rounded p-2`}>
                                        <div className={`w-full h-2 ${isLight ? "bg-slate-300" : "bg-slate-600"} rounded mb-1`}></div>
                                        <div className={`w-2/3 h-2 ${isLight ? "bg-slate-200" : "bg-slate-700"} rounded`}></div>
                                      </div>
                                      <div className={`h-14 ${isLight ? "bg-slate-100 border border-slate-200" : "bg-slate-800 border border-slate-700"} rounded p-2`}>
                                        <div className={`w-full h-2 ${isLight ? "bg-slate-300" : "bg-slate-600"} rounded mb-1`}></div>
                                        <div className={`w-2/3 h-2 ${isLight ? "bg-slate-200" : "bg-slate-700"} rounded`}></div>
                                      </div>
                                      <div className={`h-14 ${isLight ? "bg-slate-100 border border-slate-200" : "bg-slate-800 border border-slate-700"} rounded p-2`}>
                                        <div className={`w-full h-2 ${isLight ? "bg-slate-300" : "bg-slate-600"} rounded mb-1`}></div>
                                        <div className={`w-2/3 h-2 ${isLight ? "bg-slate-200" : "bg-slate-700"} rounded`}></div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else if (template.value === "elegant") {
                                previewContent = (
                                  <div className={`${bgColor} rounded-lg p-4 border ${borderColor} shadow-sm`}>
                                    <div className="text-center mb-4">
                                      <div className="w-10 h-10 mx-auto mb-2 border-2 border-amber-600 rounded-full flex items-center justify-center">
                                        <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full"></div>
                                      </div>
                                      <div className={`w-20 h-2 ${textColor} rounded mx-auto mb-2`}></div>
                                      <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
                                    </div>
                                    <div className={`h-16 ${isLight ? "bg-gradient-to-br from-amber-50 to-orange-50" : "bg-gradient-to-br from-amber-900/20 to-orange-900/20"} rounded mb-2 border ${isLight ? "border-amber-200" : "border-amber-800"}`}></div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className={`h-12 ${isLight ? "bg-slate-50" : "bg-slate-800"} rounded border ${isLight ? "border-slate-200" : "border-slate-700"}`}></div>
                                      <div className={`h-12 ${isLight ? "bg-slate-50" : "bg-slate-800"} rounded border ${isLight ? "border-slate-200" : "border-slate-700"}`}></div>
                                    </div>
                                  </div>
                                );
                              } else if (template.value === "tech") {
                                previewContent = (
                                  <div className={`${isLight ? "bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900" : "bg-gradient-to-br from-cyan-950 via-blue-950 to-slate-950"} rounded-lg p-4 shadow-sm relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px]"></div>
                                    <div className="relative">
                                      <div className="flex justify-between items-center mb-3">
                                        <div className="w-14 h-2 bg-cyan-400 rounded shadow-lg shadow-cyan-500/50"></div>
                                        <div className="flex gap-1">
                                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                                        </div>
                                      </div>
                                      <div className="h-20 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded border border-cyan-500/30 mb-2 flex items-center justify-center backdrop-blur-sm">
                                        <div className="w-20 h-3 bg-white rounded shadow-lg"></div>
                                      </div>
                                      <div className="grid grid-cols-3 gap-1.5">
                                        <div className="h-12 bg-cyan-500/10 rounded border border-cyan-500/30"></div>
                                        <div className="h-12 bg-blue-500/10 rounded border border-blue-500/30"></div>
                                        <div className="h-12 bg-purple-500/10 rounded border border-purple-500/30"></div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                              
                              return (
                                <div
                                  key={template.value}
                                  onClick={() => field.onChange(template.value)}
                                  className={`group relative border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                                    field.value === template.value
                                      ? "border-emerald-600 bg-emerald-50 ring-4 ring-emerald-200 shadow-lg scale-105"
                                      : "border-gray-200 hover:border-emerald-400 bg-white"
                                  }`}
                                  data-testid={`template-${template.value}`}
                                >
                                  {/* Category Badge */}
                                  <div className="absolute -top-2 left-4 z-10">
                                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                                      template.category === "Popular" ? "bg-emerald-500 text-white" :
                                      template.category === "Creative" ? "bg-purple-500 text-white" :
                                      template.category === "Professional" ? "bg-blue-600 text-white" :
                                      template.category === "Premium" ? "bg-amber-500 text-white" :
                                      "bg-cyan-500 text-white"
                                    }`}>
                                      {template.category}
                                    </span>
                                  </div>
                                  
                                  <div className="p-4">
                                    {previewContent}
                                  </div>
                                  <div className="p-4 pt-2 border-t border-gray-200">
                                    <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                                      {template.label}
                                      {field.value === template.value && (
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                      )}
                                    </h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">{template.desc}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="colorScheme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold mb-4 block">Choose Your Color Scheme</FormLabel>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-2">
                            {[
                              { value: "emerald-green", label: "Emerald", colors: "from-emerald-400 to-green-600" },
                              { value: "ocean-blue", label: "Ocean Blue", colors: "from-blue-400 to-blue-600" },
                              { value: "royal-purple", label: "Royal Purple", colors: "from-purple-500 to-purple-700" },
                              { value: "sunset-orange", label: "Sunset", colors: "from-orange-400 to-red-600" },
                              { value: "rose-pink", label: "Rose", colors: "from-pink-400 to-rose-600" },
                              { value: "navy-blue", label: "Navy", colors: "from-blue-900 to-blue-950" },
                              { value: "forest-green", label: "Forest", colors: "from-green-700 to-green-900" },
                              { value: "crimson-red", label: "Crimson", colors: "from-red-500 to-red-700" },
                              { value: "slate-gray", label: "Slate", colors: "from-slate-600 to-slate-800" },
                              { value: "amber-gold", label: "Gold", colors: "from-amber-400 to-yellow-600" }
                            ].map((color) => (
                              <div
                                key={color.value}
                                onClick={() => field.onChange(color.value)}
                                className={`p-2 border-2 rounded-lg cursor-pointer transition-all ${
                                  field.value === color.value
                                    ? "border-emerald-600 ring-2 ring-emerald-200"
                                    : "border-gray-200 hover:border-emerald-300"
                                }`}
                                data-testid={`color-${color.value}`}
                              >
                                <div className={`h-16 rounded bg-gradient-to-br ${color.colors} mb-2 shadow-sm`}></div>
                                <p className="text-xs font-medium text-center text-slate-900">{color.label}</p>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="layoutPreference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Layout Preference</FormLabel>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div
                              onClick={() => field.onChange("single-page")}
                              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                field.value === "single-page"
                                  ? "border-emerald-600 bg-emerald-50"
                                  : "border-gray-200 hover:border-emerald-300"
                              }`}
                              data-testid="layout-single-page"
                            >
                              <h4 className="font-semibold text-slate-900 mb-1">Single Page</h4>
                              <p className="text-sm text-slate-600">All content on one scrollable page</p>
                            </div>
                            <div
                              onClick={() => field.onChange("multi-page")}
                              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                field.value === "multi-page"
                                  ? "border-emerald-600 bg-emerald-50"
                                  : "border-gray-200 hover:border-emerald-300"
                              }`}
                              data-testid="layout-multi-page"
                            >
                              <h4 className="font-semibold text-slate-900 mb-1">Multi-Page</h4>
                              <p className="text-sm text-slate-600">Separate pages with navigation menu</p>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 3: Domain & Hosting (Premium only) */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    {selectedPackage === "premium" ? (
                      <>
                        <FormField
                          control={form.control}
                          name="hasDomain"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Do you already have a domain name?</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select option" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="yes">Yes, I have a domain</SelectItem>
                                  <SelectItem value="no">No, I need a new domain</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {form.watch("hasDomain") === "yes" && (
                          <FormField
                            control={form.control}
                            name="existingDomain"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Your Existing Domain</FormLabel>
                                <FormControl>
                                  <Input placeholder="example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {form.watch("hasDomain") === "no" && (
                          <FormField
                            control={form.control}
                            name="desiredDomains"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Desired Domain Names</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="List 2-3 domain options in case your first choice isn't available:&#10;example1.com&#10;example2.co.uk&#10;example3.net"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Please list 2-3 options in case your first choice isn't available
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Globe className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-600 mb-2">Domain & Hosting</h3>
                        <p className="text-slate-500">
                          Domain and hosting setup is included with the Premium package only. 
                          Your Basic package focuses on website creation.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Website Content */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="businessDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>About Your Business/Brand</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Provide a short description of your business for the 'About Us' section"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pagesNeeded"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pages Needed</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Home, About, Services, Contact, Gallery"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="textContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Text Content (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Paste your website content here, or let us know you'll provide it later"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            You can paste content here or send it via email later
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasImages"
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
                              I have images/logo to provide
                            </FormLabel>
                            <FormDescription>
                              You can send images and logo via email if needed
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 5: Design Preferences */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="hasLogo"
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
                              I have a logo
                            </FormLabel>
                            <FormDescription>
                              We can help create one if you don't have a logo yet
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="colorScheme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Colour Scheme / Style</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. modern, professional, playful, minimal, specific colours"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="exampleWebsites"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Example Websites You Like (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Share links to websites you like for inspiration"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Help us understand your style preferences
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 6: Additional Features */}
                {currentStep === 6 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="wantsContactForm"
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
                              I want a contact form on the website
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="socialMediaLinks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Social Media Links (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Facebook, Instagram, LinkedIn, Twitter etc. - paste your social media URLs here"
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
                          <FormLabel>Any Special Requests (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any specific features or requirements you'd like to discuss"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="flex items-center"
                    >
                      {submitMutation.isPending ? "Submitting..." : "Submit Information"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}