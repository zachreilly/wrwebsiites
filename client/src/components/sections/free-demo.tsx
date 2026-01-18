import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { ScrollAnimation } from "@/components/ScrollAnimation";

export default function FreeDemo() {
  return (
    <section id="free-demo" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollAnimation>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gradient-box px-6 py-3 rounded-full text-lg font-bold mb-6 text-black hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 mr-2 text-red-600" />
              Zero Risk • Zero Commitment
            </div>
            <h2 className="text-5xl font-bold text-black mb-6 leading-tight">
              Try Before You Buy with a<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">
                FREE Demo Website
              </span>
            </h2>
            <p className="text-xl text-black/90 max-w-3xl mx-auto leading-relaxed">
              Not sure yet? We'll build your entire website for free first. Only pay if you love it!
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: How it Works */}
          <ScrollAnimation delay={0.1}>
            <div>
              <h3 className="text-3xl font-bold text-black mb-8">How It Works</h3>
              <div className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "Tell Us What You Need",
                    description: "Complete the same onboarding form as our paid customers - choose your design, colors, and features"
                  },
                  {
                    step: "2",
                    title: "We Build Your Demo FREE",
                    description: "We create your full website demo within 3-5 days. No payment, no credit card required"
                  },
                  {
                    step: "3",
                    title: "Review & Decide",
                    description: "See the actual website in your customer portal. Love it? Set up payment to make it live!"
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-black mb-1">{item.title}</h4>
                      <p className="text-black/80 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimation>

          {/* Right: Benefits Card */}
          <ScrollAnimation delay={0.2}>
            <div className="gradient-box rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">Why Request a Free Demo?</h3>
              </div>
              
              <div className="space-y-4 mb-8">
                {[
                  "See your actual website before paying a penny",
                  "Make sure we understand your vision",
                  "Test our quality and service risk-free",
                  "Add professional logo creation for just £25",
                  "No pressure, no hidden fees, no commitments"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-black font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => window.location.href = '/onboarding?mode=demo'}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                data-testid="button-request-demo"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Request Your FREE Demo Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-center text-sm text-black/60 mt-4">
                💯 100% Free • No Credit Card Required • No Obligations
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
