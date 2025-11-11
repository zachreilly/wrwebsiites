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
        className="glass-strong p-8 rounded-xl shadow-2xl border border-white/30 hover:shadow-3xl transition-shadow h-full gpu-accelerated"
      >
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-6 backdrop-blur-sm">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
        <p className="text-white/90 mb-4">{description}</p>
        {benefits && (
          <>
            <h4 className="font-semibold text-white mb-2">Why it's great:</h4>
            <ul className="text-sm text-white/80 space-y-2">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-center">
                  <span className="text-accent mr-2">✓</span>
                  {benefit.text}
                </li>
              ))}
            </ul>
          </>
        )}
        {note && <p className="text-sm text-white/70 mt-3 italic">{note}</p>}
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
            <h2 className="text-4xl font-bold text-white mb-4">What We Offer</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">We help businesses get online with simple, affordable websites that look great and work on all devices. Whether you just need a professional online presence or want something more customised, we've got you covered.</p>
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
          <div className="glass-strong p-8 rounded-xl shadow-2xl border border-white/30">
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">Our Development Process</h3>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="glass p-8 rounded-lg text-white border border-white/20 shadow-xl">
                  <h4 className="text-xl font-semibold mb-4">Professional Web Design</h4>
                  <ul className="space-y-2 text-sm text-white/90">
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
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold text-sm backdrop-blur-sm">{item.step}</div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">{item.title}</h4>
                      <p className="text-white/80">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
