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
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
              wrwebsites
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-1">
              {/* Main Navigation Links */}
              <button 
                onClick={() => scrollToSection('home')} 
                className="text-slate-700 hover:text-emerald-600 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-emerald-50"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('services')} 
                className="text-slate-700 hover:text-emerald-600 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-emerald-50"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="text-slate-700 hover:text-emerald-600 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-emerald-50"
              >
                Pricing
              </button>
              <button 
                onClick={() => window.location.href = '/portfolio'} 
                className="text-slate-700 hover:text-emerald-600 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-emerald-50"
                data-testid="button-portfolio"
              >
                Portfolio
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="text-slate-700 hover:text-emerald-600 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-emerald-50"
              >
                About
              </button>
              
              {/* Divider */}
              <div className="h-6 w-px bg-slate-300 mx-4"></div>
              
              {/* Secondary Links */}
              <button 
                onClick={() => window.location.href = '/customer/login'} 
                className="text-slate-600 hover:text-slate-800 px-3 py-2 text-sm font-medium transition-colors"
                data-testid="button-customer-portal"
              >
                Customer Portal
              </button>
              
              {/* CTA Buttons */}
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/consultation'} 
                className="ml-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
              >
                Custom Quote
              </Button>
              <Button 
                onClick={() => window.location.href = '/payment'} 
                className="ml-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-emerald-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200">
          <div className="px-4 pt-4 pb-4 space-y-2">
            {/* Main Navigation */}
            <div className="space-y-1">
              <button 
                onClick={() => scrollToSection('home')} 
                className="block px-3 py-2 text-slate-700 hover:text-emerald-600 w-full text-left rounded-lg hover:bg-emerald-50 font-medium transition-all"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('services')} 
                className="block px-3 py-2 text-slate-700 hover:text-emerald-600 w-full text-left rounded-lg hover:bg-emerald-50 transition-all"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="block px-3 py-2 text-slate-700 hover:text-emerald-600 w-full text-left rounded-lg hover:bg-emerald-50 transition-all"
              >
                Pricing
              </button>
              <button 
                onClick={() => {
                  window.location.href = '/portfolio';
                  setIsMenuOpen(false);
                }} 
                className="block px-3 py-2 text-slate-700 hover:text-emerald-600 w-full text-left rounded-lg hover:bg-emerald-50 transition-all"
                data-testid="button-portfolio-mobile"
              >
                Portfolio
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="block px-3 py-2 text-slate-700 hover:text-emerald-600 w-full text-left rounded-lg hover:bg-emerald-50 transition-all"
              >
                About
              </button>
            </div>
            
            {/* Divider */}
            <div className="h-px bg-slate-200 my-3"></div>
            
            {/* Secondary Links */}
            <button 
              onClick={() => {
                window.location.href = '/customer/login';
                setIsMenuOpen(false);
              }} 
              className="block px-3 py-2 text-slate-600 hover:text-slate-800 w-full text-left text-sm"
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
                className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                Custom Quote
              </Button>
              <Button 
                onClick={() => {
                  window.location.href = '/payment';
                  setIsMenuOpen(false);
                }} 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
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
