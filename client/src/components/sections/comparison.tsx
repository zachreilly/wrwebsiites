import { Check, X, FileText, Smartphone, Shield, Globe, Search, Star, Mail, MessageSquare, Share2, RotateCcw, Clock, Settings, Database, Lock, CreditCard, Cog, LayoutDashboard, Rocket } from "lucide-react";

export default function Comparison() {
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
      <div className="grid grid-cols-3 gap-4 items-center">
        <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
          isAdvanced 
            ? 'bg-emerald-50 border-emerald-200' 
            : 'bg-white border-gray-200'
        }`}>
          <Icon className={`w-5 h-5 ${isAdvanced ? 'text-emerald-600' : 'text-gray-600'}`} />
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{feature.name}</div>
            {feature.description && (
              <div className="text-xs text-gray-500">{feature.description}</div>
            )}
          </div>
        </div>

        <div className={`flex items-center justify-center p-3 rounded-lg bg-white border border-gray-200 ${
          isAdvanced ? 'opacity-50' : ''
        }`}>
          {typeof feature.basic === "boolean" ? (
            feature.basic ? (
              <Check className="w-5 h-5 text-emerald-500" data-testid={`check-basic-${index}`} />
            ) : (
              <X className="w-5 h-5 text-gray-300" data-testid={`x-basic-${index}`} />
            )
          ) : (
            <span className="text-sm text-gray-700 font-medium" data-testid={`text-basic-${index}`}>
              {feature.basic}
            </span>
          )}
        </div>

        <div className={`flex items-center justify-center p-3 rounded-lg border ${
          isAdvanced
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-white border-gray-200'
        }`}>
          {typeof feature.premium === "boolean" ? (
            feature.premium ? (
              <Check className={`w-5 h-5 ${isAdvanced ? 'text-emerald-600' : 'text-emerald-500'}`} data-testid={`check-premium-${index}`} />
            ) : (
              <X className="w-5 h-5 text-gray-300" data-testid={`x-premium-${index}`} />
            )
          ) : (
            <span className="text-sm text-gray-700 font-medium" data-testid={`text-premium-${index}`}>
              {feature.premium}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-black">
            Compare Packages
          </h2>
          <p className="text-base sm:text-lg text-black/60 max-w-2xl mx-auto">
            Choose the right package for your business
          </p>
        </div>

        <div className="hidden md:block max-w-5xl mx-auto">
          <div className="sticky top-20 z-10 backdrop-blur-sm pb-6 mb-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-900 font-semibold text-sm flex items-center">Features</div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                <h3 className="text-lg font-semibold mb-1 text-gray-900">Basic</h3>
                <div className="text-2xl font-bold text-gray-900">£75</div>
                <div className="text-xs text-gray-500">+ £10/month</div>
              </div>

              <div className="bg-white rounded-xl shadow-md border-2 border-emerald-500 p-4 text-center relative">
                <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2">
                  <span className="bg-emerald-600 text-white text-xs font-medium px-3 py-0.5 rounded-full">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-1 text-gray-900">Premium</h3>
                <div className="text-2xl font-bold text-gray-900">£150</div>
                <div className="text-xs text-gray-500">+ £10/month</div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-600" />
                Core Features
              </h3>
              <div className="space-y-2">
                {features.core.map((feature, index) => (
                  <FeatureRow key={index} feature={feature} index={index} category="core" />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-gray-600" />
                Growth Features
              </h3>
              <div className="space-y-2">
                {features.growth.map((feature, index) => (
                  <FeatureRow key={index} feature={feature} index={index} category="growth" />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-emerald-600" />
                Advanced Features
                <span className="text-sm font-normal text-gray-500">(Premium Only)</span>
              </h3>
              <div className="space-y-2">
                {features.advanced.map((feature, index) => (
                  <FeatureRow key={index} feature={feature} index={index} category="advanced" />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-12">
            <a
              href="/payment?package=basic"
              className="px-8 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-center"
              data-testid="button-select-basic"
            >
              Choose Basic
            </a>
            <a
              href="/payment?package=premium"
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-center"
              data-testid="button-select-premium"
            >
              Choose Premium
            </a>
          </div>
        </div>

        <div className="md:hidden max-w-md mx-auto space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 text-gray-900 p-5 text-center border-b border-gray-200">
              <h3 className="text-xl font-semibold mb-1">Basic</h3>
              <div className="text-2xl font-bold mb-0.5">£75</div>
              <div className="text-sm text-gray-500">+ £10/month</div>
            </div>
            <div className="p-4 space-y-2">
              <div className="font-medium text-gray-900 text-sm mb-3">Core Features</div>
              {features.core.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-2 flex-1">
                      <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature.name}</span>
                    </div>
                    <div className="ml-2">
                      {typeof feature.basic === "boolean" ? (
                        feature.basic ? <Check className="w-5 h-5 text-emerald-500" /> : <X className="w-5 h-5 text-gray-300" />
                      ) : (
                        <span className="text-xs text-gray-600 font-medium">{feature.basic}</span>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="font-medium text-gray-900 text-sm mt-4 mb-3">Growth Features</div>
              {features.growth.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-2 flex-1">
                      <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature.name}</span>
                    </div>
                    <div className="ml-2">
                      {typeof feature.basic === "boolean" ? (
                        feature.basic ? <Check className="w-5 h-5 text-emerald-500" /> : <X className="w-5 h-5 text-gray-300" />
                      ) : (
                        <span className="text-xs text-gray-600 font-medium">{feature.basic}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 pt-2">
              <a
                href="/payment?package=basic"
                className="block w-full px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-center"
                data-testid="button-select-basic-mobile"
              >
                Choose Basic
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border-2 border-emerald-500 overflow-hidden relative">
            <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 z-10">
              <span className="bg-emerald-600 text-white text-xs font-medium px-3 py-0.5 rounded-full">
                Most Popular
              </span>
            </div>
            
            <div className="bg-emerald-50 text-gray-900 p-5 text-center border-b border-emerald-200 mt-1">
              <h3 className="text-xl font-semibold mb-1">Premium</h3>
              <div className="text-2xl font-bold mb-0.5">£150</div>
              <div className="text-sm text-gray-500">+ £10/month</div>
            </div>
            <div className="p-4 space-y-2">
              <div className="font-medium text-gray-900 text-sm mb-3">Core Features</div>
              {features.core.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-2 flex-1">
                      <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature.name}</span>
                    </div>
                    <div className="ml-2">
                      {typeof feature.premium === "boolean" ? (
                        feature.premium ? <Check className="w-5 h-5 text-emerald-500" /> : <X className="w-5 h-5 text-gray-300" />
                      ) : (
                        <span className="text-xs text-gray-600 font-medium">{feature.premium}</span>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="font-medium text-gray-900 text-sm mt-4 mb-3">Growth Features</div>
              {features.growth.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center gap-2 flex-1">
                      <Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature.name}</span>
                    </div>
                    <div className="ml-2">
                      {typeof feature.premium === "boolean" ? (
                        feature.premium ? <Check className="w-5 h-5 text-emerald-500" /> : <X className="w-5 h-5 text-gray-300" />
                      ) : (
                        <span className="text-xs text-gray-600 font-medium">{feature.premium}</span>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="font-medium text-gray-900 text-sm mt-4 mb-3 flex items-center gap-2">
                <Rocket className="w-4 h-4 text-emerald-600" />
                Advanced Features
              </div>
              {features.advanced.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="bg-emerald-50 rounded-lg p-2 mb-2 border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <Icon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <div>
                          <span className="text-sm text-gray-900 block">{feature.name}</span>
                          {feature.description && (
                            <span className="text-xs text-gray-500">{feature.description}</span>
                          )}
                        </div>
                      </div>
                      <Check className="w-5 h-5 text-emerald-500 ml-2" />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 pt-2">
              <a
                href="/payment?package=premium"
                className="block w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-center"
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
