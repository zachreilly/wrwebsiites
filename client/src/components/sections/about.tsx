import { CheckCircle, Zap, Headphones } from "lucide-react";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { use3DTilt } from "@/hooks/use3DTilt";

export default function About() {
  const cardTilt = use3DTilt({ max: 8, scale: 1.02 });

  return (
    <section id="about" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollAnimation delay={0.1}>
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Why Choose wrwebsites?</h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">We help businesses get online with professional, affordable websites. Our special launch pricing means you get professional quality for a fraction of the usual cost.</p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 glass rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Zap className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Lightning Fast</h3>
                    <p className="text-white/80">Optimised websites that load quickly and rank well in search engines.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 glass rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Headphones className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Ongoing Support</h3>
                    <p className="text-white/80">We're here when you need us with reliable support and maintenance.</p>
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
              className="glass-strong rounded-xl p-8 shadow-2xl border border-white/30 gpu-accelerated"
            >
              <h4 className="text-2xl font-bold text-white mb-4">Why Local Businesses Choose Us</h4>
              <div className="space-y-4">
                {[
                  { num: "1", title: "Affordable Pricing", desc: "Launch rates while we build our portfolio" },
                  { num: "2", title: "Local Support", desc: "Direct contact with friendly, local team" },
                  { num: "3", title: "Fast Delivery", desc: "Your site live in days, not weeks" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="bg-accent text-slate-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">{item.num}</div>
                    <div>
                      <h5 className="font-semibold text-white">{item.title}</h5>
                      <p className="text-white/80 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
