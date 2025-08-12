import { Code, Server, Headphones } from "lucide-react";

export default function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">What We Offer</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Complete web solutions designed to help your business thrive online with professional development and reliable hosting.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Static Website Development */}
          <div className="bg-slate-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Static Website Development</h3>
            <p className="text-slate-600 mb-4">
              Lightning-fast, secure static websites built with modern technologies. Perfect for business websites, portfolios, and landing pages.
            </p>
            <ul className="text-sm text-slate-600 space-y-2">
              <li className="flex items-center"><span className="text-emerald-500 mr-2">✓</span>Responsive Design</li>
              <li className="flex items-center"><span className="text-emerald-500 mr-2">✓</span>SEO Optimized</li>
              <li className="flex items-center"><span className="text-emerald-500 mr-2">✓</span>Fast Loading</li>
              <li className="flex items-center"><span className="text-emerald-500 mr-2">✓</span>Mobile First</li>
            </ul>
          </div>

          {/* Web Hosting */}
          <div className="bg-slate-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-6">
              <Server className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Professional Web Hosting</h3>
            <p className="text-slate-600 mb-4">
              Reliable, secure hosting with 99.9% uptime guarantee. Includes SSL certificates, daily backups, and technical support.
            </p>
            <ul className="text-sm text-slate-600 space-y-2">
              <li className="flex items-center"><span className="text-emerald-500 mr-2">✓</span>99.9% Uptime</li>
              <li className="flex items-center"><span className="text-emerald-500 mr-2">✓</span>SSL Included</li>
              <li className="flex items-center"><span className="text-emerald-500 mr-2">✓</span>Daily Backups</li>
              <li className="flex items-center"><span className="text-emerald-500 mr-2">✓</span>24/7 Support</li>
            </ul>
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
              <img 
                src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Modern responsive website designs on multiple devices" 
                className="rounded-lg shadow-lg w-full" 
              />
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
