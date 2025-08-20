import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-primary">wrwebsites</div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => scrollToSection('home')} 
                className="text-slate-900 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('services')} 
                className="text-slate-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="text-slate-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="text-slate-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => window.location.href = '/consultation'} 
                className="text-amber-600 hover:text-amber-700 px-3 py-2 text-sm font-medium transition-colors border border-amber-200 rounded-md bg-amber-50 hover:bg-amber-100"
              >
                Custom Quote
              </button>
              <Button 
                onClick={() => window.location.href = '/onboarding'} 
                className="bg-primary text-white hover:bg-secondary"
              >
                Get Started
              </Button>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-primary"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button 
              onClick={() => scrollToSection('home')} 
              className="block px-3 py-2 text-slate-900 font-medium w-full text-left"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('services')} 
              className="block px-3 py-2 text-slate-600 hover:text-primary w-full text-left"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('pricing')} 
              className="block px-3 py-2 text-slate-600 hover:text-primary w-full text-left"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="block px-3 py-2 text-slate-600 hover:text-primary w-full text-left"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="block px-3 py-2 text-slate-600 hover:text-primary w-full text-left"
            >
              Contact
            </button>
            <button 
              onClick={() => {
                window.location.href = '/consultation';
                setIsMenuOpen(false);
              }} 
              className="block px-3 py-2 text-amber-600 hover:text-amber-700 w-full text-left font-medium border border-amber-200 rounded-md bg-amber-50 hover:bg-amber-100 mt-2"
            >
              Custom Quote
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
