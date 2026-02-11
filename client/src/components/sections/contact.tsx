import { Phone, Mail, Clock, ArrowRight } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-24 relative w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 box-border">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">Get In Touch</h2>
          <p className="text-base sm:text-lg text-black/70 max-w-2xl mx-auto">
            Ready to get your business online? Contact us to discuss your website needs.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Phone,
                title: "Call Us",
                description: "Speak with us directly about your project",
                content: <a href="tel:07535778637" className="block text-emerald-600 font-semibold text-lg hover:text-emerald-700 transition-colors">07535778637</a>
              },
              {
                icon: Mail,
                title: "Email Us",
                description: "Send us your project details",
                content: <a href="https://mail.google.com/mail/?view=cm&to=zachhreillyy@gmail.com" target="_blank" rel="noopener noreferrer" className="block text-emerald-600 font-semibold hover:text-emerald-700 transition-colors break-all">zachhreillyy@gmail.com</a>
              },
              {
                icon: Clock,
                title: "Response Time",
                description: "We typically respond within 2 hours during business hours",
                content: null
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md border border-black/10 p-6 h-full">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                {item.content}
              </div>
            ))}
          </div>

          <div className="bg-emerald-700 p-6 sm:p-8 md:p-10 rounded-xl text-center">
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">Ready to Get Started?</h3>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
              Get your professional website today and start attracting more customers online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/onboarding'}
                className="bg-white text-emerald-700 px-8 py-3 rounded-lg font-semibold hover:bg-white/95 transition-colors flex items-center justify-center gap-2"
              >
                Get Your Website Today
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => window.location.href = '/onboarding?mode=demo'}
                className="border border-white/30 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Try Free Demo First
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
