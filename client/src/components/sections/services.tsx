import { Code, Server, Headphones } from "lucide-react";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { use3DTilt } from "@/hooks/use3DTilt";

function ServiceCard({ icon: Icon, title, description, benefits, note, delay }: {
  icon: any;
  title: string;
  description: string;
  benefits?: { text: string }[];
  note?: string;
  delay: number;
}) {
  const tilt = use3DTilt({ max: 10, scale: 1.03 });
  
  return (
    <ScrollAnimation delay={delay}>
      <div
        ref={tilt.ref}
        style={tilt.style}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="gradient-box p-8 rounded-xl shadow-2xl hover:shadow-3xl transition-shadow h-full gpu-accelerated"
      >
        <div className="w-12 h-12 bg-black/10 rounded-lg flex items-center justify-center mb-6">
          <Icon className="w-6 h-6 text-black" />
        </div>
        <h3 className="text-xl font-semibold text-black mb-4">{title}</h3>
        <p className="text-black/90 mb-4">{description}</p>
        {benefits && (
          <>
            <h4 className="font-semibold text-black mb-2">Why it's great:</h4>
            <ul className="text-sm text-black/80 space-y-2">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-center">
                  <span className="text-black mr-2">✓</span>
                  {benefit.text}
                </li>
              ))}
            </ul>
          </>
        )}
        {note && <p className="text-sm text-black/70 mt-3 italic">{note}</p>}
      </div>
    </ScrollAnimation>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">What We Offer</h2>
            <p className="text-xl text-black/90 max-w-3xl mx-auto">We help businesses get online with simple, affordable websites that look great and work on all devices. Whether you just need a professional online presence or want something more customised, we've got you covered.</p>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <ServiceCard
            icon={Code}
            title="Static Websites – Simple & Reliable"
            description="A static website is a site made up of fixed pages — think of it like an online brochure. The content doesn't change automatically; it only updates when we make changes for you."
            benefits={[
              { text: "Loads quickly and works on any device" },
              { text: "Secure and low maintenance" },
              { text: "Perfect for showcasing your services, contact details, opening hours, and more" }
            ]}
            note="Static websites are ideal for small businesses that don't need frequent updates or complex features."
            delay={0.1}
          />

          <ServiceCard
            icon={Server}
            title="Domain & Hosting – Your Website's Home"
            description="Your website needs a domain name (your website's address) and hosting (where your files are stored). We manage both for you, so you don't need to worry about technical setups or renewals."
            delay={0.2}
          />

          <ServiceCard
            icon={Headphones}
            title="Ongoing Support & Maintenance"
            description="Keep your website running smoothly with regular updates, security monitoring, and technical support whenever you need it."
            benefits={[
              { text: "Regular Updates" },
              { text: "Security Monitoring" },
              { text: "Content Updates" },
              { text: "Technical Support" }
            ]}
            delay={0.3}
          />
        </div>

        <ScrollAnimation delay={0.4}>
          <div className="gradient-box p-8 rounded-xl shadow-2xl">
            <h3 className="text-2xl font-semibold text-black mb-6 text-center">Our Development Process</h3>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="bg-black/10 p-8 rounded-lg border-2 border-black/20 shadow-xl">
                  <h4 className="text-xl font-semibold mb-4 text-black">Professional Web Design</h4>
                  <ul className="space-y-2 text-sm text-black/90">
                    <li>• Mobile-responsive design</li>
                    <li>• Fast loading speeds</li>
                    <li>• SEO optimised</li>
                    <li>• Modern, clean layouts</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-6">
                {[
                  { step: 1, title: "Discovery & Planning", description: "We understand your business goals and create a tailored strategy." },
                  { step: 2, title: "Design & Development", description: "Professional design and clean code that works on all devices." },
                  { step: 3, title: "Launch & Support", description: "Seamless deployment with ongoing maintenance and support." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-black/20 rounded-full flex items-center justify-center text-black font-semibold text-sm">{item.step}</div>
                    <div>
                      <h4 className="font-semibold text-black mb-2">{item.title}</h4>
                      <p className="text-black/80">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.5}>
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-red-600 to-rose-500 p-8 md:p-12 rounded-2xl shadow-2xl max-w-4xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Get Your Business Online?</h3>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Join local businesses already growing with a professional website. Start with a free demo - no payment required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.location.href = '/onboarding'}
                  className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:scale-105"
                >
                  Get Your Website Today
                </button>
                <button 
                  onClick={() => window.location.href = '/onboarding?mode=demo'}
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
                >
                  Try Free Demo First
                </button>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
