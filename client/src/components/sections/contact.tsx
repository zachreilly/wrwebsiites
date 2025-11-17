import { Phone, Mail, Clock } from "lucide-react";
import { ScrollAnimation } from "@/components/ScrollAnimation";

export default function Contact() {
  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation>
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-black mb-6">Get In Touch</h2>
            <p className="text-xl text-black/90 max-w-3xl mx-auto">
              Ready to get your business online? Contact us directly via phone or email to discuss your website needs.
            </p>
          </div>
        </ScrollAnimation>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: Phone,
                title: "Call Us Direct",
                description: "Speak with us directly about your project",
                content: <a href="tel:07535778637" className="block text-accent font-medium hover:text-red-600">07535778637</a>
              },
              {
                icon: Mail,
                title: "Email Us Direct",
                description: "Send us your project details",
                content: <a href="https://mail.google.com/mail/?view=cm&to=zachhreillyy@gmail.com" target="_blank" rel="noopener noreferrer" className="block text-accent font-medium hover:text-red-600">zachhreillyy@gmail.com</a>
              },
              {
                icon: Clock,
                title: "Response Time",
                description: "We typically respond within 2 hours during business hours",
                content: null
              }
            ].map((item, i) => (
              <ScrollAnimation key={i} delay={i * 0.1}>
                <div className="flex items-start space-x-4 hover:scale-105 transition-transform duration-200">
                  <div className="w-12 h-12 gradient-box rounded-lg flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-2">{item.title}</h4>
                    <p className="text-black/80 mb-2">{item.description}</p>
                    {item.content}
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>

          <ScrollAnimation delay={0.4}>
            <div className="p-6 gradient-box rounded-xl text-center shadow-2xl hover:scale-102 transition-transform duration-200">
              <h4 className="font-semibold mb-2 text-black">🎉 Limited Time Launch Special</h4>
              <p className="text-black/90">50% off all website packages. Don't miss out on this exclusive offer for new clients.</p>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
