import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-primary to-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              🚀 Special Launch Pricing Available
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-balance">
              Professional Web Development for Your Business
            </h1>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              We help local businesses get online with simple, affordable websites that look great and work on all devices. Special launch pricing available now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => scrollToSection('contact')} 
                className="bg-accent text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-amber-400 transition-colors text-center"
                size="lg"
              >
                Contact Us
              </Button>
              <Button 
                onClick={() => scrollToSection('services')} 
                variant="outline"
                className="border-2 border-white bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors text-center"
                size="lg"
              >
                View Services
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm">
              <div className="text-3xl font-bold text-emerald-500 mb-2">24/7</div>
              <div className="text-slate-600">Support Available</div>
              <div className="text-sm text-slate-500 mt-2">We're here when you need us</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
