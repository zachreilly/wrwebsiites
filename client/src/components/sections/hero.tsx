import { Button } from "@/components/ui/button";
import { FloatingShapes } from "@/components/FloatingShapes";
import { RotatingGeometry } from "@/components/RotatingGeometry";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { Parallax } from "@/components/Parallax";
import { Button3D } from "@/components/Button3D";
import { FloatingElements } from "@/components/FloatingElements";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative text-white min-h-screen flex items-center overflow-hidden w-full px-0">
      <FloatingShapes />
      <FloatingElements count={2} size="large" />
      <Parallax speed={0.3}>
        <RotatingGeometry />
      </Parallax>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full relative z-10 box-border">
        <div className="flex justify-center items-center">
          <div className="text-center max-w-5xl">
            <ScrollAnimation delay={0.1}>
              <div className="inline-flex items-center bg-gradient-to-r from-red-600 to-rose-500 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base md:text-lg font-bold mb-6 sm:mb-8 text-white shadow-xl hover:scale-105 transition-transform duration-200">
                50% OFF Launch Special - Limited Time Only
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation delay={0.2}>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight break-words px-2">
                Get a Professional Website
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-yellow-300">
                  That Brings You More Customers
                </span>
              </h1>
            </ScrollAnimation>
            
            <ScrollAnimation delay={0.3}>
              <p className="text-lg sm:text-xl md:text-2xl mb-6 leading-relaxed text-white/90 max-w-3xl mx-auto">
                A great website helps potential customers find you online, trust your business, and get in touch. We make it simple and affordable.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 md:gap-6 mb-8 sm:mb-10 text-sm md:text-base">
                {[
                  "More enquiries from local searches",
                  "Professional first impression",
                  "Works on all devices"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/90">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
                <Button3D
                  onClick={() => window.location.href = '/onboarding'} 
                  className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-rose-500 text-white px-8 md:px-12 py-5 md:py-6 rounded-xl font-bold text-lg md:text-xl hover:from-red-700 hover:to-rose-600 transition-all shadow-2xl hover:shadow-red-500/30 flex items-center justify-center gap-3"
                >
                  Get Your Website Today
                  <ArrowRight className="w-6 h-6" />
                </Button3D>
                
                <Button3D
                  onClick={() => scrollToSection('pricing')} 
                  className="w-full sm:w-auto border-3 border-white bg-white/10 backdrop-blur-sm px-8 md:px-10 py-5 md:py-6 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all text-center shadow-xl"
                >
                  View Pricing
                </Button3D>
              </div>
              
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-white/70 text-xs sm:text-sm">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Free demo available
                </span>
                <span className="hidden sm:inline">|</span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  No upfront payment
                </span>
                <span className="hidden sm:inline">|</span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Live in days, not weeks
                </span>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}
