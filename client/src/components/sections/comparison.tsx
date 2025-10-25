import { Check, X } from "lucide-react";

export default function Comparison() {
  const features = [
    { name: "Number of Pages", basic: "Up to 5 pages", premium: "Up to 10 pages" },
    { name: "Mobile Responsive Design", basic: true, premium: true },
    { name: "SSL Security Certificate", basic: true, premium: true },
    { name: "Domain & Hosting", basic: true, premium: true },
    { name: "Basic SEO Setup", basic: true, premium: true },
    { name: "Advanced SEO Optimization", basic: false, premium: true },
    { name: "Google Business Setup", basic: false, premium: true },
    { name: "Custom Contact Forms", basic: false, premium: true },
    { name: "Social Media Integration", basic: "Basic", premium: "Advanced" },
    { name: "Revision Rounds", basic: "1 round", premium: "3 rounds" },
    { name: "Email Support", basic: true, premium: true },
    { name: "Priority Support", basic: false, premium: true },
    { name: "Content Management", basic: "Via email", premium: "Via email" },
    { name: "Delivery Time", basic: "~3 days", premium: "~3 days" },
    { name: "Monthly Maintenance", basic: true, premium: true },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Compare Our Packages
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the perfect package for your business needs
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
              <div className="p-6 border-r border-emerald-500"></div>
              <div className="p-6 border-r border-emerald-500 text-center">
                <h3 className="text-2xl font-bold mb-2">Basic</h3>
                <div className="text-3xl font-bold mb-1">£75</div>
                <div className="text-sm opacity-90">+ £10/month</div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <div className="text-3xl font-bold mb-1">£150</div>
                <div className="text-sm opacity-90">+ £10/month</div>
              </div>
            </div>

            {features.map((feature, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 ${
                  index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : "bg-white dark:bg-gray-800"
                }`}
              >
                <div className="p-4 font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                  {feature.name}
                </div>
                <div className="p-4 text-center border-r border-gray-200 dark:border-gray-700">
                  {typeof feature.basic === "boolean" ? (
                    feature.basic ? (
                      <Check className="w-6 h-6 text-emerald-600 mx-auto" data-testid={`check-basic-${index}`} />
                    ) : (
                      <X className="w-6 h-6 text-gray-400 mx-auto" data-testid={`x-basic-${index}`} />
                    )
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300" data-testid={`text-basic-${index}`}>
                      {feature.basic}
                    </span>
                  )}
                </div>
                <div className="p-4 text-center">
                  {typeof feature.premium === "boolean" ? (
                    feature.premium ? (
                      <Check className="w-6 h-6 text-emerald-600 mx-auto" data-testid={`check-premium-${index}`} />
                    ) : (
                      <X className="w-6 h-6 text-gray-400 mx-auto" data-testid={`x-premium-${index}`} />
                    )
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300" data-testid={`text-premium-${index}`}>
                      {feature.premium}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-6 mt-8">
            <a
              href="/payment?package=basic"
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              data-testid="button-select-basic"
            >
              Choose Basic
            </a>
            <a
              href="/payment?package=premium"
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors font-semibold"
              data-testid="button-select-premium"
            >
              Choose Premium
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
