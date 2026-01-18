import { Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { ScrollAnimation } from "@/components/ScrollAnimation";

export default function Contact() {
  return (
    <section id="contact" className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">Get In Touch</h2>
            <p className="text-lg md:text-xl text-black/90 max-w-3xl mx-auto">
              Ready to get your business online? Contact us directly via phone or email to discuss your website needs.
            </p>
          </div>
        </ScrollAnimation>

        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            {[
              {
                icon: Phone,
                title: "Call Us Direct",
                description: "Speak with us directly about your project",
                content: <a href="tel:07535778637" className="block text-accent font-bold text-lg hover:text-red-600 transition-colors">07535778637</a>
              },
              {
                icon: Mail,
                title: "Email Us Direct",
                description: "Send us your project details",
                content: <a href="https://mail.google.com/mail/?view=cm&to=zachhreillyy@gmail.com" target="_blank" rel="noopener noreferrer" className="block text-accent font-bold hover:text-red-600 transition-colors break-all">zachhreillyy@gmail.com</a>
              },
              {
                icon: Clock,
                title: "Response Time",
                description: "We typically respond within 2 hours during business hours",
                content: null
              }
            ].map((item, i) => (
              <ScrollAnimation key={i} delay={i * 0.1}>
                <div className="gradient-box p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 h-full">
                  <div className="w-12 h-12 bg-black/10 rounded-lg flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-black" />
                  </div>
                  <h4 className="font-bold text-black mb-2 text-lg">{item.title}</h4>
                  <p className="text-black/80 mb-3">{item.description}</p>
                  {item.content}
                </div>
              </ScrollAnimation>
            ))}
          </div>

          <ScrollAnimation delay={0.4}>
            <div className="bg-gradient-to-r from-red-600 to-rose-500 p-8 md:p-10 rounded-2xl shadow-2xl text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Get Started?</h3>
              <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
                Don't let another day pass without a professional online presence. Get your website today and start attracting more customers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.location.href = '/onboarding'}
                  className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                >
                  Get Your Website Today
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => window.location.href = '/onboarding?mode=demo'}
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
                >
                  Try Free Demo First
                </button>
              </div>
              <p className="text-white/70 text-sm mt-6">50% off all packages - Limited time launch special!</p>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
