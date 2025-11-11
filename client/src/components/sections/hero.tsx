import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-primary to-secondary text-white min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex justify-center items-center">
          <div className="text-center max-w-4xl">
            <div className="inline-flex items-center bg-green-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              🚀 Special Launch Pricing Available
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-balance">
              Professional Web Development for Your Business
            </h1>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">We help businesses get online with simple, affordable websites that look great and work on all devices. Special launch pricing available now.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/onboarding'} 
                className="bg-accent text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-amber-400 transition-colors text-center"
                size="lg"
              >
                Get Started - Tell Us About Your Project
              </Button>
              <Button 
                onClick={() => scrollToSection('contact')} 
                variant="outline"
                className="border-2 border-white bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors text-center"
                size="lg"
              >
                Contact Us Directly
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
