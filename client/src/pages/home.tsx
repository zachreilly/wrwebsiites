import Navigation from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import Hero from "@/components/sections/hero";
import Services from "@/components/sections/services";
import Pricing from "@/components/sections/pricing";
import About from "@/components/sections/about";
import Contact from "@/components/sections/contact";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Services />
      <Pricing />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
