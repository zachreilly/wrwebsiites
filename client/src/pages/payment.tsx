import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Shield, CreditCard, Users, CheckCircle, User, Globe, FileText, Palette, Settings } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { termsAndConditions, directDebitGuarantee } from "@/components/legal/terms-and-conditions";

interface PaymentFormData {
  package: string;
  // Client Details
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  businessDescription: string;
  pagesNeeded: string;
  hasDomain: string;
  existingDomain: string;
  desiredDomains: string;
  colorScheme: string;
  wantsContactForm: boolean;
  googleBusinessSetup: boolean;
  socialMediaLinks: string;
  specialRequests: string;
  // Payment Details
  accountHolderName: string;
  sortCode: string;
  accountNumber: string;
  address: string;
  city: string;
  postcode: string;
  agreedToTerms: boolean;
  agreedToDirectDebit: boolean;
  // Success data
  customerId?: string;
  customerEmail?: string;
}

export default function PaymentPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Get package from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const packageFromUrl = urlParams.get('package') || '';
  
  const [formData, setFormData] = useState<PaymentFormData>({
    package: packageFromUrl,
    // Client Details
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    businessDescription: '',
    pagesNeeded: '',
    hasDomain: '',
    existingDomain: '',
    desiredDomains: '',
    colorScheme: '',
    wantsContactForm: false,
    googleBusinessSetup: false,
    socialMediaLinks: '',
    specialRequests: '',
    // Payment Details
    accountHolderName: '',
    sortCode: '',
    accountNumber: '',
    address: '',
    city: '',
    postcode: '',
    agreedToTerms: false,
    agreedToDirectDebit: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5; // Package, Client Details, Domain Info, Payment Details, Thank You
  const [showTerms, setShowTerms] = useState(false);
  const [showDirectDebitInfo, setShowDirectDebitInfo] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [stepErrors, setStepErrors] = useState<{[key: number]: string}>({});

  const submitApplication = useMutation({
    mutationFn: async (data: PaymentFormData) => {
      setIsValidating(true);
      // Split full name into first and last name
      const nameParts = data.fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Submit both client data and payment data
      const clientData = {
        fullName: data.fullName,
        businessName: data.businessName,
        email: data.email,
        phone: data.phone,
        businessDescription: data.businessDescription,
        pagesNeeded: data.pagesNeeded,
        hasDomain: data.hasDomain,
        existingDomain: data.existingDomain,
        desiredDomains: data.desiredDomains,
        colorScheme: data.colorScheme,
        wantContactForm: data.wantsContactForm ? 'Yes' : 'No',
        googleBusinessSetup: data.googleBusinessSetup ? 'Yes' : 'No',
        wantSocialLinks: data.socialMediaLinks ? 'Yes' : 'No',
        socialMediaLinks: data.socialMediaLinks,
        specialRequests: data.specialRequests
      };
      
      // Submit client data
      await apiRequest("POST", "/api/clients", clientData);
      
      // Submit payment data with split names
      const paymentData = {
        ...data,
        firstName,
        lastName
      };
      return await apiRequest("POST", "/api/payment/direct-debit", paymentData);
    },
    onSuccess: (data: any) => {
      setIsValidating(false);
      setCurrentStep(5); // Thank you step
      
      // Store customer data for thank you page
      setFormData(prev => ({
        ...prev,
        customerId: data.customer?.id,
        customerEmail: data.customer?.email
      }));
      
      toast({
        title: "Payment Setup Complete!",
        description: "Your direct debit has been set up successfully. You now have access to your customer portal.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      setIsValidating(false);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error processing your application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof PaymentFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific errors on change
    if (stepErrors[currentStep]) {
      const newErrors = {...stepErrors};
      delete newErrors[currentStep];
      setStepErrors(newErrors);
    }
    
    // Auto-format sort code
    if (field === 'sortCode' && typeof value === 'string') {
      const formatted = formatSortCode(value);
      if (formatted !== value) {
        setFormData(prev => ({ ...prev, [field]: formatted }));
      }
    }
  };

  const validateStep1 = () => {
    return formData.package;
  };

  const validateStep2 = () => {
    return formData.fullName && formData.businessName && formData.email && formData.businessDescription && formData.pagesNeeded && formData.colorScheme;
  };

  const validateStep3 = () => {
    if (formData.package === 'premium') {
      return formData.hasDomain && (formData.hasDomain === 'yes' ? formData.existingDomain : formData.desiredDomains);
    }
    return true; // Skip domain step for basic package
  };

  const validateStep4 = () => {
    return formData.accountHolderName && formData.sortCode.length === 6 && 
           formData.accountNumber.length >= 6 && formData.address && 
           formData.city && formData.postcode && formData.agreedToTerms && 
           formData.agreedToDirectDebit;
  };

  const formatSortCode = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = numbers.replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3');
    return formatted.slice(0, 8);
  };

  const packageDetails = {
    basic: {
      name: "Basic Static Website",
      setupFee: 50,
      monthlyFee: 10,
      features: ["Mobile-responsive design", "Up to 5 pages", "Basic SEO", "Contact form", "1 month support"]
    },
    premium: {
      name: "Premium Hosting and Domain Website",
      setupFee: 150, 
      monthlyFee: 10,
      features: ["Everything in Basic", "Custom domain included", "Advanced SEO", "Analytics setup", "3 months support", "Content management"]
    }
  };

  const calculateTotal = () => {
    if (!formData.package) return 0;
    const basePrice = packageDetails[formData.package as keyof typeof packageDetails].setupFee;
    const googleBusinessPrice = formData.googleBusinessSetup ? 25 : 0;
    return basePrice + googleBusinessPrice;
  };

  const nextStep = () => {
    // Add smooth transition effect
    setIsValidating(true);
    
    setTimeout(() => {
      if (currentStep === 1 && validateStep1()) {
        setCurrentStep(2);
      } else if (currentStep === 2 && validateStep2()) {
        if (formData.package === 'basic') {
          setCurrentStep(4); // Skip domain step for basic package
        } else {
          setCurrentStep(3);
        }
      } else if (currentStep === 3 && validateStep3()) {
        setCurrentStep(4);
      } else if (currentStep === 4 && validateStep4()) {
        submitApplication.mutate(formData);
        return; // Don't reset validation state
      }
      setIsValidating(false);
    }, 300); // Small delay for smooth UX
  };

  const prevStep = () => {
    // Clear any step errors when going back
    const newErrors = {...stepErrors};
    delete newErrors[currentStep];
    setStepErrors(newErrors);
    
    if (currentStep === 4 && formData.package === 'basic') {
      setCurrentStep(2); // Skip domain step for basic package
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Thank You Page
  if (currentStep === 5) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center px-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <CardTitle className="text-3xl text-emerald-600 mb-2">Thank You!</CardTitle>
            <CardDescription className="text-lg">Your application has been successfully submitted</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
              <h3 className="font-semibold text-emerald-800 mb-4 text-lg">Your Account is Ready!</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-emerald-200">
                  <h4 className="font-medium text-emerald-800 mb-2">Customer Portal Access</h4>
                  <p className="text-emerald-700 text-sm">Use your email address: <strong>{formData.email}</strong></p>
                  <p className="text-emerald-700 text-sm">To track your project progress, approve designs, and manage payments</p>
                </div>
                <ul className="space-y-3 text-emerald-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Project development begins within 24 hours</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Track progress and approve designs in your portal</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Setup fee collected when website goes live</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Monthly £10 payments start automatically</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border">
              <p className="text-sm text-slate-600 text-center">
                <strong>Contact Information:</strong> {formData.email} | {formData.phone}
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                <p className="text-sm text-blue-800 font-medium mb-2">🚀 Ready to get started?</p>
                <p className="text-sm text-blue-700">Access your customer portal now to see your project details and track progress in real-time.</p>
              </div>
              <Button 
                onClick={() => {
                  // Smooth transition to customer portal
                  toast({
                    title: "Redirecting to Customer Portal",
                    description: "Taking you to your project dashboard...",
                    variant: "default",
                  });
                  setTimeout(() => {
                    window.location.href = '/customer-portal';
                  }, 1000);
                }} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 w-full text-lg font-semibold transition-all duration-200 transform hover:scale-105"
                data-testid="button-access-portal"
              >
                🔑 Access Your Customer Portal
              </Button>
              <Button 
                onClick={() => setLocation('/')} 
                variant="outline" 
                className="px-8 py-2 w-full transition-all duration-200"
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

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Select Your Package";
      case 2: return "Project Details";
      case 3: return "Domain Information";
      case 4: return "Payment Setup";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Choose the website package that best fits your needs";
      case 2: return "Tell us about your business and website requirements";
      case 3: return "Domain and hosting information for your premium package";
      case 4: return "Set up your direct debit for automatic payments";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Setup Your Website</h1>
            <p className="text-slate-600">Complete your application to get started</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Step {currentStep} of {totalSteps - 1}</span>
            <span className="text-sm text-slate-500">{Math.round((currentStep / (totalSteps - 1)) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{getStepTitle()}</CardTitle>
                <CardDescription>{getStepDescription()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Step 1: Package Selection */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="package">Select Package *</Label>
                      <Select value={formData.package} onValueChange={(value) => handleInputChange('package', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your website package" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic Static Website - £50 setup + £10/month</SelectItem>
                          <SelectItem value="premium">Premium Hosting and Domain Website - £150 setup + £10/month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.package && (
                      <div className="bg-slate-50 p-6 rounded-lg border">
                        <h3 className="font-semibold text-slate-900 mb-3">{packageDetails[formData.package as keyof typeof packageDetails].name}</h3>
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-2xl font-bold text-emerald-600">
                            £{calculateTotal()} setup
                          </span>
                          <span className="text-lg text-slate-600">
                            + £{packageDetails[formData.package as keyof typeof packageDetails].monthlyFee}/month
                          </span>
                        </div>
                        
                        {/* Price Breakdown */}
                        <div className="mb-4 text-sm text-slate-600">
                          <div className="flex justify-between">
                            <span>Base package:</span>
                            <span>£{packageDetails[formData.package as keyof typeof packageDetails].setupFee}</span>
                          </div>
                          {formData.googleBusinessSetup && (
                            <div className="flex justify-between">
                              <span>Google Business setup:</span>
                              <span>£25</span>
                            </div>
                          )}
                          <hr className="my-2" />
                          <div className="flex justify-between font-semibold">
                            <span>Total setup:</span>
                            <span>£{calculateTotal()}</span>
                          </div>
                        </div>
                        <ul className="space-y-2">
                          {packageDetails[formData.package as keyof typeof packageDetails].features.map((feature, index) => (
                            <li key={index} className="flex items-center text-slate-700">
                              <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        
                        {/* Google Business Add-on */}
                        <div className="mt-4 p-4 border rounded-lg bg-blue-50">
                          <div className="flex items-center space-x-2 mb-2">
                            <Checkbox
                              id="googleBusinessSetup"
                              checked={formData.googleBusinessSetup}
                              onCheckedChange={(checked) => handleInputChange('googleBusinessSetup', !!checked)}
                            />
                            <Label htmlFor="googleBusinessSetup" className="font-medium text-slate-900">
                              Add Google Business Listing Setup (+£25)
                            </Label>
                          </div>
                          <p className="text-sm text-slate-600 ml-6">
                            We'll set up and optimize your Google Business profile to help customers find you locally
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Client Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="border-l-4 border-l-blue-500 pl-4">
                      <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-600" />
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            placeholder="John Smith"
                          />
                        </div>
                        <div>
                          <Label htmlFor="businessName">Business/Brand Name *</Label>
                          <Input
                            id="businessName"
                            value={formData.businessName}
                            onChange={(e) => handleInputChange('businessName', e.target.value)}
                            placeholder="Your Business Name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="john@business.com"
                            className={validateField('email', formData.email) ? 'border-red-300 focus:border-red-500' : ''}
                          />
                          {validateField('email', formData.email) && (
                            <p className="text-red-500 text-sm mt-1">{validateField('email', formData.email)}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="07123 456789"
                            className={validateField('phone', formData.phone) ? 'border-red-300 focus:border-red-500' : ''}
                          />
                          {validateField('phone', formData.phone) && (
                            <p className="text-red-500 text-sm mt-1">{validateField('phone', formData.phone)}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-l-purple-500 pl-4">
                      <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-purple-600" />
                        Website Content
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="businessDescription">About Your Business *</Label>
                          <Textarea
                            id="businessDescription"
                            value={formData.businessDescription}
                            onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                            placeholder="Brief description of your business for the 'About Us' section"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="pagesNeeded">Pages Needed *</Label>
                          <Input
                            id="pagesNeeded"
                            value={formData.pagesNeeded}
                            onChange={(e) => handleInputChange('pagesNeeded', e.target.value)}
                            placeholder="e.g. Home, About, Services, Contact, Gallery"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-l-orange-500 pl-4">
                      <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                        <Palette className="w-5 h-5 mr-2 text-orange-600" />
                        Design Preferences
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="colorScheme">Preferred Style/Colors *</Label>
                          <Input
                            id="colorScheme"
                            value={formData.colorScheme}
                            onChange={(e) => handleInputChange('colorScheme', e.target.value)}
                            placeholder="e.g. modern, professional, blue and white, etc."
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="wantsContactForm"
                              checked={formData.wantsContactForm}
                              onCheckedChange={(checked) => handleInputChange('wantsContactForm', !!checked)}
                            />
                            <Label htmlFor="wantsContactForm" className="text-sm">Include contact form on website</Label>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="socialMediaLinks">Social Media Links</Label>
                          <Input
                            id="socialMediaLinks"
                            value={formData.socialMediaLinks}
                            onChange={(e) => handleInputChange('socialMediaLinks', e.target.value)}
                            placeholder="Facebook, Instagram, LinkedIn URLs (optional)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="specialRequests">Special Requests</Label>
                          <Textarea
                            id="specialRequests"
                            value={formData.specialRequests}
                            onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                            placeholder="Any specific features or requirements for your website"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Domain Information (Premium only) */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="border-l-4 border-l-emerald-500 pl-4">
                      <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                        <Globe className="w-5 h-5 mr-2 text-emerald-600" />
                        Domain & Hosting
                        <span className="text-sm text-emerald-600 font-normal ml-2">(Premium Package)</span>
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="hasDomain">Do you already have a domain name? *</Label>
                          <Select value={formData.hasDomain} onValueChange={(value) => handleInputChange('hasDomain', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes, I have a domain</SelectItem>
                              <SelectItem value="no">No, I need a new domain</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {formData.hasDomain === 'yes' && (
                          <div>
                            <Label htmlFor="existingDomain">Your Existing Domain *</Label>
                            <Input
                              id="existingDomain"
                              value={formData.existingDomain}
                              onChange={(e) => handleInputChange('existingDomain', e.target.value)}
                              placeholder="yourbusiness.com"
                            />
                          </div>
                        )}

                        {formData.hasDomain === 'no' && (
                          <div>
                            <Label htmlFor="desiredDomains">Desired Domain Names *</Label>
                            <Textarea
                              id="desiredDomains"
                              value={formData.desiredDomains}
                              onChange={(e) => handleInputChange('desiredDomains', e.target.value)}
                              placeholder="List 2-3 domain name options in case your first choice isn't available (e.g. yourbusiness.com, yourbusiness.co.uk)"
                              rows={3}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Payment Setup */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="border-l-4 border-l-blue-500 pl-4">
                      <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                        Direct Debit Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                          <Input
                            id="accountHolderName"
                            value={formData.accountHolderName}
                            onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                            placeholder="John Smith"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="sortCode">Sort Code *</Label>
                            <Input
                              id="sortCode"
                              value={formData.sortCode}
                              onChange={(e) => handleInputChange('sortCode', formatSortCode(e.target.value))}
                              placeholder="12-34-56"
                              maxLength={8}
                              className={validateField('sortCode', formData.sortCode) ? 'border-red-300 focus:border-red-500' : 'border-green-300 focus:border-green-500'}
                            />
                            {validateField('sortCode', formData.sortCode) && (
                              <p className="text-red-500 text-sm mt-1">{validateField('sortCode', formData.sortCode)}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="accountNumber">Account Number *</Label>
                            <Input
                              id="accountNumber"
                              value={formData.accountNumber}
                              onChange={(e) => handleInputChange('accountNumber', e.target.value.replace(/\D/g, ''))}
                              placeholder="12345678"
                              maxLength={8}
                              className={validateField('accountNumber', formData.accountNumber) ? 'border-red-300 focus:border-red-500' : 'border-green-300 focus:border-green-500'}
                            />
                            {validateField('accountNumber', formData.accountNumber) && (
                              <p className="text-red-500 text-sm mt-1">{validateField('accountNumber', formData.accountNumber)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-l-slate-500 pl-4">
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Billing Address</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="address">Address *</Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="123 Main Street"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City *</Label>
                            <Input
                              id="city"
                              value={formData.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              placeholder="London"
                            />
                          </div>
                          <div>
                            <Label htmlFor="postcode">Postcode *</Label>
                            <Input
                              id="postcode"
                              value={formData.postcode}
                              onChange={(e) => handleInputChange('postcode', e.target.value.toUpperCase())}
                              placeholder="SW1A 1AA"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-start">
                        <Shield className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-yellow-800 mb-1">Direct Debit Setup</p>
                          <p className="text-yellow-700">
                            Your first payment will be taken after your website is completed and approved. 
                            Monthly payments will then be collected automatically.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="agreedToTerms"
                          checked={formData.agreedToTerms}
                          onCheckedChange={(checked) => handleInputChange('agreedToTerms', !!checked)}
                        />
                        <div className="text-sm">
                          <Label htmlFor="agreedToTerms" className="font-medium">
                            I agree to the{" "}
                            <button
                              type="button"
                              onClick={() => setShowTerms(true)}
                              className="text-blue-600 hover:underline"
                            >
                              Terms and Conditions
                            </button>
                            {" "}*
                          </Label>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="agreedToDirectDebit"
                          checked={formData.agreedToDirectDebit}
                          onCheckedChange={(checked) => handleInputChange('agreedToDirectDebit', !!checked)}
                        />
                        <div className="text-sm">
                          <Label htmlFor="agreedToDirectDebit" className="font-medium">
                            I agree to the{" "}
                            <button
                              type="button"
                              onClick={() => setShowDirectDebitInfo(true)}
                              className="text-blue-600 hover:underline"
                            >
                              Direct Debit Guarantee
                            </button>
                            {" "}*
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      disabled={submitApplication.isPending || isValidating}
                      className="transition-all duration-200"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                  )}
                  <div className="ml-auto">
                    <Button
                      onClick={nextStep}
                      disabled={
                        (currentStep === 1 && !validateStep1()) ||
                        (currentStep === 2 && !validateStep2()) ||
                        (currentStep === 3 && !validateStep3()) ||
                        (currentStep === 4 && !validateStep4()) ||
                        submitApplication.isPending ||
                        isValidating
                      }
                      className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 min-w-[140px]"
                    >
                      {submitApplication.isPending ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Setting up payment...
                        </>
                      ) : isValidating ? (
                        <>
                          <div className="animate-pulse w-4 h-4 bg-white rounded-full mr-2" />
                          Validating...
                        </>
                      ) : currentStep === 4 ? (
                        "Complete Setup"
                      ) : (
                        "Next Step"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Package Summary */}
            {formData.package && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Package Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h3 className="font-semibold">{packageDetails[formData.package as keyof typeof packageDetails].name}</h3>
                    <div className="flex items-center justify-between">
                      <span>Setup Fee:</span>
                      <span className="font-semibold">{packageDetails[formData.package as keyof typeof packageDetails].setupFee}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Monthly Fee:</span>
                      <span className="font-semibold">{packageDetails[formData.package as keyof typeof packageDetails].monthlyFee}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> zachhreillyy@gmail.com</p>
                  <p><strong>Phone:</strong> 07397985279</p>
                  <p><strong>Phone:</strong> 07535778637</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Terms and Conditions</h2>
                <Button variant="ghost" onClick={() => setShowTerms(false)}>×</Button>
              </div>
              <div className="text-sm space-y-4" dangerouslySetInnerHTML={{ __html: termsAndConditions }} />
            </div>
          </div>
        </div>
      )}

      {/* Direct Debit Info Modal */}
      {showDirectDebitInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Direct Debit Guarantee</h2>
                <Button variant="ghost" onClick={() => setShowDirectDebitInfo(false)}>×</Button>
              </div>
              <div className="text-sm space-y-4" dangerouslySetInnerHTML={{ __html: directDebitGuarantee }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}