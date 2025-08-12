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
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              We help local businesses get online with simple, affordable websites that look great and work on all devices. Special launch pricing available now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => scrollToSection('contact')} 
                className="bg-accent text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-amber-400 transition-colors text-center"
                size="lg"
              >
                Get Free Quote
              </Button>
              <Button 
                onClick={() => scrollToSection('services')} 
                variant="outline"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors text-center"
                size="lg"
              >
                View Services
              </Button>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Professional web development team collaborating" 
              className="rounded-xl shadow-2xl w-full" 
            />
            
            {/* Floating achievement cards */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-xl hidden lg:block">
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-slate-600">Projects Completed</div>
            </div>
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-lg shadow-xl hidden lg:block">
              <div className="text-2xl font-bold text-emerald-500">24/7</div>
              <div className="text-sm text-slate-600">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
