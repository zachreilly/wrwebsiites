import Navigation from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import Hero from "@/components/sections/hero";
import Services from "@/components/sections/services";
import Pricing from "@/components/sections/pricing";
import Comparison from "@/components/sections/comparison";
import About from "@/components/sections/about";
import SocialProof from "@/components/sections/social-proof";
import FAQ from "@/components/sections/faq";
import Contact from "@/components/sections/contact";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Services />
      <Pricing />
      <Comparison />
      <About />
      <SocialProof />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}
