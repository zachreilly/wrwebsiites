import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Shield, CreditCard, Users, CheckCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { termsAndConditions, directDebitGuarantee } from "@/components/legal/terms-and-conditions";

interface PaymentFormData {
  package: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  accountHolderName: string;
  sortCode: string;
  accountNumber: string;
  address: string;
  city: string;
  postcode: string;
  agreedToTerms: boolean;
  agreedToDirectDebit: boolean;
}

export default function PaymentPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Get package from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const packageFromUrl = urlParams.get('package') || '';
  
  const [formData, setFormData] = useState<PaymentFormData>({
    package: packageFromUrl,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
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
  const [showTerms, setShowTerms] = useState(false);
  const [showDirectDebitInfo, setShowDirectDebitInfo] = useState(false);

  const submitPayment = useMutation({
    mutationFn: async (data: PaymentFormData) => {
      return await apiRequest("POST", "/api/payment/direct-debit", data);
    },
    onSuccess: () => {
      toast({
        title: "Payment Setup Successful",
        description: "Your direct debit has been set up. We'll contact you within 24 hours to confirm your website project.",
      });
      setCurrentStep(4); // Success step
    },
    onError: (error: any) => {
      toast({
        title: "Payment Setup Failed",
        description: error.message || "There was an error setting up your payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof PaymentFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    return formData.package && formData.firstName && formData.lastName && 
           formData.email && formData.phone && formData.businessName;
  };

  const validateStep2 = () => {
    return formData.address && formData.city && formData.postcode;
  };

  const validateStep3 = () => {
    return formData.accountHolderName && formData.sortCode.length === 6 && 
           formData.accountNumber.length >= 6 && formData.agreedToTerms && 
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
      setupFee: "£50",
      monthlyFee: "£10",
      features: ["Mobile-responsive design", "Up to 5 pages", "Basic SEO", "Contact form", "1 month support"]
    },
    premium: {
      name: "Premium Hosting and Domain Website",
      setupFee: "£150", 
      monthlyFee: "£10",
      features: ["Everything in Basic", "Custom domain included", "Advanced SEO", "Analytics setup", "3 months support", "Content management"]
    }
  };

  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center px-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl text-emerald-600">Payment Setup Complete!</CardTitle>
            <CardDescription>Your direct debit has been successfully set up</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-emerald-50 p-6 rounded-lg">
              <h3 className="font-semibold text-emerald-800 mb-2">What happens next?</h3>
              <ul className="space-y-2 text-emerald-700">
                <li>• We'll contact you within 24 hours to confirm your project details</li>
                <li>• Your website development will begin immediately</li>
                <li>• You'll receive updates throughout the development process</li>
                <li>• Your first payment will be taken once your website is live</li>
              </ul>
            </div>
            <div className="text-center">
              <Button onClick={() => setLocation('/')} className="bg-emerald-600 hover:bg-emerald-700">
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
            <p className="text-slate-600">Complete your direct debit setup to get started</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Step {currentStep} of 3</span>
            <span className="text-sm text-slate-500">{Math.round((currentStep / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 && "Package & Contact Details"}
                  {currentStep === 2 && "Billing Address"}
                  {currentStep === 3 && "Direct Debit Setup"}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && "Choose your package and provide your contact information"}
                  {currentStep === 2 && "Enter your billing address for invoicing"}
                  {currentStep === 3 && "Set up your direct debit for automatic payments"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Package & Contact Details */}
                {currentStep === 1 && (
                  <>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Smith"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="07XXX XXXXXX"
                      />
                    </div>

                    <div>
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        placeholder="Your Business Name"
                      />
                    </div>

                    <Button 
                      onClick={() => setCurrentStep(2)} 
                      disabled={!validateStep1()}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      Continue to Billing Address
                    </Button>
                  </>
                )}

                {/* Step 2: Billing Address */}
                {currentStep === 2 && (
                  <>
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="123 High Street"
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

                    <div className="flex gap-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentStep(1)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={() => setCurrentStep(3)} 
                        disabled={!validateStep2()}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      >
                        Continue to Payment Setup
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 3: Direct Debit Setup */}
                {currentStep === 3 && (
                  <>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <Shield className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800">Secure Direct Debit</h4>
                          <p className="text-sm text-blue-700">Your bank details are encrypted and protected by the Direct Debit Guarantee</p>
                        </div>
                      </div>
                    </div>

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
                        />
                      </div>
                      <div>
                        <Label htmlFor="accountNumber">Account Number *</Label>
                        <Input
                          id="accountNumber"
                          value={formData.accountNumber}
                          onChange={(e) => handleInputChange('accountNumber', e.target.value.replace(/\D/g, ''))}
                          placeholder="12345678"
                          maxLength={8}
                        />
                      </div>
                    </div>

                    {/* Important Legal Information */}
                    <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-6 space-y-6">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Important Legal Information</h3>
                        <p className="text-sm text-slate-600">Please read and accept the following before proceeding</p>
                      </div>

                      {/* Terms and Conditions Preview */}
                      <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-slate-900">Terms and Conditions</h4>
                          <Button 
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowTerms(true)}
                            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                          >
                            Read Full Terms
                          </Button>
                        </div>
                        <div className="text-xs text-slate-600 space-y-1">
                          <p>• Setup fees: Basic £50, Premium £150</p>
                          <p>• Monthly hosting: £10 for all packages</p>
                          <p>• Development begins within 5 business days</p>
                          <p>• 99.9% uptime guarantee with technical support</p>
                        </div>
                      </div>

                      {/* Direct Debit Guarantee Preview */}
                      <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-slate-900">Direct Debit Guarantee</h4>
                          <Button 
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowDirectDebitInfo(true)}
                            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                          >
                            Read Full Guarantee
                          </Button>
                        </div>
                        <div className="text-xs text-slate-600 space-y-1">
                          <p>• You can cancel Direct Debit at any time</p>
                          <p>• Full refund if errors are made by us or your bank</p>
                          <p>• 10 working days notice for any payment changes</p>
                          <p>• Protected by your bank or building society</p>
                        </div>
                      </div>

                      {/* Checkboxes */}
                      <div className="space-y-4 pt-2">
                        <div className="bg-white rounded-lg border-2 border-slate-200 p-4">
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              id="terms"
                              checked={formData.agreedToTerms}
                              onCheckedChange={(checked) => handleInputChange('agreedToTerms', checked as boolean)}
                              className="mt-1"
                            />
                            <label htmlFor="terms" className="text-sm font-medium text-slate-900 leading-5 cursor-pointer">
                              I have read and agree to the Terms and Conditions, and understand that the setup fee will be charged immediately upon website completion *
                            </label>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg border-2 border-slate-200 p-4">
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              id="directDebit"
                              checked={formData.agreedToDirectDebit}
                              onCheckedChange={(checked) => handleInputChange('agreedToDirectDebit', checked as boolean)}
                              className="mt-1"
                            />
                            <label htmlFor="directDebit" className="text-sm font-medium text-slate-900 leading-5 cursor-pointer">
                              I authorize wrwebsites to collect payments via Direct Debit and acknowledge the Direct Debit Guarantee *
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentStep(2)}
                        className="flex-1"
                        disabled={submitPayment.isPending}
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={() => submitPayment.mutate(formData)}
                        disabled={!validateStep3() || submitPayment.isPending}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      >
                        {submitPayment.isPending ? "Setting up..." : "Complete Setup"}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {formData.package && (
                  <div className="space-y-4">
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-emerald-800 mb-2">
                        {packageDetails[formData.package as keyof typeof packageDetails].name}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Setup Fee:</span>
                          <span className="font-medium">{packageDetails[formData.package as keyof typeof packageDetails].setupFee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Hosting:</span>
                          <span className="font-medium">{packageDetails[formData.package as keyof typeof packageDetails].monthlyFee}/month</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Included Features:</h4>
                      <ul className="space-y-1 text-sm text-slate-600">
                        {packageDetails[formData.package as keyof typeof packageDetails].features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-emerald-600 mr-2">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {!formData.package && (
                  <div className="text-center text-slate-500 py-8">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Select a package to see pricing details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
            <div className="bg-emerald-600 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Terms and Conditions</h2>
                  <p className="text-emerald-100 mt-1">wrwebsites - Web Development Services</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowTerms(false)}
                  className="bg-white text-emerald-600 hover:bg-emerald-50 border-white"
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
              <div className="prose max-w-none text-slate-700">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans bg-slate-50 rounded-lg p-4">
                  {termsAndConditions}
                </pre>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowTerms(false)}
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    handleInputChange('agreedToTerms', true);
                    setShowTerms(false);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  I Accept These Terms
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Direct Debit Guarantee Modal */}
      {showDirectDebitInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
            <div className="bg-blue-600 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">The Direct Debit Guarantee</h2>
                  <p className="text-blue-100 mt-1">Your rights and protections when paying by Direct Debit</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDirectDebitInfo(false)}
                  className="bg-white text-blue-600 hover:bg-blue-50 border-white"
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
                <div className="flex">
                  <Shield className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-semibold text-blue-900">Your Protection</h3>
                    <p className="text-blue-800 text-sm mt-1">
                      This guarantee is backed by all UK banks and building societies that accept Direct Debit instructions.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="prose max-w-none text-slate-700">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans bg-slate-50 rounded-lg p-4">
                  {directDebitGuarantee}
                </pre>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDirectDebitInfo(false)}
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    handleInputChange('agreedToDirectDebit', true);
                    setShowDirectDebitInfo(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  I Understand My Rights
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}