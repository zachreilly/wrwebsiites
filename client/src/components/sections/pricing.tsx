import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { getCurrentPricing, getDiscountEndDateFormatted, isDiscountActive } from "@shared/pricing";
import { useEffect, useState } from "react";

export default function Pricing() {
  const [, setLocation] = useLocation();
  const [basicPricing, setBasicPricing] = useState(getCurrentPricing('basic'));
  const [premiumPricing, setPremiumPricing] = useState(getCurrentPricing('premium'));
  const [discountActive, setDiscountActive] = useState(isDiscountActive());

  useEffect(() => {
    // Update pricing every minute to check for discount expiry
    const interval = setInterval(() => {
      const newDiscountActive = isDiscountActive();
      if (newDiscountActive !== discountActive) {
        setDiscountActive(newDiscountActive);
        setBasicPricing(getCurrentPricing('basic'));
        setPremiumPricing(getCurrentPricing('premium'));
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [discountActive]);
  
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="pricing" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {discountActive ? (
            <>
              <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                🔥 Limited Time Discount - Ends {getDiscountEndDateFormatted()}
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Special Launch Pricing - Save 50%!</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Get your professional website at half price! This limited-time offer ends in one week - don't miss out on these incredible savings.
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
                Professional Web Development
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Standard Pricing</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Professional website development and hosting services for your business.
              </p>
            </>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Basic Package */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Basic Static Website</h3>
              <p className="text-slate-600 mb-6">Perfect for small businesses - a professional website with everything you need to establish your online presence. Monthly fee covers ongoing moderation and support for as long as you're subscribed.</p>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                {basicPricing.isDiscounted && basicPricing.originalSetupPrice && (
                  <span className="text-2xl text-red-500 line-through mr-3">£{basicPricing.originalSetupPrice}</span>
                )}
                £{basicPricing.setupPrice}
                <span className="text-sm font-normal text-slate-600 ml-2">setup</span>
                {basicPricing.isDiscounted && (
                  <div className="inline-block ml-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">SAVE 50%</div>
                )}
              </div>
              <div className="text-lg font-semibold text-slate-900">
                {basicPricing.isDiscounted && basicPricing.originalMonthlyPrice && basicPricing.originalMonthlyPrice !== basicPricing.monthlyPrice && (
                  <span className="text-red-500 line-through mr-2">£{basicPricing.originalMonthlyPrice}</span>
                )}
                + £{basicPricing.monthlyPrice} per month
              </div>
              <p className="text-xs text-slate-500 mt-2">Monthly fee includes hosting, security, and ongoing support</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-slate-700">
                <span className="text-emerald-500 mr-3">✓</span>
                <strong>Up to 3 professional pages</strong> (Home, About, Contact)
              </li>
              <li className="flex items-center text-slate-700">
                <span className="text-emerald-500 mr-3">✓</span>
                <strong>Mobile-friendly responsive design</strong>
              </li>
              <li className="flex items-center text-slate-700">
                <span className="text-emerald-500 mr-3">✓</span>
                <strong>Contact form & business information</strong>
              </li>
              <li className="flex items-center text-slate-700">
                <span className="text-emerald-500 mr-3">✓</span>
                <strong>Fast secure hosting included</strong>
              </li>
              <li className="flex items-center text-slate-700">
                <span className="text-emerald-500 mr-3">✓</span>
                <strong>Basic SEO optimization</strong>
              </li>
              <li className="flex items-center text-slate-700">
                <span className="text-emerald-500 mr-3">✓</span>
                <strong>1 month dedicated support</strong>
              </li>
            </ul>
            <Button 
              onClick={() => setLocation('/payment?package=basic')}
              className="w-full bg-slate-900 text-white hover:bg-slate-800"
              size="lg"
            >
              Get Started - Basic
            </Button>
          </div>

          {/* Premium Package - Featured */}
          <div className="bg-white p-8 rounded-xl shadow-xl border-2 border-primary relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">Most Popular</div>
            </div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Premium Business Website</h3>
              <p className="text-slate-600 mb-6">Everything you need for a professional online presence - custom design, your own domain, and advanced features that help you stand out from competitors</p>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                {premiumPricing.isDiscounted && premiumPricing.originalSetupPrice && (
                  <span className="text-2xl text-red-500 line-through mr-3">£{premiumPricing.originalSetupPrice}</span>
                )}
                £{premiumPricing.setupPrice}
                <span className="text-sm font-normal text-slate-600 ml-2">setup</span>
                {premiumPricing.isDiscounted && (
                  <div className="inline-block ml-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">SAVE 50%</div>
                )}
              </div>
              <div className="text-lg font-semibold text-slate-900">
                {premiumPricing.isDiscounted && premiumPricing.originalMonthlyPrice && premiumPricing.originalMonthlyPrice !== premiumPricing.monthlyPrice && (
                  <span className="text-red-500 line-through mr-2">£{premiumPricing.originalMonthlyPrice}</span>
                )}
                + £{premiumPricing.monthlyPrice} per month
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-slate-700">
                <span className="text-emerald-500 mr-3">✓</span>
                <strong>Unlimited pages & custom design</strong>
              </li>
              <li className="flex items-center text-slate-700">
                <span className="text-emerald-500 mr-3">✓</span>
                <strong>Professional domain & email included</strong>
              </li>
              <li className="flex items-center text-slate-700">
                <span className="text-emerald-500 mr-3">✓</span>
                <strong>Advanced SEO & Google optimization</strong>
              </li>
              <li className="flex items-center text-slate-700">
                <span className="text-emerald-500 mr-3">✓</span>
                <strong>Analytics & performance tracking</strong>
              </li>
              <li className="flex items-center text-slate-700">
                <span className="text-emerald-500 mr-3">✓</span>
                <strong>Content management system</strong>
              </li>
              <li className="flex items-center text-slate-700">
                <span className="text-emerald-500 mr-3">✓</span>
                <strong>3 months priority support</strong>
              </li>
            </ul>
            
            {/* Value Highlight */}
            <div className="bg-emerald-50 p-4 rounded-lg mb-6 border border-emerald-200">
              <div className="text-center">
                <p className="text-emerald-800 font-semibold text-sm mb-1">💰 INCREDIBLE VALUE</p>
                <p className="text-emerald-700 text-sm font-bold">
                  Over £570 worth of services included FREE!
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => setLocation('/payment?package=premium')}
              className="w-full bg-primary text-white hover:bg-secondary"
              size="lg"
            >
              Get Started - Premium
            </Button>
          </div>

          {/* Website Updates Package */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Update Your Website</h3>
              <p className="text-slate-600 mb-6">Already have a website? Let us enhance it with new features, content updates, or a complete redesign to keep your business competitive.</p>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                Quote
                <span className="text-sm font-normal text-slate-600 ml-2">on request</span>
              </div>
              <div className="text-lg font-semibold text-slate-900">
                Payment after completion
              </div>
              <p className="text-xs text-slate-500 mt-2">No upfront costs - pay only when satisfied</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-slate-700">
                <span className="text-emerald-500 mr-3">✓</span>
                <strong>Basic updates: £40–£75</strong> (content changes, small fixes)
              </li>
              <li className="flex items-center text-slate-700">
                <span className="text-emerald-500 mr-3">✓</span>
                <strong>Medium updates: £100–£250</strong> (new pages, design tweaks, plugins)
              </li>
              <li className="flex items-center text-slate-700">
                <span className="text-emerald-500 mr-3">✓</span>
                <strong>Larger revamp: £500+</strong> (complete redesign, major functionality)
              </li>
              <li className="flex items-center text-slate-700">
                <span className="text-emerald-500 mr-3">✓</span>
                <strong>Professional assessment of your current site</strong>
              </li>
              <li className="flex items-center text-slate-700">
                <span className="text-emerald-500 mr-3">✓</span>
                <strong>Quote provided within 24 hours</strong>
              </li>
              <li className="flex items-center text-slate-700">
                <span className="text-emerald-500 mr-3">✓</span>
                <strong>Payment collected after work completion</strong>
              </li>
            </ul>
            <Button 
              onClick={() => setLocation('/website-update-request')}
              className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
              size="lg"
            >
              Request Quote
            </Button>
          </div>
        </div>

        {/* Additional pricing info */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">Premium package includes domain registration. Both packages include secure hosting and ongoing support</p>
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-xl max-w-2xl mx-auto">
            <h4 className="font-semibold mb-2">Why Choose Us?</h4>
            <ul className="text-sm space-y-1 text-green-100">
              <li>• Affordable launch pricing — pay less now for the same professional quality</li>
              <li>• Perfect for local businesses who want a simple, stress-free way to get online</li>
              <li>• Fast turnaround — your site can be live in days, not weeks</li>
              <li>• Friendly, local support whenever you need it</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
