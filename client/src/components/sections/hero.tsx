import { ArrowRight, CheckCircle } from "lucide-react";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative text-white min-h-screen flex items-center overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full relative z-10 box-border">
        <div className="flex justify-center items-center">
          <div className="text-center max-w-4xl">
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium mb-6 sm:mb-8 text-white/80 border border-white/20">
                Introductory pricing available
              </div>
            
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight break-words">
                Get a Professional Website
                <span className="block mt-2 text-white/90">
                  That Brings You More Customers
                </span>
              </h1>
            
              <p className="text-lg sm:text-xl md:text-2xl mb-8 leading-relaxed text-white/80 max-w-3xl mx-auto">
                A great website helps potential customers find you online, trust your business, and get in touch. We make it simple and affordable.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-6 mb-8 sm:mb-10 text-sm md:text-base">
                {[
                  "More enquiries from local searches",
                  "Professional first impression",
                  "Works on all devices"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => window.location.href = '/onboarding'} 
                  className="w-full sm:w-auto bg-white text-emerald-700 px-8 md:px-10 py-4 md:py-5 rounded-lg font-semibold text-lg hover:bg-white/95 transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  Get Your Website Today
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => scrollToSection('pricing')} 
                  className="w-full sm:w-auto border-2 border-white/30 bg-white/10 backdrop-blur-sm px-8 md:px-10 py-4 md:py-5 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all text-center"
                >
                  View Pricing
                </button>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-white/60 text-xs sm:text-sm">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  Free demo available
                </span>
                <span className="hidden sm:inline">|</span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  No upfront payment
                </span>
                <span className="hidden sm:inline">|</span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  Live in days, not weeks
                </span>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}
