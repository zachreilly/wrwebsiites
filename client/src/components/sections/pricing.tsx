import { Button } from "@/components/ui/button";

export default function Pricing() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="pricing" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
            Special Launch Rates
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Pricing – Special Launch Rates</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Right now, our prices are much lower than usual because we're just starting our business and building up our portfolio. This is a great opportunity to get a professional website for a fraction of the usual cost.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Basic Package */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Basic Static Website</h3>
              <p className="text-slate-600 mb-6">A professional 1–3 page site to get your business online</p>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                £50
                <span className="text-sm font-normal text-slate-600 ml-2">setup</span>
              </div>
              <div className="text-lg font-semibold text-slate-900">+ £10 per month</div>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                1-3 pages
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                Mobile responsive design
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                Domain registration included
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                Secure hosting included
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                Ongoing support
              </li>
            </ul>
            <Button 
              onClick={scrollToContact}
              className="w-full bg-slate-900 text-white hover:bg-slate-800"
              size="lg"
            >
              Choose Basic
            </Button>
          </div>

          {/* Premium Package - Featured */}
          <div className="bg-white p-8 rounded-xl shadow-xl border-2 border-primary relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">Most Popular</div>
            </div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Premium Static Website</h3>
              <p className="text-slate-600 mb-6">A more customised, multi-page site with extra features to showcase your business in style</p>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                £150
                <span className="text-sm font-normal text-slate-600 ml-2">setup</span>
              </div>
              <div className="text-lg font-semibold text-slate-900">+ £10 per month</div>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                Multi-page website
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                Custom design & styling
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                Enhanced functionality
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                Domain registration included
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                Secure hosting included
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                Ongoing support
              </li>
            </ul>
            <Button 
              onClick={scrollToContact}
              className="w-full bg-primary text-white hover:bg-secondary"
              size="lg"
            >
              Choose Premium
            </Button>
          </div>
        </div>

        {/* Additional pricing info */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">Both packages include domain registration, secure hosting, and ongoing support</p>
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-xl max-w-2xl mx-auto">
            <h4 className="font-semibold mb-2">Why Choose Us?</h4>
            <ul className="text-sm space-y-1 text-blue-100">
              <li>• Affordable launch pricing — pay less now for the same professional quality</li>
              <li>• Perfect for local businesses who want a simple, stress-free way to get online</li>
              <li>• Fast turnaround — your site can be live in days, not weeks</li>
              <li>• Friendly, local support whenever you need it</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
