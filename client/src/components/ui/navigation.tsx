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
    <nav className="bg-emerald-600 shadow-sm sticky top-0 z-50 border-b border-emerald-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={logoImage} 
              alt="wrwebsites logo" 
              className="h-12 w-12 rounded-full"
              data-testid="logo-image"
            />
            <span className="ml-3 text-xl font-bold text-white">wrwebsites</span>
          </div>
          
          {/* Menu button - shows on all screen sizes */}
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-emerald-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="bg-emerald-600 border-t border-emerald-700">
          <div className="px-4 pt-4 pb-4 space-y-2">
            {/* Main Navigation */}
            <div className="space-y-1">
              <button 
                onClick={() => scrollToSection('home')} 
                className="block px-3 py-2 text-white hover:text-emerald-100 w-full text-left rounded-lg hover:bg-emerald-700 font-medium transition-all"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('services')} 
                className="block px-3 py-2 text-white hover:text-emerald-100 w-full text-left rounded-lg hover:bg-emerald-700 transition-all"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="block px-3 py-2 text-white hover:text-emerald-100 w-full text-left rounded-lg hover:bg-emerald-700 transition-all"
              >
                Pricing
              </button>
              <button 
                onClick={() => {
                  window.location.href = '/portfolio';
                  setIsMenuOpen(false);
                }} 
                className="block px-3 py-2 text-white hover:text-emerald-100 w-full text-left rounded-lg hover:bg-emerald-700 transition-all"
                data-testid="button-portfolio-mobile"
              >
                Portfolio
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="block px-3 py-2 text-white hover:text-emerald-100 w-full text-left rounded-lg hover:bg-emerald-700 transition-all"
              >
                About
              </button>
            </div>
            
            {/* Divider */}
            <div className="h-px bg-emerald-400 my-3"></div>
            
            {/* Secondary Links */}
            <button 
              onClick={() => {
                window.location.href = '/customer/login';
                setIsMenuOpen(false);
              }} 
              className="block px-3 py-2 text-emerald-100 hover:text-white w-full text-left text-sm"
            >
              Customer Portal
            </button>
            
            {/* CTA Buttons */}
            <div className="space-y-2 pt-2">
              <Button 
                variant="outline"
                onClick={() => {
                  window.location.href = '/consultation';
                  setIsMenuOpen(false);
                }} 
                className="w-full border-2 border-yellow-300 text-yellow-300 hover:bg-yellow-300 hover:text-emerald-600 font-semibold"
              >
                Custom Quote
              </Button>
              <Button 
                onClick={() => {
                  window.location.href = '/payment';
                  setIsMenuOpen(false);
                }} 
                className="w-full bg-white text-emerald-600 hover:bg-emerald-50"
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
