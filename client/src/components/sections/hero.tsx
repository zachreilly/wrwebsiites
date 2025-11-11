import { Button } from "@/components/ui/button";
import { FloatingShapes } from "@/components/FloatingShapes";
import { RotatingGeometry } from "@/components/RotatingGeometry";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { Parallax } from "@/components/Parallax";
import { Button3D } from "@/components/Button3D";
import { FloatingElements } from "@/components/FloatingElements";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative text-white min-h-screen flex items-center overflow-hidden">
      <FloatingShapes />
      <FloatingElements count={2} size="large" />
      <Parallax speed={0.3}>
        <RotatingGeometry />
      </Parallax>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative z-10">
        <div className="flex justify-center items-center">
          <div className="text-center max-w-4xl">
            <ScrollAnimation delay={0.1}>
              <div className="inline-flex items-center glass px-4 py-2 rounded-full text-sm font-medium mb-6 text-white hover:scale-105 transition-transform duration-200">
                🚀 Special Launch Pricing Available
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation delay={0.2}>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-balance">
                Professional Web Development for Your Business
              </h1>
            </ScrollAnimation>
            
            <ScrollAnimation delay={0.3}>
              <p className="text-xl mb-8 leading-relaxed text-[#323232]">We help businesses get online with simple, affordable websites that look great and work on all devices. Special launch pricing available now.</p>
            </ScrollAnimation>
            
            <ScrollAnimation delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button3D
                  onClick={() => window.location.href = '/onboarding'} 
                  className="bg-accent text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-amber-400 transition-all text-center shadow-2xl"
                >
                  Get Started - Tell Us About Your Project
                </Button3D>
                
                <Button3D
                  onClick={() => scrollToSection('contact')} 
                  className="border-2 border-white glass-strong px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all text-center shadow-2xl"
                >
                  Contact Us Directly
                </Button3D>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}
