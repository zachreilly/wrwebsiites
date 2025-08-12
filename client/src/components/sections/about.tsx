import { CheckCircle, Zap, Headphones } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Why Choose WebCraft Pro?</h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              We're passionate about creating exceptional web experiences that help businesses grow. Our expertise and commitment to quality sets us apart.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Proven Expertise</h3>
                  <p className="text-slate-600">Years of experience delivering high-quality websites that perform.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Lightning Fast</h3>
                  <p className="text-slate-600">Optimized websites that load quickly and rank well in search engines.</p>
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
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Small business owners collaborating with laptops in modern workspace" 
              className="rounded-xl shadow-lg w-full" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
