import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface WebsiteUpdateRequestData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  currentWebsite: string;
  updateCategory: string;
  description: string;
  timeline: string;
  budget: string;
}

export default function WebsiteUpdateRequest() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<WebsiteUpdateRequestData>({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    currentWebsite: '',
    updateCategory: '',
    description: '',
    timeline: '',
    budget: ''
  });

  const submitMutation = useMutation({
    mutationFn: (data: WebsiteUpdateRequestData) => 
      apiRequest("POST", "/api/website-update", data),
    onSuccess: () => {
      toast({
        title: "Request Submitted Successfully!",
        description: "We'll assess your current website and email you a quote within 24 hours.",
      });
      setLocation('/');
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: keyof WebsiteUpdateRequestData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.currentWebsite || !formData.updateCategory || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    submitMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/')}
            className="mr-4"
            data-testid="button-back-to-home"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Update Your Website</h1>
            <p className="text-slate-600">Get a quote for enhancing your existing website</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
              Website Update Request
            </CardTitle>
            <CardDescription>
              Tell us about your current website and what improvements you'd like to make. 
              We'll review your site and provide a detailed quote within 24 hours.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your full name"
                      required
                      data-testid="input-name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                      required
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="07123456789"
                      data-testid="input-phone"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder="Your business name"
                      data-testid="input-business-name"
                    />
                  </div>
                </div>
              </div>

              {/* Current Website */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  Current Website
                </h3>
                
                <div>
                  <Label htmlFor="currentWebsite">Website URL *</Label>
                  <Input
                    id="currentWebsite"
                    value={formData.currentWebsite}
                    onChange={(e) => handleInputChange('currentWebsite', e.target.value)}
                    placeholder="https://yourwebsite.com"
                    required
                    data-testid="input-current-website"
                  />
                  <p className="text-sm text-slate-500 mt-1">
                    We'll review your current website to better understand your update needs
                  </p>
                </div>
              </div>

              {/* Update Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  Update Requirements
                </h3>
                
                <div>
                  <Label htmlFor="updateCategory">Update Category *</Label>
                  <Select value={formData.updateCategory} onValueChange={(value) => handleInputChange('updateCategory', value)}>
                    <SelectTrigger data-testid="select-update-category">
                      <SelectValue placeholder="Select the type of update needed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Update (£40-£75) - Content changes, small fixes</SelectItem>
                      <SelectItem value="medium">Medium Update (£100-£250) - New pages, design tweaks, plugins</SelectItem>
                      <SelectItem value="major">Major Revamp (£500+) - Complete redesign, major functionality</SelectItem>
                      <SelectItem value="unsure">Not Sure - Help me decide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Please describe what you want to change, add, or improve on your website..."
                    rows={4}
                    required
                    data-testid="textarea-description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timeline">Preferred Timeline</Label>
                    <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                      <SelectTrigger data-testid="select-timeline">
                        <SelectValue placeholder="When do you need this completed?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">As soon as possible</SelectItem>
                        <SelectItem value="1-2weeks">Within 1-2 weeks</SelectItem>
                        <SelectItem value="3-4weeks">Within 3-4 weeks</SelectItem>
                        <SelectItem value="1-2months">Within 1-2 months</SelectItem>
                        <SelectItem value="flexible">I'm flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                      <SelectTrigger data-testid="select-budget">
                        <SelectValue placeholder="What's your budget range?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-100">Under £100</SelectItem>
                        <SelectItem value="100-250">£100 - £250</SelectItem>
                        <SelectItem value="250-500">£250 - £500</SelectItem>
                        <SelectItem value="500-1000">£500 - £1,000</SelectItem>
                        <SelectItem value="over-1000">Over £1,000</SelectItem>
                        <SelectItem value="open">Open to suggestions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="bg-slate-50 p-6 rounded-lg border">
                <h3 className="font-semibold text-slate-900 mb-3">Our Update Pricing Structure</h3>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span>• Basic updates (content changes, small fixes):</span>
                    <span className="font-medium">£40–£75</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Medium updates (new pages, design tweaks, plugins):</span>
                    <span className="font-medium">£100–£250</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Major revamp (complete redesign, major functionality):</span>
                    <span className="font-medium">£500+</span>
                  </div>
                  <p className="text-slate-600 mt-3 text-xs">
                    Final quote will be based on your specific requirements and current website assessment.
                    Payment is collected after work completion.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={submitMutation.isPending}
                data-testid="button-submit-request"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Submit Update Request
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}