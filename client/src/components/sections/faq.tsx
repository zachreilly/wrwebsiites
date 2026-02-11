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
      answer: "Typical turnaround is 1–3 days for Basic packages and 2–4 days for Premium. We pride ourselves on fast, professional delivery."
    },
    {
      question: "What's included in the monthly fee?",
      answer: "Your monthly fee covers domain registration and renewal, secure web hosting with 99.9% uptime, SSL security certificate, regular security updates, technical support, and basic content updates."
    },
    {
      question: "Do I need to provide the content?",
      answer: "Yes, you provide the content (text, images, business information) and we handle the design and structure. During onboarding, we'll guide you through exactly what we need."
    },
    {
      question: "Can I make changes after the website is built?",
      answer: "Yes. Just email us your changes and we'll implement them — usually within 24 hours. Major redesigns can be quoted separately."
    },
    {
      question: "What's the difference between Basic and Premium?",
      answer: "Basic gives you up to 3 pages with essential features. Premium includes unlimited pages, advanced SEO, Google Business setup, custom forms, priority support, and 3 revision rounds. Both include hosting and responsive design."
    },
    {
      question: "Can I upgrade from Basic to Premium later?",
      answer: "Yes. We'll credit your original setup fee and charge the difference. Your existing content will be enhanced with Premium features."
    },
    {
      question: "How does payment work?",
      answer: "We use GoCardless for secure direct debit payments. You pay the setup fee upfront, then the monthly fee automatically. You can pay before we start or after you approve the finished site."
    },
    {
      question: "What if I want to cancel?",
      answer: "You can cancel anytime with 30 days' notice. Your website stays live until the end of your billing period."
    }
  ];

  return (
    <section className="py-24 w-full overflow-hidden">
      <div className="container mx-auto px-4 box-border">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-black">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-black/60 max-w-2xl mx-auto">
            Everything you need to know about our services
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-black/10">
                <AccordionTrigger 
                  className="text-left text-base sm:text-lg font-medium text-black hover:text-emerald-700"
                  data-testid={`faq-question-${index}`}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-sm leading-relaxed" data-testid={`faq-answer-${index}`}>
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
