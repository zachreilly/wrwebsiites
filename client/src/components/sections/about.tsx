import { CheckCircle, Zap, Headphones, TrendingUp, Search, Users, ArrowRight } from "lucide-react";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { use3DTilt } from "@/hooks/use3DTilt";
import { FloatingElements } from "@/components/FloatingElements";

export default function About() {
  const cardTilt = use3DTilt({ max: 8, scale: 1.02 });

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <FloatingElements count={2} size="small" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">Why Your Business Needs a Great Website</h2>
            <p className="text-xl text-black/90 max-w-3xl mx-auto leading-relaxed">
              In today's digital world, your website is often the first impression customers have of your business. A professional website doesn't just look good - it actively helps grow your business.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Search,
              title: "Get Found Online",
              description: "When customers search for services like yours, a well-optimised website helps you appear in Google results. Without a website, you're invisible to the 97% of people who search online before buying.",
              stat: "97%",
              statDesc: "of customers search online first"
            },
            {
              icon: Users,
              title: "Build Trust & Credibility",
              description: "A professional website shows customers you're a legitimate, established business. First impressions matter - a polished online presence makes customers more likely to choose you over competitors.",
              stat: "75%",
              statDesc: "judge credibility by website design"
            },
            {
              icon: TrendingUp,
              title: "Convert Visitors to Customers",
              description: "Your website works 24/7, even when you're asleep. With clear calls-to-action and easy contact options, it turns casual browsers into paying customers and grows your business.",
              stat: "24/7",
              statDesc: "always working for your business"
            }
          ].map((item, i) => (
            <ScrollAnimation key={i} delay={i * 0.1}>
              <div className="gradient-box p-6 md:p-8 rounded-xl shadow-2xl h-full">
                <div className="w-14 h-14 bg-black/10 rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-black" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">{item.title}</h3>
                <p className="text-black/80 mb-4 leading-relaxed">{item.description}</p>
                <div className="border-t border-black/10 pt-4">
                  <div className="text-3xl font-bold text-red-600">{item.stat}</div>
                  <div className="text-sm text-black/70">{item.statDesc}</div>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollAnimation delay={0.1}>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-black mb-6">Why Choose wrwebsites?</h3>
              <p className="text-xl text-black/90 mb-8 leading-relaxed">We help businesses get online with professional, affordable websites. Our special launch pricing means you get professional quality for a fraction of the usual cost.</p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 gradient-box rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-2 text-lg">Lightning Fast</h4>
                    <p className="text-black/80">Optimised websites that load quickly and rank well in search engines. Speed matters - slow sites lose customers.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 gradient-box rounded-lg flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-2 text-lg">Ongoing Support</h4>
                    <p className="text-black/80">We're here when you need us with reliable support and maintenance. You're never left on your own.</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation delay={0.2}>
            <div
              ref={cardTilt.ref}
              style={cardTilt.style}
              onMouseMove={cardTilt.onMouseMove}
              onMouseLeave={cardTilt.onMouseLeave}
              className="gradient-box rounded-xl p-8 shadow-2xl gpu-accelerated"
            >
              <h4 className="text-2xl font-bold text-black mb-6">Why Local Businesses Choose Us</h4>
              <div className="space-y-5">
                {[
                  { num: "1", title: "Affordable Pricing", desc: "Launch rates while we build our portfolio - professional quality at budget-friendly prices" },
                  { num: "2", title: "Local Support", desc: "Direct contact with a friendly, local team who understands small business needs" },
                  { num: "3", title: "Fast Delivery", desc: "Your site live in days, not weeks - because we know time is money" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{item.num}</div>
                    <div>
                      <h5 className="font-bold text-black text-lg">{item.title}</h5>
                      <p className="text-black/80">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => window.location.href = '/onboarding'}
                className="mt-8 w-full bg-gradient-to-r from-red-600 to-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:from-red-700 hover:to-rose-600 transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-2"
              >
                Get Your Website Today
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
