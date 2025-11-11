import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { getCurrentPricing, getDiscountEndDateFormatted, isDiscountActive } from "@shared/pricing";
import { useEffect, useState } from "react";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { use3DTilt } from "@/hooks/use3DTilt";

export default function Pricing() {
  const [, setLocation] = useLocation();
  const [basicPricing, setBasicPricing] = useState(getCurrentPricing('basic'));
  const [premiumPricing, setPremiumPricing] = useState(getCurrentPricing('premium'));
  const [discountActive, setDiscountActive] = useState(isDiscountActive());
  
  const basicTilt = use3DTilt({ max: 8, scale: 1.02 });
  const premiumTilt = use3DTilt({ max: 8, scale: 1.02 });

  useEffect(() => {
    const interval = setInterval(() => {
      const newDiscountActive = isDiscountActive();
      if (newDiscountActive !== discountActive) {
        setDiscountActive(newDiscountActive);
        setBasicPricing(getCurrentPricing('basic'));
        setPremiumPricing(getCurrentPricing('premium'));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [discountActive]);
  
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="pricing" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <div className="text-center mb-16">
            {discountActive ? (
              <>
                <div className="inline-flex items-center gradient-box px-4 py-2 rounded-full text-sm font-medium mb-4 hover:scale-105 transition-transform duration-200 bg-[#ef4444] text-[#e6e8ed]">
                  🔥 Limited Time Discount - Ends {getDiscountEndDateFormatted()}
                </div>
                <h2 className="text-4xl font-bold text-black mb-4">Special Launch Pricing - Save 50%!</h2>
                <p className="text-xl text-black/90 max-w-3xl mx-auto">
                  Get your professional website at half price! This limited-time offer ends in one week - don't miss out on these incredible savings.
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gradient-box px-4 py-2 rounded-full text-sm font-medium mb-4 text-black hover:scale-105 transition-transform duration-200">
                  Professional Web Development
                </div>
                <h2 className="text-4xl font-bold text-black mb-4">Our Standard Pricing</h2>
                <p className="text-xl text-black/90 max-w-3xl mx-auto">
                  Professional website development and hosting services for your business.
                </p>
              </>
            )}
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <ScrollAnimation delay={0.1}>
            <div 
              ref={basicTilt.ref}
              style={basicTilt.style}
              onMouseMove={basicTilt.onMouseMove}
              onMouseLeave={basicTilt.onMouseLeave}
              className="gradient-box p-8 rounded-xl shadow-2xl gpu-accelerated h-full flex flex-col"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-black mb-2">Basic Static Website</h3>
                <p className="text-black/80 mb-6">Perfect for small businesses - a professional website with everything you need to establish your online presence. Monthly fee covers ongoing moderation and support for as long as you're subscribed.</p>
                <div className="text-4xl font-bold text-black mb-2">
                  {basicPricing.isDiscounted && basicPricing.originalSetupPrice && (
                    <span className="text-2xl text-red-400 line-through mr-3">£{basicPricing.originalSetupPrice}</span>
                  )}
                  £{basicPricing.setupPrice}
                  <span className="text-sm font-normal text-black/70 ml-2">setup</span>
                  {basicPricing.isDiscounted && (
                    <div className="inline-block ml-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">SAVE 50%</div>
                  )}
                </div>
                <div className="text-lg font-semibold text-black">
                  {basicPricing.isDiscounted && basicPricing.originalMonthlyPrice && basicPricing.originalMonthlyPrice !== basicPricing.monthlyPrice && (
                    <span className="text-red-400 line-through mr-2">£{basicPricing.originalMonthlyPrice}</span>
                  )}
                  + £{basicPricing.monthlyPrice} per month
                </div>
                <p className="text-xs text-black/60 mt-2">Monthly fee includes hosting, security, and ongoing support</p>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  "Up to 3 professional pages (Home, About, Contact)",
                  "Mobile-friendly responsive design",
                  "Contact form & business information",
                  "Fast secure hosting included",
                  "Basic SEO optimization",
                  "1 month dedicated support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center text-black/90">
                    <span className="text-black mr-3">✓</span>
                    <strong>{feature}</strong>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => setLocation('/payment?package=basic')}
                className="w-full bg-black/20 text-black hover:bg-black/30 border-2 border-black/30 hover:scale-105 transition-all duration-200"
                size="lg"
                data-testid="button-basic-package"
              >
                Get Started - Basic
              </Button>
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={0.2}>
            <div 
              ref={premiumTilt.ref}
              style={premiumTilt.style}
              onMouseMove={premiumTilt.onMouseMove}
              onMouseLeave={premiumTilt.onMouseLeave}
              className="gradient-box p-8 rounded-xl shadow-2xl border-2 border-accent relative gpu-accelerated h-full flex flex-col"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-accent text-slate-900 px-4 py-2 rounded-full text-sm font-medium">Most Popular</div>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-black mb-2">Premium Business Website</h3>
                <p className="text-black/80 mb-6">Everything you need for a professional online presence - custom design, your own domain, and advanced features that help you stand out from competitors</p>
                <div className="text-4xl font-bold text-black mb-2">
                  {premiumPricing.isDiscounted && premiumPricing.originalSetupPrice && (
                    <span className="text-2xl text-red-400 line-through mr-3">£{premiumPricing.originalSetupPrice}</span>
                  )}
                  £{premiumPricing.setupPrice}
                  <span className="text-sm font-normal text-black/70 ml-2">setup</span>
                  {premiumPricing.isDiscounted && (
                    <div className="inline-block ml-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">SAVE 50%</div>
                  )}
                </div>
                <div className="text-lg font-semibold text-black">
                  {premiumPricing.isDiscounted && premiumPricing.originalMonthlyPrice && premiumPricing.originalMonthlyPrice !== premiumPricing.monthlyPrice && (
                    <span className="text-red-400 line-through mr-2">£{premiumPricing.originalMonthlyPrice}</span>
                  )}
                  + £{premiumPricing.monthlyPrice} per month
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  "Unlimited pages & custom design",
                  "Professional domain & email included",
                  "Advanced SEO & Google optimization",
                  "Analytics & performance tracking",
                  "Content management system",
                  "3 months priority support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center text-black/90">
                    <span className="text-black mr-3">✓</span>
                    <strong>{feature}</strong>
                  </li>
                ))}
              </ul>
              
              <div className="bg-black/10 p-4 rounded-lg mb-6 border-2 border-accent/50">
                <div className="text-center">
                  <p className="text-accent font-semibold text-sm mb-1">💰 INCREDIBLE VALUE</p>
                  <p className="text-black font-bold text-sm">
                    Over £570 worth of services included FREE!
                  </p>
                </div>
              </div>
              
              <Button
                onClick={() => setLocation('/payment?package=premium')}
                className="w-full bg-accent text-slate-900 hover:bg-amber-400 shadow-xl hover:scale-105 transition-all duration-200"
                size="lg"
                data-testid="button-premium-package"
              >
                Get Started - Premium
              </Button>
            </div>
          </ScrollAnimation>
        </div>

        <ScrollAnimation delay={0.3}>
          <div className="max-w-4xl mx-auto">
            <div className="gradient-box p-8 rounded-xl shadow-2xl">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-black mb-2">Update Your Website</h3>
                <p className="text-lg text-black/90 mb-6 max-w-3xl mx-auto">Already have a website? Let us enhance it with new features, content updates, or a complete redesign to keep your business competitive.</p>
                <div className="text-4xl font-bold text-accent mb-2">
                  Quote
                  <span className="text-lg font-normal text-black/70 ml-2">on request</span>
                </div>
                <div className="text-xl font-semibold text-black">
                  Payment after completion
                </div>
                <p className="text-sm text-black/60 mt-2">No upfront costs - pay only when satisfied</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  { title: "Basic Updates", price: "£40–£75", items: ["Content changes", "Small fixes", "Text updates", "Image replacements"] },
                  { title: "Medium Updates", price: "£100–£250", items: ["New pages", "Design tweaks", "Plugin additions", "Feature enhancements"] },
                  { title: "Major Revamp", price: "£500+", items: ["Complete redesign", "Major functionality", "New architecture", "Full rebuild"] }
                ].map((tier, i) => (
                  <div key={i} className="text-center">
                    <div className="bg-black/10 p-6 rounded-lg shadow-sm border-2 border-black/20 h-full">
                      <h4 className="text-xl font-bold text-accent mb-3">{tier.title}</h4>
                      <div className="text-2xl font-bold text-black mb-2">{tier.price}</div>
                      <ul className="text-sm text-black/80 space-y-1">
                        {tier.items.map((item, j) => (
                          <li key={j}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <div className="bg-black/10 p-4 rounded-lg border-2 border-black/30 mb-6 inline-block">
                  <p className="text-black font-semibold">✓ Professional assessment • ✓ Quote within 24 hours • ✓ Payment after completion</p>
                </div>
                <Button
                  onClick={() => setLocation('/website-update-request')}
                  className="bg-accent text-slate-900 hover:bg-amber-400 px-8 py-3 text-lg shadow-xl hover:scale-105 transition-all duration-200"
                  size="lg"
                  data-testid="button-request-quote"
                >
                  Request Quote
                </Button>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.4}>
          <div className="mt-12 text-center">
            <p className="text-black/90 mb-4">Premium package includes domain registration. Both packages include secure hosting and ongoing support</p>
            <div className="gradient-box p-6 rounded-xl max-w-2xl mx-auto shadow-2xl">
              <h4 className="font-semibold mb-2 text-black">Why Choose Us?</h4>
              <ul className="text-sm space-y-1 text-black/90">
                <li>• Affordable launch pricing — pay less now for the same professional quality</li>
                <li>• Perfect for businesses who want a simple, stress-free way to get online</li>
                <li>• Fast turnaround — your site can be live in days, not weeks</li>
                <li>• Friendly, local support whenever you need it</li>
              </ul>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
