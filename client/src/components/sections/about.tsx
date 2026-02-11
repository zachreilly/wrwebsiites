import { Zap, Headphones, TrendingUp, Search, Users, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 box-border">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">Why Your Business Needs a Website</h2>
          <p className="text-base sm:text-lg text-black/70 max-w-2xl mx-auto leading-relaxed">
            Your website is often the first impression customers have of your business. A professional online presence actively helps grow your business.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {[
            {
              icon: Search,
              title: "Get Found Online",
              description: "A well-optimised website helps you appear in Google results. Without one, you're invisible to the 97% of people who search online before buying.",
              stat: "97%",
              statDesc: "of customers search online first"
            },
            {
              icon: Users,
              title: "Build Trust",
              description: "A professional website shows customers you're a legitimate, established business. First impressions matter — a polished online presence builds confidence.",
              stat: "75%",
              statDesc: "judge credibility by website design"
            },
            {
              icon: TrendingUp,
              title: "Convert Visitors to Customers",
              description: "Your website works around the clock. With clear calls-to-action and easy contact options, it turns browsers into paying customers.",
              stat: "24/7",
              statDesc: "always working for your business"
            }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md border border-black/10 p-6 sm:p-8 h-full flex flex-col">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-5">
                <item.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed flex-grow">{item.description}</p>
              <div className="border-t border-gray-100 pt-4">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600">{item.stat}</div>
                <div className="text-xs text-gray-500">{item.statDesc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-black mb-4">Why Choose wrwebsites?</h3>
            <p className="text-base sm:text-lg text-black/70 mb-8 leading-relaxed">Professional websites at affordable prices. We handle everything so you can focus on your business.</p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Fast & Optimised</h4>
                  <p className="text-sm text-gray-600">Websites that load quickly and rank well in search engines.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Ongoing Support</h4>
                  <p className="text-sm text-gray-600">Reliable support and maintenance whenever you need it.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-black/10 p-6 sm:p-8">
            <h4 className="text-xl font-semibold text-gray-900 mb-6">Why Local Businesses Choose Us</h4>
            <div className="space-y-5">
              {[
                { num: "1", title: "Affordable Pricing", desc: "Professional quality at budget-friendly prices" },
                { num: "2", title: "Local Support", desc: "Direct contact with a friendly team who understands small business" },
                { num: "3", title: "Fast Delivery", desc: "Your site live in days, not weeks" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="bg-emerald-100 text-emerald-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">{item.num}</div>
                  <div>
                    <h5 className="font-semibold text-gray-900">{item.title}</h5>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => window.location.href = '/onboarding'}
              className="mt-8 w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              Get Your Website Today
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
