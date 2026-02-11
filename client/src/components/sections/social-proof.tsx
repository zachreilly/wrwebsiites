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
    <section className="py-12 bg-emerald-700/90">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="text-center text-white"
                data-testid={`stat-card-${index}`}
              >
                <div className="flex justify-center mb-2 sm:mb-3">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white/70" data-testid={`icon-${index}`} />
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-1" data-testid={`stat-number-${index}`}>
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm font-medium text-white/90" data-testid={`stat-label-${index}`}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
