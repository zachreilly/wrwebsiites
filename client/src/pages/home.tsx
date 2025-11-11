import Navigation from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import Hero from "@/components/sections/hero";
import Services from "@/components/sections/services";
import Pricing from "@/components/sections/pricing";
import Comparison from "@/components/sections/comparison";
import About from "@/components/sections/about";
import FAQ from "@/components/sections/faq";
import Contact from "@/components/sections/contact";
import InteractiveCursor from "@/components/InteractiveCursor";
import { AnimatedGradientMesh } from "@/components/AnimatedGradientMesh";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <AnimatedGradientMesh opacity={0.12} speed={0.0008} />
      <InteractiveCursor />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded">
        Skip to main content
      </a>
      <header className="relative z-20">
        <Navigation />
      </header>
      <main id="main-content" className="relative z-10">
        <Hero />
        <Services />
        <Pricing />
        <Comparison />
        <About />
        <FAQ />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
