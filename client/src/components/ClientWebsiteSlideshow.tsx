import { useCallback, useEffect, useState } from 'react';
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
  },
  {
    name: "Sea World Eats",
    url: "https://sea-world-eats.replit.app/",
    description: "Fresh seafood and ocean-inspired dining experience with sustainable ingredients",
    industry: "Restaurant & Dining"
  }
];

export default function ClientWebsiteSlideshow() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
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
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(); // Set initial selected index
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

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
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden group cursor-pointer" onClick={() => window.open(website.url, '_blank')}>
                        <div className="w-full h-full flex items-center justify-center">
                          {/* Placeholder for website preview */}
                          <div className="text-center p-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                              <ExternalLink className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-2">{website.name}</h4>
                            <p className="text-gray-600 mb-4">{website.industry}</p>
                            <div className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg group-hover:bg-emerald-700 transition-colors">
                              Click to Visit Live Site
                            </div>
                          </div>
                        </div>
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-emerald-600 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
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
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === selectedIndex 
                  ? 'bg-emerald-600' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => scrollTo(index)}
              data-testid={`slideshow-dot-${index}`}
              aria-current={index === selectedIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}