import { Check, X, FileText, Smartphone, Shield, Globe, Search, Star, Mail, MessageSquare, Share2, RotateCcw, Clock, Settings, Users, Database, Lock, CreditCard, Cog, LayoutDashboard, Rocket } from "lucide-react";

export default function Comparison() {
  const features = [
    { name: "Number of Pages", basic: "Up to 5 pages", premium: "Up to 10 pages", icon: FileText, category: "core" },
    { name: "Mobile Responsive Design", basic: true, premium: true, icon: Smartphone, category: "core" },
    { name: "SSL Security Certificate", basic: true, premium: true, icon: Shield, category: "core" },
    { name: "Domain & Hosting", basic: true, premium: true, icon: Globe, category: "core" },
    { name: "Basic SEO Setup", basic: true, premium: true, icon: Search, category: "core" },
    { name: "Advanced SEO Optimization", basic: false, premium: true, icon: Star, category: "growth" },
    { name: "Google Business Setup", basic: false, premium: true, icon: Globe, category: "growth" },
    { name: "Custom Contact Forms", basic: false, premium: true, icon: MessageSquare, category: "growth" },
    { name: "Social Media Integration", basic: "Basic", premium: "Advanced", icon: Share2, category: "growth" },
    { name: "Revision Rounds", basic: "1 round", premium: "3 rounds", icon: RotateCcw, category: "core" },
    { name: "Email Support", basic: true, premium: true, icon: Mail, category: "core" },
    { name: "Priority Support", basic: false, premium: true, icon: Star, category: "growth" },
    { name: "Content Management", basic: "Via email", premium: "Via email", icon: Settings, category: "core" },
    { name: "Delivery Time", basic: "~3 days", premium: "~3 days", icon: Clock, category: "core" },
    { name: "Monthly Maintenance", basic: true, premium: true, icon: Settings, category: "core" },
    // Advanced Features (Premium Only)
    { name: "User Authentication & Accounts", basic: false, premium: true, icon: Lock, category: "advanced", description: "Secure login system with user registration" },
    { name: "Database Storage", basic: false, premium: true, icon: Database, category: "advanced", description: "Persistent data storage for your application" },
    { name: "Payment Processing Integration", basic: false, premium: true, icon: CreditCard, category: "advanced", description: "Accept payments with Stripe or PayPal" },
    { name: "CRUD Operations", basic: false, premium: true, icon: Cog, category: "advanced", description: "Create, Read, Update, Delete functionality" },
    { name: "Admin Dashboard", basic: false, premium: true, icon: LayoutDashboard, category: "advanced", description: "Manage your application data and users" },
    { name: "Production-Ready Architecture", basic: false, premium: true, icon: Rocket, category: "advanced", description: "Scalable, secure, professional codebase" },
  ];

  return (
    <section className="py-20 relative">
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
          <div className="grid grid-cols-3 gap-6">
            {/* Feature Names Column */}
            <div className="space-y-3">
              {/* Header Spacer */}
              <div className="h-32"></div>
              
              {/* Feature Rows */}
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-200 border-2 ${
                      feature.category === 'advanced' 
                        ? 'bg-white/90 backdrop-blur-sm border-black shadow-lg' 
                        : 'bg-white/70 backdrop-blur-sm border-black/30 hover:border-black/50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${
                      feature.category === 'advanced' 
                        ? 'text-accent' 
                        : 'text-black'
                    }`} />
                    <div>
                      <div className="text-sm font-medium text-black">
                        {feature.name}
                      </div>
                      {feature.description && (
                        <div className="text-xs text-black/70 mt-0.5">
                          {feature.description}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Basic Package Column */}
            <div className="space-y-3">
              {/* Package Header */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-black p-6 text-center h-32 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-2 text-black">Basic</h3>
                <div className="text-3xl font-bold text-black mb-1">£75</div>
                <div className="text-sm text-black/70">+ £10/month</div>
              </div>
              
              {/* Feature Values */}
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center p-4 rounded-lg bg-white/80 backdrop-blur-sm border-2 border-black/40 transition-all duration-200 ${
                    feature.category === 'advanced' 
                      ? 'opacity-50' 
                      : 'hover:shadow-md hover:border-black'
                  }`}
                >
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
              ))}
            </div>

            {/* Premium Package Column - Highlighted */}
            <div className="space-y-3">
              {/* Package Header with Badge */}
              <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-4 border-black p-6 text-center h-32 flex flex-col justify-center transform hover:scale-105 transition-transform duration-200">
                {/* Most Popular Badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-red-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-black">Premium</h3>
                <div className="text-3xl font-bold text-black mb-1">£150</div>
                <div className="text-sm text-black/70">+ £10/month</div>
              </div>
              
              {/* Feature Values - Elevated */}
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center p-4 rounded-lg backdrop-blur-sm transition-all duration-200 border-2 ${
                    feature.category === 'advanced'
                      ? 'bg-white/95 border-black shadow-xl hover:shadow-2xl'
                      : 'bg-white/85 border-black/60 hover:shadow-lg hover:border-black'
                  }`}
                >
                  {typeof feature.premium === "boolean" ? (
                    feature.premium ? (
                      <Check className={`w-6 h-6 ${
                        feature.category === 'advanced' ? 'text-accent' : 'text-black'
                      }`} data-testid={`check-premium-${index}`} />
                    ) : (
                      <X className="w-6 h-6 text-black/30" data-testid={`x-premium-${index}`} />
                    )
                  ) : (
                    <span className="text-sm text-black font-medium" data-testid={`text-premium-${index}`}>
                      {feature.premium}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-6 mt-8">
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
            <div className="p-4 space-y-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 flex-1">
                      <Icon className="w-4 h-4 text-black flex-shrink-0" />
                      <span className="text-sm text-black">{feature.name}</span>
                    </div>
                    <div className="ml-2">
                      {typeof feature.basic === "boolean" ? (
                        feature.basic ? (
                          <Check className="w-5 h-5 text-black" />
                        ) : (
                          <X className="w-5 h-5 text-black/30" />
                        )
                      ) : (
                        <span className="text-xs text-black font-medium">
                          {feature.basic}
                        </span>
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

          {/* Premium Card - Featured */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-4 border-black overflow-hidden relative">
            {/* Most Popular Badge */}
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
            <div className="p-4 space-y-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between py-2 rounded-lg px-2 border ${
                      feature.category === 'advanced' 
                        ? 'bg-white/90 backdrop-blur-sm border-black/80' 
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${
                        feature.category === 'advanced' 
                          ? 'text-accent' 
                          : 'text-black'
                      }`} />
                      <div>
                        <span className="text-sm text-black block">
                          {feature.name}
                        </span>
                        {feature.description && (
                          <span className="text-xs text-black/70">
                            {feature.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-2">
                      {typeof feature.premium === "boolean" ? (
                        feature.premium ? (
                          <Check className={`w-5 h-5 ${
                            feature.category === 'advanced' ? 'text-accent' : 'text-black'
                          }`} />
                        ) : (
                          <X className="w-5 h-5 text-black/30" />
                        )
                      ) : (
                        <span className="text-xs text-black font-medium">
                          {feature.premium}
                        </span>
                      )}
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
