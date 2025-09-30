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
import { CheckCircle, ArrowLeft, ArrowRight, User, Globe, FileText, Palette, Settings } from "lucide-react";

const clientInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  businessName: z.string().min(1, "Business/Brand name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  
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
  const totalSteps = 5;

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
                  {currentStep === 2 && <><Globe className="w-5 h-5 mr-2" />Domain & Hosting</>}
                  {currentStep === 3 && <><FileText className="w-5 h-5 mr-2" />Website Content</>}
                  {currentStep === 4 && <><Palette className="w-5 h-5 mr-2" />Design Preferences</>}
                  {currentStep === 5 && <><Settings className="w-5 h-5 mr-2" />Additional Features</>}
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
                              <SelectItem value="basic">Basic Static Website - £50 + £10/month</SelectItem>
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

                {/* Step 2: Domain & Hosting (Premium only) */}
                {currentStep === 2 && (
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

                {/* Step 3: Website Content */}
                {currentStep === 3 && (
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

                {/* Step 4: Design Preferences */}
                {currentStep === 4 && (
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

                {/* Step 5: Additional Features */}
                {currentStep === 5 && (
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