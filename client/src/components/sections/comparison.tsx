import { Check, X, FileText, Smartphone, Shield, Globe, Search, Star, Mail, MessageSquare, Share2, RotateCcw, Clock, Settings, Database, Lock, CreditCard, Cog, LayoutDashboard, Rocket } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Parallax } from "@/components/Parallax";

export default function Comparison() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const features = {
    core: [
      { name: "Number of Pages", basic: "Up to 5 pages", premium: "Up to 10 pages", icon: FileText },
      { name: "Mobile Responsive Design", basic: true, premium: true, icon: Smartphone },
      { name: "SSL Security Certificate", basic: true, premium: true, icon: Shield },
      { name: "Domain & Hosting", basic: true, premium: true, icon: Globe },
      { name: "Basic SEO Setup", basic: true, premium: true, icon: Search },
      { name: "Revision Rounds", basic: "1 round", premium: "3 rounds", icon: RotateCcw },
      { name: "Email Support", basic: true, premium: true, icon: Mail },
      { name: "Content Management", basic: "Via email", premium: "Via email", icon: Settings },
      { name: "Delivery Time", basic: "~3 days", premium: "~3 days", icon: Clock },
      { name: "Monthly Maintenance", basic: true, premium: true, icon: Settings },
    ],
    growth: [
      { name: "Advanced SEO Optimization", basic: false, premium: true, icon: Star },
      { name: "Google Business Setup", basic: false, premium: true, icon: Globe },
      { name: "Custom Contact Forms", basic: false, premium: true, icon: MessageSquare },
      { name: "Social Media Integration", basic: "Basic", premium: "Advanced", icon: Share2 },
      { name: "Priority Support", basic: false, premium: true, icon: Star },
    ],
    advanced: [
      { name: "User Authentication", basic: false, premium: true, icon: Lock, description: "Secure login system" },
      { name: "Database Storage", basic: false, premium: true, icon: Database, description: "Persistent data storage" },
      { name: "Payment Processing", basic: false, premium: true, icon: CreditCard, description: "Accept payments online" },
      { name: "CRUD Operations", basic: false, premium: true, icon: Cog, description: "Full data management" },
      { name: "Admin Dashboard", basic: false, premium: true, icon: LayoutDashboard, description: "Control panel" },
      { name: "Production Architecture", basic: false, premium: true, icon: Rocket, description: "Scalable codebase" },
    ]
  };

  const FeatureRow = ({ feature, index, category }: any) => {
    const Icon = feature.icon;
    const isAdvanced = category === 'advanced';
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay: index * 0.05 }}
        className="grid grid-cols-3 gap-4 items-center"
      >
        {/* Feature Name */}
        <Parallax speed={-2}>
          <div className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
            isAdvanced 
              ? 'gradient-box border-black shadow-lg' 
              : 'bg-white/80 border-black/30'
          }`}>
            <Icon className={`w-5 h-5 ${isAdvanced ? 'text-accent' : 'text-black'}`} />
            <div className="flex-1">
              <div className="text-sm font-medium text-black">{feature.name}</div>
              {feature.description && (
                <div className="text-xs text-black/70">{feature.description}</div>
              )}
            </div>
          </div>
        </Parallax>

        {/* Basic Value */}
        <Parallax speed={-1}>
          <div className={`flex items-center justify-center p-3 rounded-lg bg-white/80 border-2 border-black/30 ${
            isAdvanced ? 'opacity-50' : ''
          }`}>
            {typeof feature.basic === "boolean" ? (
              feature.basic ? (
                <Check className="w-6 h-6 text-black" data-testid={`check-basic-${index}`} />
              ) : (
                <X className="w-6 h-6 text-black/30" data-testid={`x-basic-${index}`} />
              )
            ) : (
              <span className="text-sm text-black font-medium" data-testid={`text-basic-${index}`}>
                {feature.basic}
              </span>
            )}
          </div>
        </Parallax>

        {/* Premium Value */}
        <Parallax speed={0}>
          <div className={`flex items-center justify-center p-3 rounded-lg border-2 ${
            isAdvanced
              ? 'gradient-box border-black shadow-lg'
              : 'bg-white/85 border-black/40'
          }`}>
            {typeof feature.premium === "boolean" ? (
              feature.premium ? (
                <Check className={`w-6 h-6 ${isAdvanced ? 'text-accent' : 'text-black'}`} data-testid={`check-premium-${index}`} />
              ) : (
                <X className="w-6 h-6 text-black/30" data-testid={`x-premium-${index}`} />
              )
            ) : (
              <span className="text-sm text-black font-medium" data-testid={`text-premium-${index}`}>
                {feature.premium}
              </span>
            )}
          </div>
        </Parallax>
      </motion.div>
    );
  };

  return (
    <section ref={sectionRef} className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-black">
            Compare Our Packages
          </h2>
          <p className="text-lg text-black/80 max-w-2xl mx-auto">
            Choose the perfect package for your business needs
          </p>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block max-w-6xl mx-auto">
          {/* Sticky Package Headers */}
          <div className="sticky top-20 z-10 bg-gradient-to-b from-emerald-500/30 to-transparent backdrop-blur-sm pb-6 mb-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-black font-bold text-lg flex items-center">Features</div>
              
              {/* Basic Header */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-black p-4 text-center">
                <h3 className="text-xl font-bold mb-1 text-black">Basic</h3>
                <div className="text-2xl font-bold text-black">£75</div>
                <div className="text-xs text-black/70">+ £10/month</div>
              </div>

              {/* Premium Header */}
              <div className="relative gradient-box rounded-2xl shadow-2xl border-4 border-black p-4 text-center">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-1 text-black">Premium</h3>
                <div className="text-2xl font-bold text-black">£150</div>
                <div className="text-xs text-black/70">+ £10/month</div>
              </div>
            </div>
          </div>

          {/* Feature Categories */}
          <div className="space-y-12">
            {/* Core Features */}
            <div>
              <Parallax speed={-3}>
                <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  Core Features
                </h3>
              </Parallax>
              <div className="space-y-3">
                {features.core.map((feature, index) => (
                  <FeatureRow key={index} feature={feature} index={index} category="core" />
                ))}
              </div>
            </div>

            {/* Growth Features */}
            <div>
              <Parallax speed={-3}>
                <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6" />
                  Growth Features
                </h3>
              </Parallax>
              <div className="space-y-3">
                {features.growth.map((feature, index) => (
                  <FeatureRow key={index} feature={feature} index={index} category="growth" />
                ))}
              </div>
            </div>

            {/* Advanced Features */}
            <div>
              <Parallax speed={-3}>
                <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                  <Rocket className="w-6 h-6 text-accent" />
                  Advanced Features
                  <span className="text-sm font-normal text-black/70">(Premium Only)</span>
                </h3>
              </Parallax>
              <div className="space-y-3">
                {features.advanced.map((feature, index) => (
                  <FeatureRow key={index} feature={feature} index={index} category="advanced" />
                ))}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <Parallax speed={2}>
            <div className="flex justify-center gap-6 mt-12">
              <a
                href="/payment?package=basic"
                className="px-8 py-3 bg-white/90 backdrop-blur-sm text-black border-2 border-black rounded-lg hover:bg-white transition-all font-semibold text-center shadow-lg hover:shadow-xl hover:scale-105 duration-200"
                data-testid="button-select-basic"
              >
                Choose Basic
              </a>
              <a
                href="/payment?package=premium"
                className="px-8 py-3 bg-black text-white border-2 border-black rounded-lg hover:bg-black/90 transition-all font-semibold text-center shadow-xl hover:shadow-2xl hover:scale-105 duration-200"
                data-testid="button-select-premium"
              >
                Choose Premium
              </a>
            </div>
          </Parallax>
        </div>

        {/* Mobile View - Stacked Cards */}
        <div className="md:hidden max-w-md mx-auto space-y-6">
          {/* Basic Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-black overflow-hidden">
            <div className="bg-white/95 backdrop-blur-sm text-black p-6 text-center border-b-2 border-black">
              <h3 className="text-2xl font-bold mb-2">Basic</h3>
              <div className="text-3xl font-bold mb-1">£75</div>
              <div className="text-sm opacity-70">+ £10/month</div>
            </div>
            <div className="p-4 space-y-2">
              <div className="font-bold text-black text-sm mb-3">Core Features</div>
              {features.core.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-black/10">
                    <div className="flex items-center gap-2 flex-1">
                      <Icon className="w-4 h-4 text-black flex-shrink-0" />
                      <span className="text-sm text-black">{feature.name}</span>
                    </div>
                    <div className="ml-2">
                      {typeof feature.basic === "boolean" ? (
                        feature.basic ? <Check className="w-5 h-5 text-black" /> : <X className="w-5 h-5 text-black/30" />
                      ) : (
                        <span className="text-xs text-black font-medium">{feature.basic}</span>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="font-bold text-black text-sm mt-4 mb-3">Growth Features</div>
              {features.growth.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-black/10">
                    <div className="flex items-center gap-2 flex-1">
                      <Icon className="w-4 h-4 text-black flex-shrink-0" />
                      <span className="text-sm text-black">{feature.name}</span>
                    </div>
                    <div className="ml-2">
                      {typeof feature.basic === "boolean" ? (
                        feature.basic ? <Check className="w-5 h-5 text-black" /> : <X className="w-5 h-5 text-black/30" />
                      ) : (
                        <span className="text-xs text-black font-medium">{feature.basic}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 pt-0">
              <a
                href="/payment?package=basic"
                className="block w-full px-6 py-3 bg-white text-black border-2 border-black rounded-lg hover:bg-white/90 transition-all font-semibold text-center shadow-lg"
                data-testid="button-select-basic-mobile"
              >
                Choose Basic
              </a>
            </div>
          </div>

          {/* Premium Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-4 border-black overflow-hidden relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
              <span className="bg-red-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                MOST POPULAR
              </span>
            </div>
            
            <div className="bg-white/98 backdrop-blur-sm text-black p-6 text-center mt-2 border-b-2 border-black">
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="text-3xl font-bold mb-1">£150</div>
              <div className="text-sm opacity-70">+ £10/month</div>
            </div>
            <div className="p-4 space-y-2">
              <div className="font-bold text-black text-sm mb-3">Core Features</div>
              {features.core.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-black/10">
                    <div className="flex items-center gap-2 flex-1">
                      <Icon className="w-4 h-4 text-black flex-shrink-0" />
                      <span className="text-sm text-black">{feature.name}</span>
                    </div>
                    <div className="ml-2">
                      {typeof feature.premium === "boolean" ? (
                        feature.premium ? <Check className="w-5 h-5 text-black" /> : <X className="w-5 h-5 text-black/30" />
                      ) : (
                        <span className="text-xs text-black font-medium">{feature.premium}</span>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="font-bold text-black text-sm mt-4 mb-3">Growth Features</div>
              {features.growth.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-black/10">
                    <div className="flex items-center gap-2 flex-1">
                      <Icon className="w-4 h-4 text-black flex-shrink-0" />
                      <span className="text-sm text-black">{feature.name}</span>
                    </div>
                    <div className="ml-2">
                      {typeof feature.premium === "boolean" ? (
                        feature.premium ? <Check className="w-5 h-5 text-black" /> : <X className="w-5 h-5 text-black/30" />
                      ) : (
                        <span className="text-xs text-black font-medium">{feature.premium}</span>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="font-bold text-black text-sm mt-4 mb-3 flex items-center gap-2">
                <Rocket className="w-4 h-4 text-accent" />
                Advanced Features
              </div>
              {features.advanced.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="gradient-box rounded-lg p-2 mb-2 border border-black/80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <Icon className="w-4 h-4 text-accent flex-shrink-0" />
                        <div>
                          <span className="text-sm text-black block">{feature.name}</span>
                          {feature.description && (
                            <span className="text-xs text-black/70">{feature.description}</span>
                          )}
                        </div>
                      </div>
                      <Check className="w-5 h-5 text-accent ml-2" />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 pt-0">
              <a
                href="/payment?package=premium"
                className="block w-full px-6 py-3 bg-black text-white border-2 border-black rounded-lg hover:bg-black/90 transition-all font-semibold text-center shadow-xl"
                data-testid="button-select-premium-mobile"
              >
                Choose Premium
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
