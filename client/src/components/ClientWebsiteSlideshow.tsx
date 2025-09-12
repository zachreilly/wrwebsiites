import { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface ClientWebsite {
  name: string;
  url: string;
  description: string;
  industry: string;
}

const CLIENT_WEBSITES: ClientWebsite[] = [
  {
    name: "Plumb Perfect",
    url: "https://plumb-perfect-zachreilly06.replit.app",
    description: "Professional plumbing services with emergency call-outs and quality workmanship",
    industry: "Plumbing Services"
  },
  {
    name: "The Barbershop",
    url: "https://TheBarbershop.replit.app",
    description: "Traditional barbering with modern style and professional grooming services",
    industry: "Beauty & Grooming"
  },
  {
    name: "Ainsworth Farm Cattery",
    url: "https://Ainsworthfarm-Cattery.replit.app",
    description: "Premium cat boarding services in a comfortable, caring environment",
    industry: "Pet Care"
  },
  {
    name: "Meat Like It Used To Be Co",
    url: "https://MeatLikeItUsedToBeCo.replit.app",
    description: "Premium quality meats sourced locally with traditional butchery methods",
    industry: "Food & Butchery"
  }
];

export default function ClientWebsiteSlideshow() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'center',
      skipSnaps: false,
      dragFree: false
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      // Optional: Add any additional setup here
    }
  }, [emblaApi]);

  return (
    <div className="bg-white py-16 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-slideshow-title">
            Featured Client Websites
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Take a look at some of the professional websites we've built for our clients across various industries
          </p>
        </div>

        {/* Slideshow Container */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef} data-testid="slideshow-container">
            <div className="flex">
              {CLIENT_WEBSITES.map((website, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 pl-4">
                  <Card className="mx-auto max-w-4xl overflow-hidden shadow-lg">
                    <CardContent className="p-0">
                      {/* Website Preview */}
                      <div className="aspect-video bg-gray-100 relative overflow-hidden">
                        <iframe
                          src={website.url}
                          title={`Preview of ${website.name}`}
                          className="w-full h-full border-0"
                          loading="lazy"
                          data-testid={`iframe-website-${index}`}
                        />
                        {/* Overlay for better visibility of controls */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200" />
                      </div>
                      
                      {/* Website Info */}
                      <div className="p-6 bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-2xl font-bold text-gray-900" data-testid={`text-website-name-${index}`}>
                                {website.name}
                              </h3>
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full">
                                {website.industry}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4 text-lg">
                              {website.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                          <Button 
                            onClick={() => window.open(website.url, '_blank')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            data-testid={`button-visit-website-${index}`}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Visit Website
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
            data-testid="button-slideshow-prev"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
            data-testid="button-slideshow-next"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 gap-2">
          {CLIENT_WEBSITES.map((_, index) => (
            <button
              key={index}
              className="w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-200"
              onClick={() => emblaApi?.scrollTo(index)}
              data-testid={`button-slide-dot-${index}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}