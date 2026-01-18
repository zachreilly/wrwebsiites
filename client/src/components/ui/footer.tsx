import { Phone, Mail, ArrowRight } from "lucide-react";
import { ScrollAnimation } from "@/components/ScrollAnimation";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-black/20 backdrop-blur-md text-white py-12 md:py-16 relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <div className="bg-gradient-to-r from-emerald-800/50 to-green-700/50 p-6 md:p-8 rounded-2xl mb-12 text-center border border-white/20">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Start Growing Your Business Today</h3>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">Get a professional website that brings you more customers. Limited time 50% off launch special.</p>
            <button 
              onClick={() => window.location.href = '/onboarding'}
              className="bg-gradient-to-r from-red-600 to-rose-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:from-red-700 hover:to-rose-600 transition-all shadow-xl hover:scale-105 inline-flex items-center gap-2"
            >
              Get My Website Today
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <ScrollAnimation delay={0.1}>
            <div>
              <div className="text-xl md:text-2xl font-bold text-white mb-4">wrwebsites</div>
              <p className="text-white/80 text-sm md:text-base mb-6">We help businesses get online with simple, affordable websites that bring in more customers.</p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={0.2}>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <div className="space-y-3">
                <a href="tel:07535778637" className="flex items-center text-white/90 hover:text-white hover:translate-x-1 transition-all duration-200">
                  <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 flex-shrink-0" />
                  <span className="text-sm">07535778637</span>
                </a>
                <a href="https://mail.google.com/mail/?view=cm&to=zachhreillyy@gmail.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-white/90 hover:text-white hover:translate-x-1 transition-all duration-200">
                  <Mail className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 flex-shrink-0" />
                  <span className="text-sm break-all">zachhreillyy@gmail.com</span>
                </a>
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={0.3}>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'services', label: 'Services' },
                  { id: 'pricing', label: 'Pricing' },
                  { id: 'about', label: 'About' },
                  { id: 'contact', label: 'Contact' }
                ].map((link, i) => (
                  <li key={i}>
                    <button 
                      onClick={() => scrollToSection(link.id)} 
                      className="text-white/80 hover:text-white transition-all hover:translate-x-1 duration-200 text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={0.4}>
            <div>
              <h4 className="font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2">
                {[
                  "Website Development",
                  "Web Hosting",
                  "SEO Optimization",
                  "Ongoing Support",
                  "Custom Solutions"
                ].map((service, i) => (
                  <li key={i}><span className="text-white/80 text-sm">{service}</span></li>
                ))}
              </ul>
            </div>
          </ScrollAnimation>
        </div>

        <div className="border-t border-white/20 mt-10 md:mt-12 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/80 text-xs md:text-sm text-center md:text-left">
              © 2025 wrwebsites. All rights reserved.
            </div>
            <div className="text-white/80 text-xs md:text-sm text-center md:text-right">
              Professional web development services with launch special pricing.
            </div>
          </div>
          <div className="text-center mt-4 pt-4 border-t border-white/10">
            <div className="flex justify-center items-center space-x-4">
              <div className="text-white/60 text-xs">
                made by wrwebsites.com
              </div>
              <div className="text-white/40">•</div>
              <a 
                href="/admin" 
                className="text-white/50 hover:text-white/80 text-xs transition-all hover:scale-110 duration-200"
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
