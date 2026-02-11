import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "How long does it take to build my website?",
      answer: "Typical turnaround time is just 3 days! We pride ourselves on fast, professional delivery. For Basic packages, expect your site within 1-3 days. Premium packages are typically delivered within 2-4 days. Rush requests can often be accommodated - just contact us!"
    },
    {
      question: "What's included in the monthly £10 fee?",
      answer: "Your monthly fee covers everything you need to keep your site running smoothly: domain registration and renewal, secure web hosting with 99.9% uptime, SSL security certificate, regular security updates, technical support, and basic content updates. It's worry-free website maintenance!"
    },
    {
      question: "Do I need to provide the content for my website?",
      answer: "Yes, you provide the content (text, images, business information) and we provide the professional structure and design. During onboarding, we'll guide you through exactly what we need. Don't worry if you're not sure - we'll help you organize everything!"
    },
    {
      question: "Can I make changes to my website after it's built?",
      answer: "Absolutely! While you can't edit the site directly yourself, we make it easy to request updates. Just email us your changes and we'll implement them quickly - usually within 24 hours. Major redesigns can be quoted separately."
    },
    {
      question: "What's the difference between Basic and Premium packages?",
      answer: "Basic is perfect for simple business sites - up to 5 pages with essential features and 1 revision round. Premium gives you more pages (up to 10), advanced SEO, Google Business setup, custom contact forms, priority support, and 3 revision rounds. Both include hosting, domain, and mobile-responsive design."
    },
    {
      question: "Do you offer refunds if I'm not satisfied?",
      answer: "We're committed to your satisfaction! We include revision rounds in every package to ensure you love your site. If there are issues, we'll work with you to make it right. Contact us at zachhreillyy@gmail.com to discuss any concerns."
    },
    {
      question: "Can I upgrade from Basic to Premium later?",
      answer: "Yes! You can upgrade anytime. We'll credit your original setup fee and charge the difference. Your existing content will be enhanced with Premium features like advanced SEO and additional pages."
    },
    {
      question: "What if I need a custom website beyond your packages?",
      answer: "We offer custom quotes for larger projects! Visit our Custom Quote page to describe your requirements. We'll provide a personalized estimate for unique features, e-commerce functionality, member areas, or complex designs."
    },
    {
      question: "How does the payment process work?",
      answer: "We use GoCardless for secure direct debit payments. You'll pay the setup fee (£75 or £150) upfront, then £10/month automatically. You can pay before we start building or after you approve the finished site - your choice! All payments are secure and UK-based."
    },
    {
      question: "What happens if I want to cancel my monthly subscription?",
      answer: "You can cancel anytime with 30 days notice. Your website will remain live until the end of your billing period. We can also provide you with website files if you want to move hosting elsewhere (additional fees may apply)."
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-black">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-black/80 max-w-2xl mx-auto">
            Everything you need to know about our services
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger 
                  className="text-left text-base sm:text-lg font-semibold text-black hover:text-emerald-700"
                  data-testid={`faq-question-${index}`}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-black/80 text-base leading-relaxed" data-testid={`faq-answer-${index}`}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
