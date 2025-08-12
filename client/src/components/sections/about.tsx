import { CheckCircle, Zap, Headphones } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Why Choose wrwebsites?</h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              We help local businesses get online with professional, affordable websites. Our special launch pricing means you get professional quality for a fraction of the usual cost.
            </p>
            
            <div className="space-y-6">

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Lightning Fast</h3>
                  <p className="text-slate-600">Optimised websites that load quickly and rank well in search engines.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Headphones className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Ongoing Support</h3>
                  <p className="text-slate-600">We're here when you need us with reliable support and maintenance.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-gradient-to-br from-slate-100 to-white rounded-xl p-8 shadow-lg">
              <h4 className="text-2xl font-bold text-slate-900 mb-4">Why Local Businesses Choose Us</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h5 className="font-semibold text-slate-800">Affordable Pricing</h5>
                    <p className="text-slate-600 text-sm">Launch rates while we build our portfolio</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h5 className="font-semibold text-slate-800">Local Support</h5>
                    <p className="text-slate-600 text-sm">Direct contact with friendly, local team</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h5 className="font-semibold text-slate-800">Fast Delivery</h5>
                    <p className="text-slate-600 text-sm">Your site live in days, not weeks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
