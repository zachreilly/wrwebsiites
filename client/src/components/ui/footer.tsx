import { Phone, Mail } from "lucide-react";
import { ScrollAnimation } from "@/components/ScrollAnimation";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-black/20 backdrop-blur-md text-white py-16 relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ScrollAnimation delay={0.1}>
            <div className="lg:col-span-2">
              <div className="text-2xl font-bold text-white mb-4">wrwebsites</div>
              <p className="text-white/80 mb-6 max-w-md">We help businesses get online with simple, affordable websites that look great and work on all devices. Special launch pricing available now.</p>
              <div className="space-y-2">
                <div className="flex items-center text-white/90 hover:scale-105 hover:translate-x-1 transition-all duration-200">
                  <Phone className="w-5 h-5 mr-3" />
                  <span>07535778637</span>
                </div>
                <div className="flex items-center text-white/90 hover:scale-105 hover:translate-x-1 transition-all duration-200">
                  <Mail className="w-5 h-5 mr-3" />
                  <span>zachhreillyy@gmail.com</span>
                </div>
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={0.2}>
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
                      className="text-white/80 hover:text-white transition-all hover:scale-105 hover:translate-x-1 duration-200"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={0.3}>
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
                  <li key={i}><span className="text-white/80">{service}</span></li>
                ))}
              </ul>
            </div>
          </ScrollAnimation>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/80 text-sm">
              © 2025 wrwebsites. All rights reserved.
            </div>
            <div className="text-white/80 text-sm mt-4 md:mt-0">
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
