import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Local Business Owner",
      content: "WebCraft Pro delivered exactly what we needed - a professional website that perfectly represents our business. The team was responsive and the quality exceeded our expectations."
    },
    {
      name: "Mike Chen",
      role: "Restaurant Owner",
      content: "Outstanding service and results! Our new website has increased our online inquiries by 200%. Highly recommend WebCraft Pro for any business looking to grow online."
    },
    {
      name: "Emma Wilson",
      role: "Business Consultant",
      content: "Professional, reliable, and affordable. WebCraft Pro created a beautiful website for our consultancy that perfectly captures our brand. The ongoing support has been excellent."
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">What Our Clients Say</h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600">Join the growing number of businesses trusting us with their web presence</p>
        </div>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-5 sm:p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-accent space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-slate-300 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
