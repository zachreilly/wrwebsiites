import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function FreeDemo() {
  return (
    <section id="free-demo" className="py-24 relative overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 box-border">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-emerald-50 border border-emerald-200 px-4 sm:px-6 py-2 rounded-full text-sm font-medium mb-6 text-emerald-700">
            Zero risk, zero commitment
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">
            Try Before You Buy
          </h2>
          <p className="text-base sm:text-lg text-black/70 max-w-2xl mx-auto leading-relaxed">
            We'll build your website for free first. Only pay if you're happy with the result.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center max-w-5xl mx-auto w-full">
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">How It Works</h3>
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Tell Us What You Need",
                  description: "Complete our onboarding form — choose your design, colours, and features."
                },
                {
                  step: "2",
                  title: "We Build Your Demo",
                  description: "We create your full website demo within 3–5 days. No payment required."
                },
                {
                  step: "3",
                  title: "Review & Decide",
                  description: "We send you a link to the finished website. Happy? Set up payment to go live."
                }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full">
            <div className="bg-white rounded-xl shadow-md border border-black/10 p-5 sm:p-8 w-full box-border">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5 text-center">Why Request a Free Demo?</h3>
              
              <div className="space-y-3 mb-8 w-full">
                {[
                  "See your actual website before paying",
                  "Make sure we understand your vision",
                  "Test our quality and service risk-free",
                  "Add logo creation for just £25",
                  "No pressure, no hidden fees"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3 w-full">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 break-words">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => window.location.href = '/onboarding?mode=demo'}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 sm:py-5 text-base rounded-lg transition-colors"
                data-testid="button-request-demo"
              >
                Request Your Free Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-center text-xs text-gray-400 mt-4">
                100% free — no credit card required
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
