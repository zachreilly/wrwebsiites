import { useState } from "react";
import { Menu, X } from "lucide-react";
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
    <nav className="glass-strong sticky top-0 z-50 border-b border-white/20 backdrop-blur-xl">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center">
            <img 
              src={logoImage} 
              alt="wrwebsites logo" 
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-full shadow-lg hover:scale-110 hover:rotate-6 transition-all duration-300"
              data-testid="logo-image"
            />
            <span className="ml-2 sm:ml-4 text-2xl sm:text-4xl font-bold text-white">wrwebsites</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/portfolio'}
              className="hidden md:flex text-white hover:text-white hover:bg-white/20 hover:scale-105 transition-all duration-200"
              data-testid="button-portfolio-header"
            >
              Portfolio
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/customer/login'}
              className="hidden md:flex text-white hover:text-white hover:bg-white/20 hover:scale-105 transition-all duration-200"
              data-testid="button-customer-portal-header"
            >
              Customer Portal
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-white hover:bg-white/20 hover:scale-110 transition-transform duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="glass-strong border-t border-white/20 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-4 pb-4 space-y-2">
            <div className="space-y-1">
              {[
                { id: 'home', label: 'Home' },
                { id: 'services', label: 'Services' },
                { id: 'pricing', label: 'Pricing' },
                { id: 'about', label: 'About' }
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => scrollToSection(item.id)}
                  className="block px-3 py-2 text-white hover:text-white w-full text-left rounded-lg hover:bg-white/20 transition-all font-medium hover:translate-x-1"
                >
                  {item.label}
                </button>
              ))}
              <button 
                onClick={() => {
                  window.location.href = '/portfolio';
                  setIsMenuOpen(false);
                }} 
                className="block px-3 py-2 text-white hover:text-white w-full text-left rounded-lg hover:bg-white/20 transition-all hover:translate-x-1"
                data-testid="button-portfolio-mobile"
              >
                Portfolio
              </button>
            </div>
            
            <div className="h-px bg-white/20 my-3"></div>
            
            <button 
              onClick={() => {
                window.location.href = '/customer/login';
                setIsMenuOpen(false);
              }} 
              className="block px-3 py-2 text-white/90 hover:text-white w-full text-left text-sm hover:translate-x-1 transition-all"
            >
              Customer Portal
            </button>
            
            <div className="space-y-2 pt-2">
              <Button 
                variant="outline"
                onClick={() => {
                  window.location.href = '/consultation';
                  setIsMenuOpen(false);
                }} 
                className="w-full border-2 border-accent text-accent hover:bg-accent hover:text-slate-900 font-semibold hover:scale-105 transition-all duration-200"
              >
                Custom Quote
              </Button>
              <Button 
                onClick={() => {
                  window.location.href = '/payment';
                  setIsMenuOpen(false);
                }} 
                className="w-full bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-200"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
