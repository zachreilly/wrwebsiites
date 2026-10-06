import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/wrwebsites logo _1757645298545.png";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-emerald-700/95 backdrop-blur-sm w-full overflow-x-hidden border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center min-w-0">
            <img 
              src={logoImage} 
              alt="wrwebsites logo" 
              className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full flex-shrink-0"
              data-testid="logo-image"
            />
            <span className="ml-2 sm:ml-3 text-lg sm:text-xl md:text-2xl font-semibold text-white truncate">wrwebsites</span>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/portfolio'}
              className="hidden lg:flex text-white/80 hover:text-white hover:bg-white/10 text-sm"
              data-testid="button-portfolio-header"
            >
              Portfolio
            </Button>
            <Button
              onClick={() => window.location.href = '/onboarding'}
              className="hidden sm:flex bg-white text-emerald-700 px-4 md:px-5 py-2 rounded-lg font-semibold text-sm hover:bg-white/95 transition-colors items-center gap-2"
              data-testid="button-get-started-header"
            >
              <span className="hidden md:inline">Get Your Website</span>
              <span className="md:hidden">Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-white hover:bg-white/10 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="bg-emerald-800/95 backdrop-blur-sm border-t border-white/10">
          <div className="px-4 pt-4 pb-6 space-y-3 max-w-7xl mx-auto">
            <div className="space-y-1">
              {[
                { id: 'home', label: 'Home' },
                { id: 'services', label: 'Services' },
                { id: 'pricing', label: 'Pricing' },
                { id: 'about', label: 'About' },
                { id: 'contact', label: 'Contact' }
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => scrollToSection(item.id)}
                  className="block px-4 py-3 text-white/90 hover:text-white w-full text-left rounded-lg hover:bg-white/10 transition-colors text-sm"
                >
                  {item.label}
                </button>
              ))}
              <button 
                onClick={() => {
                  window.location.href = '/portfolio';
                  setIsMenuOpen(false);
                }} 
                className="block px-4 py-3 text-white/90 hover:text-white w-full text-left rounded-lg hover:bg-white/10 transition-colors text-sm"
                data-testid="button-portfolio-mobile"
              >
                Portfolio
              </button>
            </div>
            
            <div className="space-y-3 pt-4">
              <Button 
                onClick={() => {
                  window.location.href = '/onboarding';
                  setIsMenuOpen(false);
                }} 
                className="w-full bg-white text-emerald-700 hover:bg-white/95 py-3 font-semibold rounded-lg flex items-center justify-center gap-2"
              >
                Get Your Website Today
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  window.location.href = '/onboarding?mode=demo';
                  setIsMenuOpen(false);
                }} 
                className="w-full border border-white/30 text-white hover:bg-white/10 py-3 font-medium rounded-lg"
              >
                Try Free Demo First
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
