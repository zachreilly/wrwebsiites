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
            🎉 Special Launch Pricing - Limited Time
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Transparent Pricing</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Professional web development at unbeatable launch prices. Get started with your new website today.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Basic Package */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter Website</h3>
              <p className="text-slate-600 mb-6">Perfect for small businesses and personal brands</p>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                £299
                <span className="text-base font-normal text-slate-500 line-through ml-2">£599</span>
              </div>
              <div className="text-accent font-semibold">Launch Special - 50% Off</div>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                Up to 5 pages
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                Mobile responsive design
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                Basic SEO optimization
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                Contact form
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                1 year hosting included
              </li>
            </ul>
            <Button 
              onClick={scrollToContact}
              className="w-full bg-slate-900 text-white hover:bg-slate-800"
              size="lg"
            >
              Choose Starter
            </Button>
          </div>

          {/* Professional Package - Featured */}
          <div className="bg-white p-8 rounded-xl shadow-xl border-2 border-primary relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">Most Popular</div>
            </div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Professional Website</h3>
              <p className="text-slate-600 mb-6">Complete solution for growing businesses</p>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                £599
                <span className="text-base font-normal text-slate-500 line-through ml-2">£1,199</span>
              </div>
              <div className="text-accent font-semibold">Launch Special - 50% Off</div>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                Up to 10 pages
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                Custom design & branding
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                Advanced SEO optimization
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                Contact forms & integrations
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                1 year hosting & SSL
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                3 months free support
              </li>
            </ul>
            <Button 
              onClick={scrollToContact}
              className="w-full bg-primary text-white hover:bg-secondary"
              size="lg"
            >
              Choose Professional
            </Button>
          </div>

          {/* Enterprise Package */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Enterprise Website</h3>
              <p className="text-slate-600 mb-6">Full-scale solution for established businesses</p>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                £999
                <span className="text-base font-normal text-slate-500 line-through ml-2">£1,999</span>
              </div>
              <div className="text-accent font-semibold">Launch Special - 50% Off</div>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                Unlimited pages
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                Premium custom design
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                Advanced functionality
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                E-commerce ready
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                Premium hosting & CDN
              </li>
              <li className="flex items-center text-slate-600">
                <span className="text-emerald-500 mr-3">✓</span>
                6 months free support
              </li>
            </ul>
            <Button 
              onClick={scrollToContact}
              className="w-full bg-slate-900 text-white hover:bg-slate-800"
              size="lg"
            >
              Choose Enterprise
            </Button>
          </div>
        </div>

        {/* Additional pricing info */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">All packages include responsive design, SEO optimization, and professional support</p>
          <div className="inline-flex items-center space-x-6 text-sm text-slate-500">
            <span className="flex items-center"><span className="text-emerald-500 mr-2">✓</span>No hidden fees</span>
            <span className="flex items-center"><span className="text-emerald-500 mr-2">✓</span>30-day money back</span>
            <span className="flex items-center"><span className="text-emerald-500 mr-2">✓</span>Free consultations</span>
          </div>
        </div>
      </div>
    </section>
  );
}
