import { Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">Get In Touch</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Ready to get your business online? Contact us directly via phone or email to discuss your website needs.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Call Us Direct</h4>
                <p className="text-slate-600 mb-2">Speak with us directly about your project</p>
                <div className="space-y-1">
                  <a href="tel:07397985279" className="block text-primary font-medium hover:text-secondary">07397985279</a>
                  <a href="tel:07535778637" className="block text-primary font-medium hover:text-secondary">07535778637</a>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Email Us Direct</h4>
                <p className="text-slate-600 mb-2">Send us your project details</p>
                <a href="mailto:zachhreillyy@gmail.com" className="block text-primary font-medium hover:text-secondary">zachhreillyy@gmail.com</a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Response Time</h4>
                <p className="text-slate-600">We typically respond within 2 hours during business hours</p>
              </div>
            </div>
          </div>

          {/* Special Offer Highlight */}
          <div className="p-6 bg-gradient-to-r from-red-500 to-red-600 rounded-xl text-white text-center">
            <h4 className="font-semibold mb-2">🎉 Limited Time Launch Special</h4>
            <p className="text-red-100">50% off all website packages. Don't miss out on this exclusive offer for new clients.</p>
          </div>
        </div>
      </div>
    </section>
  );
}