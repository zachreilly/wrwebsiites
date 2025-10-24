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

  const nextStep = async () => {
    // Define which fields need to be validated for each step
    const stepFields: Record<number, (keyof ClientInfoForm)[]> = {
      1: ['fullName', 'businessName', 'email', 'phone', 'selectedPackage'],
      2: ['templateStyle', 'templateVariation', 'layoutPreference'],
      3: selectedPackage === 'premium' ? ['hasDomain', 'existingDomain', 'desiredDomains'] : [],
      4: ['businessDescription', 'pagesNeeded'],
      5: ['colorScheme'],
      6: [] // Final step - no validation needed, it's optional fields
    };

    const fieldsToValidate = stepFields[currentStep] || [];
    
    // Trigger validation for current step fields
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (!isValid) {
      toast({
        title: "Please Complete Required Fields",
        description: "Fill in all required fields before proceeding to the next step.",
        variant: "destructive"
      });
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
                                desc: "Clean geometric layouts with bold headings and bright accent colors",
                                category: "Popular"
                              },
                              { 
                                value: "classic", 
                                label: "Classic Business", 
                                desc: "Centered layouts, serif fonts, and traditional navigation bars",
                                category: "Professional"
                              },
                              { 
                                value: "minimalist", 
                                label: "Minimalist", 
                                desc: "Maximum whitespace, simple lines, focus on essential content only",
                                category: "Popular"
                              },
                              { 
                                value: "bold", 
                                label: "Bold Impact", 
                                desc: "Dark backgrounds, vibrant gradients, and high-contrast elements",
                                category: "Creative"
                              },
                              { 
                                value: "creative", 
                                label: "Creative Studio", 
                                desc: "Colorful gradients, overlapping elements, and artistic blur effects",
                                category: "Creative"
                              },
                              { 
                                value: "corporate", 
                                label: "Corporate Elite", 
                                desc: "Professional blue tones, grid layouts, and structured information cards",
                                category: "Professional"
                              },
                              { 
                                value: "elegant", 
                                label: "Elegant Luxury", 
                                desc: "Gold accents, centered content, and refined decorative elements",
                                category: "Premium"
                              },
                              { 
                                value: "tech", 
                                label: "Tech Forward", 
                                desc: "Neon glows, grid patterns, and futuristic cyber-inspired design",
                                category: "Tech"
                              },
                              { 
                                value: "magazine", 
                                label: "Magazine Style", 
                                desc: "Large images, editorial layouts, and content-focused typography",
                                category: "Minimal" // Changed from Popular
                              }
                            ].map((template) => {
                              const templateVariation = form.watch("templateVariation");
                              const selectedColorScheme = form.watch("colorScheme");
                              const isLight = templateVariation === "light";
                              
                              // Color mapping based on selected scheme  
                              const getColors = (scheme: string) => {
                                const colorMaps: Record<string, any> = {
                                  "emerald-green": {
                                    primary: isLight ? "bg-emerald-600" : "bg-emerald-400",
                                    secondary: isLight ? "bg-emerald-500" : "bg-emerald-500",
                                    accent: isLight ? "bg-green-600" : "bg-green-400",
                                    gradient: "from-emerald-500 via-emerald-400 to-green-500",
                                    logo: isLight ? "bg-emerald-900" : "bg-emerald-300",
                                    border: isLight ? "border-emerald-700" : "border-emerald-500"
                                  },
                                  "ocean-blue": {
                                    primary: isLight ? "bg-blue-600" : "bg-blue-400",
                                    secondary: isLight ? "bg-blue-500" : "bg-blue-500",
                                    accent: isLight ? "bg-cyan-600" : "bg-cyan-400",
                                    gradient: "from-blue-500 via-blue-400 to-cyan-500",
                                    logo: isLight ? "bg-blue-900" : "bg-blue-300",
                                    border: isLight ? "border-blue-700" : "border-blue-500"
                                  },
                                  "royal-purple": {
                                    primary: isLight ? "bg-purple-600" : "bg-purple-400",
                                    secondary: isLight ? "bg-purple-500" : "bg-purple-500",
                                    accent: isLight ? "bg-violet-600" : "bg-violet-400",
                                    gradient: "from-purple-500 via-purple-400 to-violet-500",
                                    logo: isLight ? "bg-purple-900" : "bg-purple-300",
                                    border: isLight ? "border-purple-700" : "border-purple-500"
                                  },
                                  "sunset-orange": {
                                    primary: isLight ? "bg-orange-600" : "bg-orange-400",
                                    secondary: isLight ? "bg-orange-500" : "bg-orange-500",
                                    accent: isLight ? "bg-red-600" : "bg-red-400",
                                    gradient: "from-orange-500 via-orange-400 to-red-500",
                                    logo: isLight ? "bg-orange-900" : "bg-orange-300",
                                    border: isLight ? "border-orange-700" : "border-orange-500"
                                  },
                                  "rose-pink": {
                                    primary: isLight ? "bg-pink-600" : "bg-pink-400",
                                    secondary: isLight ? "bg-pink-500" : "bg-pink-500",
                                    accent: isLight ? "bg-rose-600" : "bg-rose-400",
                                    gradient: "from-pink-500 via-pink-400 to-rose-500",
                                    logo: isLight ? "bg-pink-900" : "bg-pink-300",
                                    border: isLight ? "border-pink-700" : "border-pink-500"
                                  },
                                  "navy-blue": {
                                    primary: isLight ? "bg-blue-900" : "bg-blue-300",
                                    secondary: isLight ? "bg-blue-800" : "bg-blue-400",
                                    accent: isLight ? "bg-blue-950" : "bg-blue-200",
                                    gradient: "from-blue-900 via-blue-800 to-blue-700",
                                    logo: isLight ? "bg-blue-950" : "bg-blue-200",
                                    border: isLight ? "border-blue-800" : "border-blue-400"
                                  },
                                  "forest-green": {
                                    primary: isLight ? "bg-green-700" : "bg-green-400",
                                    secondary: isLight ? "bg-green-600" : "bg-green-500",
                                    accent: isLight ? "bg-green-800" : "bg-green-300",
                                    gradient: "from-green-700 via-green-600 to-green-500",
                                    logo: isLight ? "bg-green-900" : "bg-green-300",
                                    border: isLight ? "border-green-800" : "border-green-500"
                                  },
                                  "crimson-red": {
                                    primary: isLight ? "bg-red-600" : "bg-red-400",
                                    secondary: isLight ? "bg-red-500" : "bg-red-500",
                                    accent: isLight ? "bg-red-700" : "bg-red-300",
                                    gradient: "from-red-600 via-red-500 to-red-400",
                                    logo: isLight ? "bg-red-900" : "bg-red-300",
                                    border: isLight ? "border-red-700" : "border-red-500"
                                  },
                                  "slate-gray": {
                                    primary: isLight ? "bg-slate-700" : "bg-slate-400",
                                    secondary: isLight ? "bg-slate-600" : "bg-slate-500",
                                    accent: isLight ? "bg-slate-800" : "bg-slate-300",
                                    gradient: "from-slate-700 via-slate-600 to-slate-500",
                                    logo: isLight ? "bg-slate-900" : "bg-slate-300",
                                    border: isLight ? "border-slate-800" : "border-slate-500"
                                  },
                                  "amber-gold": {
                                    primary: isLight ? "bg-amber-600" : "bg-amber-400",
                                    secondary: isLight ? "bg-amber-500" : "bg-amber-500",
                                    accent: isLight ? "bg-yellow-600" : "bg-yellow-400",
                                    gradient: "from-amber-500 via-amber-400 to-yellow-500",
                                    logo: isLight ? "bg-amber-900" : "bg-amber-300",
                                    border: isLight ? "border-amber-700" : "border-amber-500"
                                  }
                                };
                                return colorMaps[scheme] || colorMaps["emerald-green"];
                              };
                              
                              const colors = getColors(selectedColorScheme || "emerald-green");
                              
                              // Generate preview based on template type and variation
                              let previewContent;
                              const bgColor = isLight ? "bg-white" : "bg-slate-900";
                              const textColor = isLight ? "text-slate-900" : "text-white";
                              const borderColor = isLight ? "border-slate-200" : "border-slate-700";
                              
                              if (template.value === "modern") {
                                previewContent = (
                                  <div className={`${bgColor} rounded-lg p-3 border ${borderColor} shadow-sm`}>
                                    {/* Distinctive top navbar with logo + menu */}
                                    <div className={`h-8 ${isLight ? "bg-slate-900" : "bg-white"} rounded mb-2 flex items-center px-3 gap-2`}>
                                      <div className={`w-2 h-2 ${colors.secondary} rounded-full`}></div>
                                      <div className={`w-12 h-1.5 ${colors.secondary} rounded`}></div>
                                      <div className="ml-auto flex gap-1.5">
                                        <div className={`w-8 h-1 ${isLight ? "bg-white" : "bg-slate-900"} rounded`}></div>
                                        <div className={`w-8 h-1 ${isLight ? "bg-white" : "bg-slate-900"} rounded`}></div>
                                        <div className={`w-8 h-1 ${isLight ? "bg-white" : "bg-slate-900"} rounded`}></div>
                                      </div>
                                    </div>
                                    {/* Large hero with gradient */}
                                    <div className={`h-20 bg-gradient-to-r ${colors.gradient} rounded mb-2 flex flex-col items-center justify-center gap-1.5 p-2`}>
                                      <div className="w-24 h-3 bg-white rounded"></div>
                                      <div className="w-16 h-1.5 bg-white/80 rounded"></div>
                                      <div className="w-12 h-2.5 bg-white rounded-full mt-1"></div>
                                    </div>
                                    {/* Three equal cards */}
                                    <div className="grid grid-cols-3 gap-1.5">
                                      <div className={`h-14 ${isLight ? "bg-slate-100" : "bg-slate-800"} rounded p-1.5`}>
                                        <div className={`w-full h-2 ${colors.secondary} rounded mb-1`}></div>
                                        <div className={`w-3/4 h-1 ${isLight ? "bg-slate-300" : "bg-slate-600"} rounded`}></div>
                                      </div>
                                      <div className={`h-14 ${isLight ? "bg-slate-100" : "bg-slate-800"} rounded p-1.5`}>
                                        <div className={`w-full h-2 ${colors.primary} rounded mb-1`}></div>
                                        <div className={`w-3/4 h-1 ${isLight ? "bg-slate-300" : "bg-slate-600"} rounded`}></div>
                                      </div>
                                      <div className={`h-14 ${isLight ? "bg-slate-100" : "bg-slate-800"} rounded p-1.5`}>
                                        <div className={`w-full h-2 ${colors.accent} rounded mb-1`}></div>
                                        <div className={`w-3/4 h-1 ${isLight ? "bg-slate-300" : "bg-slate-600"} rounded`}></div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else if (template.value === "classic") {
                                previewContent = (
                                  <div className={`${bgColor} rounded-lg p-3 border ${borderColor} shadow-sm`}>
                                    {/* Centered header with serif-style logo */}
                                    <div className="text-center mb-2">
                                      <div className={`w-6 h-6 ${colors.logo} rounded mx-auto mb-1.5 border-2 ${colors.border}`}></div>
                                      <div className={`w-20 h-2.5 ${isLight ? "bg-slate-700" : "bg-slate-300"} rounded mx-auto mb-2`}></div>
                                      {/* Traditional horizontal nav */}
                                      <div className="flex gap-1.5 justify-center mb-2 pb-2 border-b border-slate-300">
                                        <div className={`w-10 h-1.5 ${isLight ? "bg-slate-500" : "bg-slate-500"} rounded`}></div>
                                        <div className={`w-10 h-1.5 ${isLight ? "bg-slate-500" : "bg-slate-500"} rounded`}></div>
                                        <div className={`w-10 h-1.5 ${isLight ? "bg-slate-500" : "bg-slate-500"} rounded`}></div>
                                      </div>
                                    </div>
                                    {/* Banner area with border */}
                                    <div className={`h-16 ${isLight ? "bg-slate-100 border-slate-300" : "bg-slate-800 border-slate-600"} rounded border-2 mb-2 flex items-center justify-center p-2`}>
                                      <div className={`w-20 h-2.5 ${isLight ? "bg-slate-600" : "bg-slate-400"} rounded`}></div>
                                    </div>
                                    {/* Two column layout */}
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className={`h-12 ${isLight ? "bg-slate-50 border-slate-300" : "bg-slate-800/50 border-slate-600"} rounded border-2 p-2`}>
                                        <div className={`w-full h-1.5 ${isLight ? "bg-slate-400" : "bg-slate-500"} rounded mb-1`}></div>
                                        <div className={`w-2/3 h-1 ${isLight ? "bg-slate-300" : "bg-slate-600"} rounded`}></div>
                                      </div>
                                      <div className={`h-12 ${isLight ? "bg-slate-50 border-slate-300" : "bg-slate-800/50 border-slate-600"} rounded border-2 p-2`}>
                                        <div className={`w-full h-1.5 ${isLight ? "bg-slate-400" : "bg-slate-500"} rounded mb-1`}></div>
                                        <div className={`w-2/3 h-1 ${isLight ? "bg-slate-300" : "bg-slate-600"} rounded`}></div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else if (template.value === "minimalist") {
                                previewContent = (
                                  <div className={`${bgColor} rounded-lg p-5 border ${borderColor} shadow-sm`}>
                                    {/* Super minimal top nav - just text links */}
                                    <div className="flex justify-between items-center mb-5">
                                      <div className={`w-10 h-1.5 ${textColor} rounded`}></div>
                                      <div className="flex gap-4">
                                        <div className={`w-6 h-0.5 ${isLight ? "bg-slate-300" : "bg-slate-600"} rounded`}></div>
                                        <div className={`w-6 h-0.5 ${isLight ? "bg-slate-300" : "bg-slate-600"} rounded`}></div>
                                      </div>
                                    </div>
                                    {/* Large centered heading with tons of space */}
                                    <div className="h-20 flex items-center justify-center mb-5">
                                      <div className={`w-32 h-3 ${textColor} rounded`}></div>
                                    </div>
                                    {/* Single divider line */}
                                    <div className={`h-px ${isLight ? "bg-slate-200" : "bg-slate-700"} w-20 mx-auto mb-4`}></div>
                                    {/* Minimal text lines with lots of whitespace */}
                                    <div className="space-y-2 px-4">
                                      <div className={`h-0.5 ${colors.secondary} rounded w-2/3 mx-auto opacity-30`}></div>
                                      <div className={`h-0.5 ${isLight ? "bg-slate-200" : "bg-slate-700"} rounded w-full mx-auto`}></div>
                                      <div className={`h-0.5 ${isLight ? "bg-slate-200" : "bg-slate-700"} rounded w-1/2 mx-auto`}></div>
                                    </div>
                                  </div>
                                );
                              } else if (template.value === "bold") {
                                previewContent = (
                                  <div className={`${isLight ? "bg-gradient-to-br from-slate-900 via-slate-800 to-black" : "bg-gradient-to-br from-white via-slate-50 to-slate-100"} rounded-lg p-3 shadow-lg border-2 ${isLight ? colors.border : colors.border}`}>
                                    {/* Bold header with strong accent */}
                                    <div className="flex justify-between items-center mb-2">
                                      <div className="flex items-center gap-1">
                                        <div className={`w-3 h-3 ${colors.secondary} rounded-sm rotate-45`}></div>
                                        <div className={`w-14 h-2.5 ${colors.secondary} rounded font-black`}></div>
                                      </div>
                                      <div className="flex gap-1.5">
                                        <div className={`w-6 h-6 ${isLight ? "bg-white/20" : "bg-slate-900/20"} border ${colors.border} rounded`}></div>
                                        <div className={`w-6 h-6 ${isLight ? "bg-white/20" : "bg-slate-900/20"} border ${colors.border} rounded`}></div>
                                      </div>
                                    </div>
                                    {/* Huge bold hero with strong gradient */}
                                    <div className={`h-20 bg-gradient-to-r ${colors.gradient} rounded-lg mb-2 flex items-center justify-center shadow-xl`}>
                                      <div className="w-24 h-4 bg-white rounded font-black shadow-lg"></div>
                                    </div>
                                    {/* Two strong CTA boxes */}
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className={`h-14 ${isLight ? "bg-white/10" : "bg-slate-900/10"} border-3 ${colors.border} rounded-lg flex items-center justify-center`}>
                                        <div className={`w-12 h-2 ${colors.secondary} rounded`}></div>
                                      </div>
                                      <div className={`h-14 ${isLight ? "bg-white/10" : "bg-slate-900/10"} border-3 ${colors.border} rounded-lg flex items-center justify-center`}>
                                        <div className={`w-12 h-2 ${colors.secondary} rounded`}></div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else if (template.value === "creative") {
                                previewContent = (
                                  <div className={`${bgColor} rounded-lg p-3 border ${borderColor} shadow-sm overflow-hidden relative`}>
                                    {/* Artistic header with gradient circle logo */}
                                    <div className="flex items-center gap-2 mb-2 relative z-10">
                                      <div className={`w-7 h-7 bg-gradient-to-br ${colors.gradient} rounded-full shadow-lg`}></div>
                                      <div className={`w-14 h-2 ${textColor} rounded`}></div>
                                      <div className="ml-auto flex gap-1">
                                        <div className={`w-1 h-1 ${colors.secondary} rounded-full`}></div>
                                        <div className={`w-1 h-1 ${colors.primary} rounded-full`}></div>
                                        <div className={`w-1 h-1 ${colors.accent} rounded-full`}></div>
                                      </div>
                                    </div>
                                    {/* Overlapping gradient blobs - signature creative style */}
                                    <div className="relative h-20 mb-2 rounded-lg overflow-hidden">
                                      <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-60 blur-2xl"></div>
                                      <div className="absolute top-2 right-0 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-60 blur-2xl"></div>
                                      <div className="absolute -bottom-2 left-1/3 w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full opacity-60 blur-2xl"></div>
                                      <div className="relative h-full flex items-center justify-center backdrop-blur-sm">
                                        <div className={`w-24 h-3 ${textColor} rounded shadow-lg`}></div>
                                      </div>
                                    </div>
                                    {/* Colorful feature cards */}
                                    <div className="grid grid-cols-4 gap-1.5">
                                      <div className={`h-12 ${colors.secondary} rounded-lg shadow-md`}></div>
                                      <div className={`h-12 ${colors.primary} rounded-lg shadow-md`}></div>
                                      <div className={`h-12 ${colors.accent} rounded-lg shadow-md`}></div>
                                      <div className={`h-12 bg-gradient-to-br ${colors.gradient} rounded-lg shadow-md`}></div>
                                    </div>
                                  </div>
                                );
                              } else if (template.value === "corporate") {
                                previewContent = (
                                  <div className={`${bgColor} rounded-lg p-3 border ${borderColor} shadow-sm`}>
                                    {/* Professional header with square logo */}
                                    <div className="flex items-center mb-2 pb-2 border-b border-slate-300">
                                      <div className="flex items-center gap-1.5">
                                        <div className={`w-6 h-6 ${colors.logo} rounded-sm border-2 ${colors.border}`}></div>
                                        <div className={`w-16 h-2 ${textColor} rounded font-semibold`}></div>
                                      </div>
                                    </div>
                                    {/* Professional banner with navigation */}
                                    <div className={`h-16 bg-gradient-to-r ${colors.gradient} rounded mb-2 px-3 flex items-center justify-between border ${colors.border}`}>
                                      <div className="w-20 h-3 bg-white rounded font-semibold shadow"></div>
                                      <div className="flex gap-1">
                                        <div className="w-4 h-1 bg-white/80 rounded"></div>
                                        <div className="w-4 h-1 bg-white/80 rounded"></div>
                                        <div className="w-4 h-1 bg-white rounded"></div>
                                      </div>
                                    </div>
                                    {/* Three structured information cards */}
                                    <div className="grid grid-cols-3 gap-1.5">
                                      <div className={`h-14 ${isLight ? "bg-slate-100 border-2 border-slate-300" : "bg-slate-800 border-2 border-slate-600"} rounded p-1.5`}>
                                        <div className={`w-4 h-4 ${colors.primary} rounded mb-1`}></div>
                                        <div className={`w-full h-1.5 ${isLight ? "bg-slate-400" : "bg-slate-500"} rounded mb-0.5`}></div>
                                        <div className={`w-2/3 h-1 ${isLight ? "bg-slate-300" : "bg-slate-600"} rounded`}></div>
                                      </div>
                                      <div className={`h-14 ${isLight ? "bg-slate-100 border-2 border-slate-300" : "bg-slate-800 border-2 border-slate-600"} rounded p-1.5`}>
                                        <div className={`w-4 h-4 ${colors.primary} rounded mb-1`}></div>
                                        <div className={`w-full h-1.5 ${isLight ? "bg-slate-400" : "bg-slate-500"} rounded mb-0.5`}></div>
                                        <div className={`w-2/3 h-1 ${isLight ? "bg-slate-300" : "bg-slate-600"} rounded`}></div>
                                      </div>
                                      <div className={`h-14 ${isLight ? "bg-slate-100 border-2 border-slate-300" : "bg-slate-800 border-2 border-slate-600"} rounded p-1.5`}>
                                        <div className={`w-4 h-4 ${colors.primary} rounded mb-1`}></div>
                                        <div className={`w-full h-1.5 ${isLight ? "bg-slate-400" : "bg-slate-500"} rounded mb-0.5`}></div>
                                        <div className={`w-2/3 h-1 ${isLight ? "bg-slate-300" : "bg-slate-600"} rounded`}></div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else if (template.value === "elegant") {
                                previewContent = (
                                  <div className={`${bgColor} rounded-lg p-4 border ${borderColor} shadow-sm`}>
                                    {/* Elegant centered header with decorative circle logo */}
                                    <div className="text-center mb-3">
                                      <div className={`w-10 h-10 mx-auto mb-2 border-2 ${colors.border} rounded-full flex items-center justify-center shadow-lg`}>
                                        <div className={`w-5 h-5 bg-gradient-to-br ${colors.gradient} rounded-full`}></div>
                                      </div>
                                      <div className={`w-24 h-2.5 ${textColor} rounded mx-auto mb-2 font-serif`}></div>
                                      {/* Decorative divider */}
                                      <div className="flex items-center justify-center gap-1 mb-2">
                                        <div className={`h-px w-8 bg-gradient-to-r from-transparent ${colors.secondary} opacity-50`}></div>
                                        <div className={`w-1.5 h-1.5 ${colors.primary} rounded-full`}></div>
                                        <div className={`h-px w-8 bg-gradient-to-l from-transparent ${colors.secondary} opacity-50`}></div>
                                      </div>
                                    </div>
                                    {/* Luxurious content area with accent */}
                                    <div className={`h-14 ${isLight ? `${colors.secondary} opacity-10` : `${colors.secondary} opacity-20`} rounded mb-2 border-2 ${colors.border} p-2 flex items-center justify-center`}>
                                      <div className={`w-16 h-2 ${colors.primary} rounded`}></div>
                                    </div>
                                    {/* Two refined feature boxes */}
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className={`h-12 ${isLight ? "bg-slate-50 border-2 border-slate-200" : "bg-slate-800 border-2 border-slate-700"} rounded p-2 flex flex-col justify-center`}>
                                        <div className={`w-1 h-1 ${colors.primary} rounded-full mb-1 mx-auto`}></div>
                                        <div className={`w-full h-1 ${isLight ? "bg-slate-300" : "bg-slate-600"} rounded`}></div>
                                      </div>
                                      <div className={`h-12 ${isLight ? "bg-slate-50 border-2 border-slate-200" : "bg-slate-800 border-2 border-slate-700"} rounded p-2 flex flex-col justify-center`}>
                                        <div className={`w-1 h-1 ${colors.primary} rounded-full mb-1 mx-auto`}></div>
                                        <div className={`w-full h-1 ${isLight ? "bg-slate-300" : "bg-slate-600"} rounded`}></div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else if (template.value === "tech") {
                                previewContent = (
                                  <div className={`${isLight ? "bg-gradient-to-br from-slate-900 via-slate-900 to-black" : "bg-gradient-to-br from-slate-950 via-slate-950 to-black"} rounded-lg p-3 shadow-xl relative overflow-hidden border ${colors.border} opacity-80`}>
                                    {/* Futuristic grid pattern background */}
                                    <div className="absolute inset-0 opacity-30">
                                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                                    </div>
                                    <div className="relative z-10">
                                      {/* Neon header */}
                                      <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-1">
                                          <div className={`w-2 h-2 ${colors.secondary} rounded-sm shadow-lg`}></div>
                                          <div className={`w-14 h-2 bg-gradient-to-r ${colors.gradient} rounded shadow-lg`}></div>
                                        </div>
                                        <div className="flex gap-1.5">
                                          <div className={`w-1.5 h-1.5 ${colors.secondary} rounded-full shadow-lg`}></div>
                                          <div className={`w-1.5 h-1.5 ${colors.primary} rounded-full shadow-lg`}></div>
                                          <div className={`w-1.5 h-1.5 ${colors.accent} rounded-full shadow-lg`}></div>
                                        </div>
                                      </div>
                                      {/* Cyber hero section */}
                                      <div className={`h-20 bg-gradient-to-r ${colors.gradient} opacity-20 rounded-lg border-2 ${colors.border} mb-2 flex items-center justify-center backdrop-blur-sm shadow-inner`}>
                                        <div className="w-24 h-3.5 bg-white rounded shadow-2xl"></div>
                                      </div>
                                      {/* Three glowing feature cards */}
                                      <div className="grid grid-cols-3 gap-1.5">
                                        <div className={`h-12 ${colors.secondary} opacity-10 rounded-lg border ${colors.border} shadow-lg p-1.5`}>
                                          <div className={`w-full h-1.5 ${colors.secondary} opacity-50 rounded mb-1`}></div>
                                          <div className={`w-2/3 h-1 ${colors.secondary} opacity-30 rounded`}></div>
                                        </div>
                                        <div className={`h-12 ${colors.primary} opacity-10 rounded-lg border ${colors.border} shadow-lg p-1.5`}>
                                          <div className={`w-full h-1.5 ${colors.primary} opacity-50 rounded mb-1`}></div>
                                          <div className={`w-2/3 h-1 ${colors.primary} opacity-30 rounded`}></div>
                                        </div>
                                        <div className={`h-12 ${colors.accent} opacity-10 rounded-lg border ${colors.border} shadow-lg p-1.5`}>
                                          <div className={`w-full h-1.5 ${colors.accent} opacity-50 rounded mb-1`}></div>
                                          <div className={`w-2/3 h-1 ${colors.accent} opacity-30 rounded`}></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else if (template.value === "magazine") {
                                previewContent = (
                                  <div className={`${bgColor} rounded-lg p-3 border ${borderColor} shadow-sm`}>
                                    {/* Editorial header with bold masthead */}
                                    <div className="mb-2">
                                      <div className="flex gap-2 items-center mb-2 pb-1.5 border-b-2 border-slate-300">
                                        <div className={`w-18 h-3 ${textColor} rounded-sm font-black`}></div>
                                        <div className="flex gap-2 ml-auto text-xs">
                                          <div className={`w-6 h-1 ${isLight ? "bg-slate-500" : "bg-slate-400"} rounded`}></div>
                                          <div className={`w-6 h-1 ${isLight ? "bg-slate-500" : "bg-slate-400"} rounded`}></div>
                                          <div className={`w-6 h-1 ${isLight ? "bg-slate-500" : "bg-slate-400"} rounded`}></div>
                                        </div>
                                      </div>
                                    </div>
                                    {/* Featured article with large image + sidebar */}
                                    <div className="grid grid-cols-3 gap-2 mb-2">
                                      <div className={`col-span-2 h-22 ${isLight ? "bg-gradient-to-br from-slate-300 to-slate-200" : "bg-gradient-to-br from-slate-700 to-slate-600"} rounded-sm relative overflow-hidden shadow-md`}>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                          <div className="w-12 h-12 border-4 border-white rounded"></div>
                                        </div>
                                        <div className="absolute bottom-2 left-2 right-2 bg-gradient-to-t from-black/80 to-transparent p-2 rounded">
                                          <div className="w-3/4 h-2 bg-white rounded mb-0.5"></div>
                                          <div className="w-1/2 h-1 bg-white/80 rounded"></div>
                                        </div>
                                      </div>
                                      <div className="space-y-1.5">
                                        <div className={`h-10 ${isLight ? "bg-slate-200 border border-slate-300" : "bg-slate-700 border border-slate-600"} rounded-sm p-1.5`}>
                                          <div className={`w-full h-1 ${isLight ? "bg-slate-400" : "bg-slate-500"} rounded mb-0.5`}></div>
                                          <div className={`w-2/3 h-0.5 ${isLight ? "bg-slate-300" : "bg-slate-600"} rounded`}></div>
                                        </div>
                                        <div className={`h-10 ${isLight ? "bg-slate-200 border border-slate-300" : "bg-slate-700 border border-slate-600"} rounded-sm p-1.5`}>
                                          <div className={`w-full h-1 ${isLight ? "bg-slate-400" : "bg-slate-500"} rounded mb-0.5`}></div>
                                          <div className={`w-2/3 h-0.5 ${isLight ? "bg-slate-300" : "bg-slate-600"} rounded`}></div>
                                        </div>
                                      </div>
                                    </div>
                                    {/* Three article previews in row */}
                                    <div className="grid grid-cols-3 gap-1.5">
                                      <div className={`h-10 ${isLight ? "bg-slate-100 border border-slate-300" : "bg-slate-800 border border-slate-600"} rounded-sm p-1.5`}>
                                        <div className={`w-full h-1.5 ${isLight ? "bg-slate-400" : "bg-slate-500"} rounded mb-1`}></div>
                                        <div className={`w-2/3 h-1 ${isLight ? "bg-slate-300" : "bg-slate-600"} rounded`}></div>
                                      </div>
                                      <div className={`h-10 ${isLight ? "bg-slate-100 border border-slate-300" : "bg-slate-800 border border-slate-600"} rounded-sm p-1.5`}>
                                        <div className={`w-full h-1.5 ${isLight ? "bg-slate-400" : "bg-slate-500"} rounded mb-1`}></div>
                                        <div className={`w-2/3 h-1 ${isLight ? "bg-slate-300" : "bg-slate-600"} rounded`}></div>
                                      </div>
                                      <div className={`h-10 ${isLight ? "bg-slate-100 border border-slate-300" : "bg-slate-800 border border-slate-600"} rounded-sm p-1.5`}>
                                        <div className={`w-full h-1.5 ${isLight ? "bg-slate-400" : "bg-slate-500"} rounded mb-1`}></div>
                                        <div className={`w-2/3 h-1 ${isLight ? "bg-slate-300" : "bg-slate-600"} rounded`}></div>
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
                                      template.category === "Minimal" ? "bg-slate-500 text-white" :
                                      template.category === "Tech" ? "bg-cyan-500 text-white" :
                                      "bg-gray-500 text-white"
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