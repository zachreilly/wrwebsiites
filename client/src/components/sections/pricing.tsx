import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { getCurrentPricing, getDiscountEndDateFormatted, isDiscountActive } from "@shared/pricing";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

export default function Pricing() {
  const [, setLocation] = useLocation();
  const [basicPricing, setBasicPricing] = useState(getCurrentPricing('basic'));
  const [premiumPricing, setPremiumPricing] = useState(getCurrentPricing('premium'));
  const [discountActive, setDiscountActive] = useState(isDiscountActive());

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

  return (
    <section id="pricing" className="py-24 relative overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 box-border">
        <div className="text-center mb-16">
          {discountActive ? (
            <>
              <div className="inline-flex items-center bg-emerald-700 text-white px-4 sm:px-6 py-2 rounded-full text-sm font-medium mb-6">
                Launch pricing ends {getDiscountEndDateFormatted()}
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">Simple, Transparent Pricing</h2>
              <p className="text-base sm:text-lg text-black/70 max-w-2xl mx-auto">
                Get your professional website at half price during our launch period. No hidden fees.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">Simple, Transparent Pricing</h2>
              <p className="text-base sm:text-lg text-black/70 max-w-2xl mx-auto">
                Professional website development and hosting for your business. No hidden fees.
              </p>
            </>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-xl shadow-md border border-black/10 p-6 sm:p-8 h-full flex flex-col">
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Basic</h3>
              <p className="text-sm text-gray-500 mb-4">Perfect for small businesses getting started online</p>
              <div className="flex flex-wrap justify-center items-baseline gap-2">
                {basicPricing.isDiscounted && basicPricing.originalSetupPrice && (
                  <span className="text-xl text-gray-400 line-through">£{basicPricing.originalSetupPrice}</span>
                )}
                <span className="text-4xl font-bold text-gray-900">£{basicPricing.setupPrice}</span>
                <span className="text-sm text-gray-500">setup</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">+ £{basicPricing.monthlyPrice}/month for hosting & support</p>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              {[
                "Up to 3 pages (Home, About, Contact)",
                "Mobile-friendly responsive design",
                "Contact form & business info",
                "Fast, secure hosting included",
                "Basic SEO optimisation",
                "1 month dedicated support"
              ].map((feature, i) => (
                <li key={i} className="flex items-start text-gray-600 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-3">
              <Button
                onClick={() => setLocation('/onboarding?package=basic')}
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                size="lg"
                data-testid="button-basic-package"
              >
                Get Started
              </Button>
              <Button
                onClick={() => setLocation('/direct-payment?package=basic')}
                variant="outline"
                className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                size="lg"
                data-testid="button-basic-quick-pay"
              >
                Quick Pay
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border-2 border-emerald-500 relative p-6 sm:p-8 h-full flex flex-col">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-emerald-600 text-white px-4 py-1 rounded-full text-xs font-medium">Most Popular</div>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Premium</h3>
              <p className="text-sm text-gray-500 mb-4">Everything you need for a strong online presence</p>
              <div className="flex flex-wrap justify-center items-baseline gap-2">
                {premiumPricing.isDiscounted && premiumPricing.originalSetupPrice && (
                  <span className="text-xl text-gray-400 line-through">£{premiumPricing.originalSetupPrice}</span>
                )}
                <span className="text-4xl font-bold text-gray-900">£{premiumPricing.setupPrice}</span>
                <span className="text-sm text-gray-500">setup</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">+ £{premiumPricing.monthlyPrice}/month for hosting & support</p>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              {[
                "Unlimited pages & custom design",
                "Professional domain & email included",
                "Advanced SEO & Google optimisation",
                "Analytics & performance tracking",
                "Content management system",
                "3 months priority support"
              ].map((feature, i) => (
                <li key={i} className="flex items-start text-gray-600 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-3">
              <Button
                onClick={() => setLocation('/onboarding?package=premium')}
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                size="lg"
                data-testid="button-premium-package"
              >
                Get Started
              </Button>
              <Button
                onClick={() => setLocation('/direct-payment?package=premium')}
                variant="outline"
                className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                size="lg"
                data-testid="button-premium-quick-pay"
              >
                Quick Pay
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-xl shadow-md border border-black/10 p-6 sm:p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Website Updates</h3>
              <p className="text-sm text-gray-500 mb-4">Already have a website? We can enhance it for you.</p>
              <p className="text-sm text-gray-500">No upfront costs — pay only when you're satisfied</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {[
                { title: "Small Updates", price: "£40–£75", items: ["Content changes", "Small fixes", "Text updates", "Image replacements"] },
                { title: "Medium Updates", price: "£100–£250", items: ["New pages", "Design tweaks", "Plugin additions", "Feature enhancements"] },
                { title: "Major Revamp", price: "£500+", items: ["Complete redesign", "Major functionality", "New architecture", "Full rebuild"] }
              ].map((tier, i) => (
                <div key={i} className="text-center">
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 h-full">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{tier.title}</h4>
                    <div className="text-xl font-bold text-emerald-600 mb-3">{tier.price}</div>
                    <ul className="text-sm text-gray-500 space-y-1">
                      {tier.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Button
                onClick={() => setLocation('/website-update-request')}
                className="bg-emerald-600 text-white hover:bg-emerald-700 px-8 py-3 transition-colors"
                size="lg"
                data-testid="button-request-quote"
              >
                Request a Quote
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm text-black/60">Both packages include secure hosting and ongoing support. Premium includes domain registration.</p>
        </div>
      </div>
    </section>
  );
}
