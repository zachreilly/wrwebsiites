import { Phone, Mail, ArrowRight } from "lucide-react";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-emerald-800/80 backdrop-blur-sm text-white py-12 md:py-16 border-t border-white/10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 box-border">
        <div className="bg-emerald-700/50 p-6 sm:p-8 rounded-xl mb-10 text-center border border-white/10">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Ready to get your business online?</h3>
          <p className="text-sm text-white/70 mb-5 max-w-xl mx-auto">Professional websites at affordable prices. Start with a free demo.</p>
          <button 
            onClick={() => window.location.href = '/onboarding'}
            className="bg-white text-emerald-700 px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/95 transition-colors inline-flex items-center gap-2"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div>
            <div className="text-lg font-semibold text-white mb-3">wrwebsites</div>
            <p className="text-white/60 text-sm">Simple, affordable websites for small businesses.</p>
          </div>

          <div>
            <h4 className="font-medium text-white mb-3 text-sm">Contact</h4>
            <div className="space-y-2">
              <a href="tel:07535778637" className="flex items-center text-white/70 hover:text-white transition-colors text-sm">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>07535778637</span>
              </a>
              <a href="https://mail.google.com/mail/?view=cm&to=zachhreillyy@gmail.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-white/70 hover:text-white transition-colors text-sm">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="break-all">zachhreillyy@gmail.com</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-white mb-3 text-sm">Quick Links</h4>
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
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-3 text-sm">Services</h4>
            <ul className="space-y-2">
              {[
                "Website Development",
                "Web Hosting",
                "SEO Optimisation",
                "Ongoing Support",
                "Custom Solutions"
              ].map((service, i) => (
                <li key={i}><span className="text-white/60 text-sm">{service}</span></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/50 text-xs text-center md:text-left">
              &copy; 2025 wrwebsites. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white/40 text-xs">made by wrwebsites.com</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
