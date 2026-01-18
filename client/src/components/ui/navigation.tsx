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
    <nav className="sticky top-0 z-50 bg-gradient-to-b from-emerald-700/95 via-emerald-600/80 to-transparent backdrop-blur-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          <div className="flex items-center">
            <img 
              src={logoImage} 
              alt="wrwebsites logo" 
              className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full shadow-lg hover:scale-110 hover:rotate-6 transition-all duration-300"
              data-testid="logo-image"
            />
            <span className="ml-2 sm:ml-3 md:ml-4 text-xl sm:text-2xl md:text-4xl font-bold text-white">wrwebsites</span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/portfolio'}
              className="hidden lg:flex text-white hover:text-white hover:bg-white/20 hover:scale-105 transition-all duration-200"
              data-testid="button-portfolio-header"
            >
              Portfolio
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/customer/login'}
              className="hidden lg:flex text-white hover:text-white hover:bg-white/20 hover:scale-105 transition-all duration-200"
              data-testid="button-customer-portal-header"
            >
              Customer Portal
            </Button>
            <Button
              onClick={() => window.location.href = '/onboarding'}
              className="hidden sm:flex bg-gradient-to-r from-red-600 to-rose-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-sm md:text-base hover:from-red-700 hover:to-rose-600 transition-all shadow-lg hover:shadow-red-500/30 items-center gap-2"
              data-testid="button-get-started-header"
            >
              <span className="hidden md:inline">Get My Website</span>
              <span className="md:hidden">Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-white hover:bg-white/20 hover:scale-110 transition-transform duration-200 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="glass-strong border-t border-white/20 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-4 pb-6 space-y-3">
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
                  className="block px-4 py-3 text-white hover:text-white w-full text-left rounded-lg hover:bg-white/20 transition-all font-medium text-base"
                >
                  {item.label}
                </button>
              ))}
              <button 
                onClick={() => {
                  window.location.href = '/portfolio';
                  setIsMenuOpen(false);
                }} 
                className="block px-4 py-3 text-white hover:text-white w-full text-left rounded-lg hover:bg-white/20 transition-all text-base"
                data-testid="button-portfolio-mobile"
              >
                Portfolio
              </button>
            </div>
            
            <div className="h-px bg-white/20 my-4"></div>
            
            <button 
              onClick={() => {
                window.location.href = '/customer/login';
                setIsMenuOpen(false);
              }} 
              className="block px-4 py-3 text-white/80 hover:text-white w-full text-left text-base transition-all"
            >
              Customer Portal
            </button>
            
            <div className="space-y-3 pt-4">
              <Button 
                onClick={() => {
                  window.location.href = '/onboarding';
                  setIsMenuOpen(false);
                }} 
                className="w-full bg-gradient-to-r from-red-600 to-rose-500 text-white hover:from-red-700 hover:to-rose-600 py-4 text-lg font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                Get My Website Today
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  window.location.href = '/onboarding?mode=demo';
                  setIsMenuOpen(false);
                }} 
                className="w-full border-2 border-white text-white hover:bg-white/10 py-3 font-semibold rounded-xl"
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
