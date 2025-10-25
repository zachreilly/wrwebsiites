import { Phone, Mail } from "lucide-react";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="text-2xl font-bold text-white mb-4">wrwebsites</div>
            <p className="text-slate-300 mb-6 max-w-md">We help businesses get online with simple, affordable websites that look great and work on all devices. Special launch pricing available now.</p>
            <div className="space-y-2">
              <div className="flex items-center text-slate-300">
                <Phone className="w-5 h-5 mr-3" />
                <span>07535778637</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Mail className="w-5 h-5 mr-3" />
                <span>zachhreillyy@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('home')} 
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('pricing')} 
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2">
              <li><span className="text-slate-300">Website Development</span></li>
              <li><span className="text-slate-300">Web Hosting</span></li>
              <li><span className="text-slate-300">SEO Optimization</span></li>
              <li><span className="text-slate-300">Ongoing Support</span></li>
              <li><span className="text-slate-300">Custom Solutions</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-300 text-sm">
              © 2025 wrwebsites. All rights reserved.
            </div>
            <div className="text-slate-300 text-sm mt-4 md:mt-0">
              Professional web development services with launch special pricing.
            </div>
          </div>
          <div className="text-center mt-4 pt-4 border-t border-slate-800">
            <div className="flex justify-center items-center space-x-4">
              <div className="text-slate-400 text-xs">
                made by wrwebsites.com
              </div>
              <div className="text-slate-600">•</div>
              <a 
                href="/admin" 
                className="text-slate-500 hover:text-slate-300 text-xs transition-colors"
              >
                Admin Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
