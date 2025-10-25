import { Users, Star, Clock, TrendingUp } from "lucide-react";

export default function SocialProof() {
  const stats = [
    {
      icon: Users,
      number: "10+",
      label: "Websites Launched",
      description: "Happy clients across the UK"
    },
    {
      icon: Star,
      number: "5.0",
      label: "Average Rating",
      description: "Client satisfaction score"
    },
    {
      icon: Clock,
      number: "3 Days",
      label: "Average Delivery",
      description: "Fast turnaround time"
    },
    {
      icon: TrendingUp,
      number: "98%",
      label: "Client Retention",
      description: "Ongoing partnerships"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="text-center text-white"
                data-testid={`stat-card-${index}`}
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                    <Icon className="w-8 h-8" data-testid={`icon-${index}`} />
                  </div>
                </div>
                <div className="text-4xl font-bold mb-2" data-testid={`stat-number-${index}`}>
                  {stat.number}
                </div>
                <div className="text-xl font-semibold mb-1" data-testid={`stat-label-${index}`}>
                  {stat.label}
                </div>
                <div className="text-sm opacity-90" data-testid={`stat-description-${index}`}>
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
