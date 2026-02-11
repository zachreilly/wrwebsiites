import { Code, Server, Headphones, CheckCircle } from "lucide-react";

function ServiceCard({ icon: Icon, title, description, benefits, note }: {
  icon: any;
  title: string;
  description: string;
  benefits?: { text: string }[];
  note?: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-black/10 p-5 sm:p-8 h-full">
      <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-5">
        <Icon className="w-6 h-6 text-emerald-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">{description}</p>
      {benefits && (
        <ul className="text-sm text-gray-600 space-y-2">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-start">
              <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>{benefit.text}</span>
            </li>
          ))}
        </ul>
      )}
      {note && <p className="text-xs text-gray-400 mt-3 italic">{note}</p>}
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-24 relative w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 box-border">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">What We Offer</h2>
          <p className="text-base sm:text-lg text-black/70 max-w-2xl mx-auto">Simple, affordable websites that look great and work on all devices.</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          <ServiceCard
            icon={Code}
            title="Static Websites"
            description="A static website is like an online brochure for your business. The content is fixed and only updates when we make changes for you — simple, fast, and reliable."
            benefits={[
              { text: "Loads quickly on any device" },
              { text: "Secure and low maintenance" },
              { text: "Showcases your services, contact details, and more" }
            ]}
            note="Ideal for small businesses that don't need frequent updates or complex features."
          />

          <ServiceCard
            icon={Server}
            title="Domain & Hosting"
            description="Your website needs a domain name (your address online) and hosting (where it lives). We manage both for you, so there's nothing technical to worry about."
          />

          <ServiceCard
            icon={Headphones}
            title="Ongoing Support"
            description="Keep your website running smoothly with regular updates, security monitoring, and technical support whenever you need it."
            benefits={[
              { text: "Regular updates" },
              { text: "Security monitoring" },
              { text: "Content changes" },
              { text: "Technical support" }
            ]}
          />
        </div>

        <div className="bg-white rounded-xl shadow-md border border-black/10 p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 text-center">Our Process</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: "Discovery & Planning", description: "We understand your business goals and create a tailored strategy." },
              { step: 2, title: "Design & Development", description: "Professional design and clean code that works on all devices." },
              { step: 3, title: "Launch & Support", description: "Seamless deployment with ongoing maintenance and support." }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-semibold text-sm mx-auto mb-4">{item.step}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
