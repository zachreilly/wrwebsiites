import { Code, Server, Headphones } from "lucide-react";

export default function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">What We Offer</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We help local businesses get online with simple, affordable websites that look great and work on all devices. Whether you just need a professional online presence or want something more customised, we've got you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Static Website Development */}
          <div className="bg-slate-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Static Websites – Simple & Reliable</h3>
            <p className="text-slate-600 mb-4">
              A static website is a site made up of fixed pages — think of it like an online brochure. The content doesn't change automatically; it only updates when we make changes for you.
            </p>
            <h4 className="font-semibold text-slate-900 mb-2">Why it's great:</h4>
            <ul className="text-sm text-slate-600 space-y-2">
              <li className="flex items-center"><span className="text-emerald-500 mr-2">✓</span>Loads quickly and works on any device</li>
              <li className="flex items-center"><span className="text-emerald-500 mr-2">✓</span>Secure and low maintenance</li>
              <li className="flex items-center"><span className="text-emerald-500 mr-2">✓</span>Perfect for showcasing your services, contact details, opening hours, and more</li>
            </ul>
            <p className="text-sm text-slate-600 mt-3 italic">Static websites are ideal for small businesses that don't need frequent updates or complex features.</p>
          </div>

          {/* Web Hosting */}
          <div className="bg-slate-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-6">
              <Server className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Domain & Hosting – Your Website's Home</h3>
            <p className="text-slate-600 mb-4">
              Your website needs two things to be visible online:
            </p>
            <ul className="text-sm text-slate-600 space-y-2 mb-4">
              <li className="flex items-start"><span className="text-emerald-500 mr-2 mt-0.5">•</span><strong>Domain name</strong> – This is your website's address (e.g., www.yourbusiness.co.uk).</li>
              <li className="flex items-start"><span className="text-emerald-500 mr-2 mt-0.5">•</span><strong>Hosting</strong> – This is where your website's files are stored so people can access them 24/7.</li>
            </ul>
            <p className="text-sm text-slate-600 italic">We manage both for you, so you don't need to worry about technical setups or renewals.</p>
          </div>

          {/* Ongoing Support */}
          <div className="bg-slate-50 p-8 rounded-xl hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-6">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Ongoing Support & Maintenance</h3>
            <p className="text-slate-600 mb-4">
              Keep your website running smoothly with regular updates, security monitoring, and technical support whenever you need it.
            </p>
            <ul className="text-sm text-slate-600 space-y-2">
              <li className="flex items-center"><span className="text-emerald-500 mr-2">✓</span>Regular Updates</li>
              <li className="flex items-center"><span className="text-emerald-500 mr-2">✓</span>Security Monitoring</li>
              <li className="flex items-center"><span className="text-emerald-500 mr-2">✓</span>Content Updates</li>
              <li className="flex items-center"><span className="text-emerald-500 mr-2">✓</span>Technical Support</li>
            </ul>
          </div>
        </div>

        {/* Featured Work Section */}
        <div className="bg-slate-50 p-8 rounded-xl">
          <h3 className="text-2xl font-semibold text-slate-900 mb-6 text-center">Our Development Process</h3>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="bg-gradient-to-br from-primary to-secondary rounded-lg p-8 text-white">
                <h4 className="text-xl font-semibold mb-4">Professional Web Design</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Mobile-responsive design</li>
                  <li>• Fast loading speeds</li>
                  <li>• SEO optimised</li>
                  <li>• Modern, clean layouts</li>
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">1</div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Discovery & Planning</h4>
                  <p className="text-slate-600">We understand your business goals and create a tailored strategy.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">2</div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Design & Development</h4>
                  <p className="text-slate-600">Professional design and clean code that works on all devices.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">3</div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Launch & Support</h4>
                  <p className="text-slate-600">Seamless deployment with ongoing maintenance and support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
