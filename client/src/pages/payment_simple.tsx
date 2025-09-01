import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function PaymentPageSimple() {
  const [, setLocation] = useLocation();
  const [selectedPackage, setSelectedPackage] = useState('');

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
            <h1 className="text-3xl font-bold text-slate-900">Choose Your Service</h1>
            <p className="text-slate-600">Select the service that best fits your needs</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Your Package</CardTitle>
            <CardDescription>Choose from our three service options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Static Website - £50 setup + £10/month</SelectItem>
                  <SelectItem value="premium">Premium Hosting and Domain Website - £150 setup + £10/month</SelectItem>
                  <SelectItem value="update">Update Your Website - Quote on Request</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedPackage === 'update' && (
              <div className="bg-slate-50 p-6 rounded-lg border">
                <h3 className="font-semibold text-slate-900 mb-3">Update Your Website</h3>
                <div className="text-2xl font-bold text-emerald-600 mb-4">
                  Quote on Request
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center text-slate-700">
                    ✓ Basic updates: £40–£75 (content changes, small fixes)
                  </li>
                  <li className="flex items-center text-slate-700">
                    ✓ Medium updates: £100–£250 (new page, design tweaks, plugins)
                  </li>
                  <li className="flex items-center text-slate-700">
                    ✓ Larger revamp: £500+ (complete redesign, major functionality)
                  </li>
                  <li className="flex items-center text-slate-700">
                    ✓ Professional assessment of your requirements
                  </li>
                  <li className="flex items-center text-slate-700">
                    ✓ Quote provided within 24 hours
                  </li>
                  <li className="flex items-center text-slate-700">
                    ✓ Payment collected after work completion
                  </li>
                </ul>
              </div>
            )}

            {selectedPackage && (
              <Button 
                onClick={() => {
                  if (selectedPackage === 'update') {
                    // For website updates, redirect to a contact form or new update-specific page
                    window.location.href = '/website-update-request';
                  } else {
                    // For new websites, continue with the normal payment flow
                    window.location.href = `/payment?package=${selectedPackage}`;
                  }
                }} 
                className="w-full"
              >
                {selectedPackage === 'update' ? 'Request Quote' : 'Continue to Setup'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}