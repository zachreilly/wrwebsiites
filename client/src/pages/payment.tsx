import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import InteractiveCursor from "@/components/InteractiveCursor";

export default function PaymentPageSimple() {
  const [, setLocation] = useLocation();
  const [selectedPackage, setSelectedPackage] = useState('');

  return (
    <div className="min-h-screen relative">
      <InteractiveCursor />
      
      <div className="relative z-10 min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/')}
              className="mr-4 bg-white/80 hover:bg-white text-black border border-black/20"
              data-testid="button-back-home"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-black">Choose Your Service</h1>
              <p className="text-black/80">Select the service that best fits your needs</p>
            </div>
          </div>

          <div className="gradient-box p-8 rounded-xl shadow-2xl border-2 border-black">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-black mb-2">Select Your Package</h2>
              <p className="text-black/80">Choose from our three service options</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                  <SelectTrigger className="bg-white/80 border-black/30 text-black" data-testid="select-package">
                    <SelectValue placeholder="Choose your service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic Static Website - £75 setup + £10/month</SelectItem>
                    <SelectItem value="premium">Premium Hosting and Domain Website - £150 setup + £10/month</SelectItem>
                    <SelectItem value="update">Update Your Website - Quote on Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedPackage === 'basic' && (
                <div className="gradient-box p-6 rounded-lg border-2 border-black">
                  <h3 className="text-xl font-bold text-black mb-3">Basic Static Website</h3>
                  <div className="text-3xl font-bold text-black mb-4">
                    £75 <span className="text-sm font-normal">setup</span> + £10<span className="text-sm font-normal">/month</span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center text-black/90">
                      <span className="text-black mr-3">✓</span>
                      Up to 3 professional pages (Home, About, Contact)
                    </li>
                    <li className="flex items-center text-black/90">
                      <span className="text-black mr-3">✓</span>
                      Mobile-friendly responsive design
                    </li>
                    <li className="flex items-center text-black/90">
                      <span className="text-black mr-3">✓</span>
                      Contact form & business information
                    </li>
                    <li className="flex items-center text-black/90">
                      <span className="text-black mr-3">✓</span>
                      Fast secure hosting included
                    </li>
                    <li className="flex items-center text-black/90">
                      <span className="text-black mr-3">✓</span>
                      Basic SEO optimization
                    </li>
                    <li className="flex items-center text-black/90">
                      <span className="text-black mr-3">✓</span>
                      1 month dedicated support
                    </li>
                  </ul>
                </div>
              )}

              {selectedPackage === 'premium' && (
                <div className="gradient-box p-6 rounded-lg border-2 border-black">
                  <h3 className="text-xl font-bold text-black mb-3">Premium Business Website</h3>
                  <div className="text-3xl font-bold text-black mb-4">
                    £150 <span className="text-sm font-normal">setup</span> + £10<span className="text-sm font-normal">/month</span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center text-black/90">
                      <span className="text-black mr-3">✓</span>
                      Unlimited pages & custom design
                    </li>
                    <li className="flex items-center text-black/90">
                      <span className="text-black mr-3">✓</span>
                      Professional domain & email included
                    </li>
                    <li className="flex items-center text-black/90">
                      <span className="text-black mr-3">✓</span>
                      Advanced SEO & Google optimization
                    </li>
                    <li className="flex items-center text-black/90">
                      <span className="text-black mr-3">✓</span>
                      Analytics & performance tracking
                    </li>
                    <li className="flex items-center text-black/90">
                      <span className="text-black mr-3">✓</span>
                      Content management system
                    </li>
                    <li className="flex items-center text-black/90">
                      <span className="text-black mr-3">✓</span>
                      3 months priority support
                    </li>
                  </ul>
                  <div className="bg-black/10 p-4 rounded-lg border-2 border-accent/50">
                    <div className="text-center">
                      <p className="text-accent font-semibold text-sm mb-1">💰 INCREDIBLE VALUE</p>
                      <p className="text-black font-bold text-sm">
                        Over £570 worth of services included FREE!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedPackage === 'update' && (
                <div className="gradient-box p-6 rounded-lg border-2 border-black">
                  <h3 className="text-xl font-bold text-black mb-3">Update Your Website</h3>
                  <div className="text-3xl font-bold text-accent mb-4">
                    Quote on Request
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="gradient-box p-4 rounded-lg border-2 border-black">
                      <h4 className="font-bold text-black mb-2">Basic Updates</h4>
                      <div className="text-lg font-bold text-black mb-1">£40–£75</div>
                      <ul className="text-sm text-black/80 space-y-1">
                        <li>• Content changes</li>
                        <li>• Small fixes</li>
                      </ul>
                    </div>
                    <div className="gradient-box p-4 rounded-lg border-2 border-black">
                      <h4 className="font-bold text-black mb-2">Medium Updates</h4>
                      <div className="text-lg font-bold text-black mb-1">£100–£250</div>
                      <ul className="text-sm text-black/80 space-y-1">
                        <li>• New pages</li>
                        <li>• Design tweaks</li>
                      </ul>
                    </div>
                    <div className="gradient-box p-4 rounded-lg border-2 border-black">
                      <h4 className="font-bold text-black mb-2">Major Revamp</h4>
                      <div className="text-lg font-bold text-black mb-1">£500+</div>
                      <ul className="text-sm text-black/80 space-y-1">
                        <li>• Complete redesign</li>
                        <li>• Major functionality</li>
                      </ul>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center text-black/90">
                      <span className="text-black mr-3">✓</span>
                      Professional assessment of your requirements
                    </li>
                    <li className="flex items-center text-black/90">
                      <span className="text-black mr-3">✓</span>
                      Quote provided within 24 hours
                    </li>
                    <li className="flex items-center text-black/90">
                      <span className="text-black mr-3">✓</span>
                      Payment collected after work completion
                    </li>
                  </ul>
                </div>
              )}

              {selectedPackage && (
                <Button 
                  onClick={() => {
                    if (selectedPackage === 'update') {
                      window.location.href = '/website-update-request';
                    } else {
                      window.location.href = `/onboarding?package=${selectedPackage}`;
                    }
                  }} 
                  className="w-full bg-accent text-slate-900 hover:bg-amber-400 shadow-xl hover:scale-105 transition-all duration-200 text-lg py-6"
                  data-testid="button-continue"
                >
                  {selectedPackage === 'update' ? 'Request Quote' : 'Continue to Setup'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
