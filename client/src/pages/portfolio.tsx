import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Star, Calendar, Tag, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { PortfolioItem } from "@shared/schema";
import ClientWebsiteSlideshow from "@/components/ClientWebsiteSlideshow";

export default function PortfolioPage() {
  const [, setLocation] = useLocation();
  
  const { data: portfolioData, isLoading, error } = useQuery({
    queryKey: ['/api/portfolio'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/portfolio");
      return response.json();
    },
  });

  const portfolioItems: PortfolioItem[] = portfolioData?.data || [];

  const getProjectTypeColor = (type: string) => {
    switch (type) {
      case 'basic':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md';
      case 'premium':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md';
      case 'custom':
        return 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-md';
    }
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-500 fill-current drop-shadow-sm' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">Error Loading Portfolio</h2>
            <p className="text-gray-600 mb-4">Please try again later</p>
            <Button 
              onClick={() => setLocation('/')}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md"
            >
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 shadow-lg border-b-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center">
            <div className="self-start mb-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation('/')}
                data-testid="button-back-home"
                className="text-white hover:bg-white/20 hover:text-white border-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg" data-testid="text-portfolio-title">
                Our Portfolio
              </h1>
              <p className="text-lg text-emerald-100 mt-2 drop-shadow">
                Showcasing successful websites we've built for our clients
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Website Slideshow */}
      <ClientWebsiteSlideshow />

      {/* Portfolio Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {portfolioItems.length === 0 ? (
          <Card className="text-center py-12 bg-gradient-to-br from-white to-emerald-50 shadow-xl border-0">
            <CardContent>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Coming Soon!</h2>
              <p className="text-gray-600 mb-6">
                We're currently building our portfolio showcase. Check back soon to see our amazing client projects!
              </p>
              <Button 
                onClick={() => setLocation('/')}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md"
              >
                Explore Our Services
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Section */}
            <div className="text-center mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-white to-emerald-50 p-6 rounded-xl shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                    {portfolioItems.length}+
                  </div>
                  <div className="text-gray-700 font-medium">Websites Built</div>
                </div>
                <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-xl shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    {new Set(portfolioItems.map(item => item.industry).filter(Boolean)).size}+
                  </div>
                  <div className="text-gray-700 font-medium">Industries Served</div>
                </div>
                <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    {portfolioItems.filter(item => item.clientRating && item.clientRating >= 4).length}+
                  </div>
                  <div className="text-gray-700 font-medium">Happy Clients</div>
                </div>
              </div>
            </div>

            {/* Portfolio Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItems.map((item, index) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50" data-testid={`card-portfolio-${index}`}>
                  {/* Project Image */}
                  {item.imageUrl && (
                    <div className="aspect-video overflow-hidden bg-gray-100">
                      <img 
                        src={item.imageUrl} 
                        alt={`${item.projectTitle} preview`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2" data-testid={`text-project-title-${index}`}>
                          {item.projectTitle}
                        </CardTitle>
                        <div className="flex items-center text-gray-600 mb-2">
                          <User className="w-4 h-4 mr-1" />
                          <span className="text-sm">{item.clientName}</span>
                        </div>
                      </div>
                      <Badge className={getProjectTypeColor(item.projectType)}>
                        {item.projectType}
                      </Badge>
                    </div>
                    
                    {item.industry && (
                      <div className="flex items-center text-gray-600 mb-2">
                        <Tag className="w-4 h-4 mr-1" />
                        <span className="text-sm">{item.industry}</span>
                      </div>
                    )}

                    {item.projectCompletedDate && (
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="text-sm">
                          Completed {new Date(item.projectCompletedDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </CardHeader>

                  <CardContent>

                    {/* Features */}
                    {item.features && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm text-gray-900 mb-2">Features:</h4>
                        <div className="flex flex-wrap gap-2">
                          {JSON.parse(item.features).slice(0, 3).map((feature: string, idx: number) => (
                            <Badge key={idx} className="text-xs bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-indigo-200 hover:from-indigo-200 hover:to-purple-200 transition-colors">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rating */}
                    {item.clientRating && (
                      <div className="mb-4">
                        {renderStars(item.clientRating)}
                      </div>
                    )}

                    {/* Testimonial */}
                    {item.testimonialText && (
                      <blockquote className="border-l-4 border-gradient-to-b from-emerald-400 to-teal-400 bg-gradient-to-r from-emerald-50 to-transparent pl-4 mb-4 rounded-r-md">
                        <p className="text-sm italic text-gray-700">
                          "{item.testimonialText}"
                        </p>
                      </blockquote>
                    )}

                    <div className="flex justify-between items-center pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(item.websiteUrl, '_blank')}
                        data-testid={`button-view-site-${index}`}
                        className="border-emerald-200 text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white hover:border-transparent transition-all duration-300"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Site
                      </Button>
                      
                      {item.isFeatured && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md animate-pulse">
                          ⭐ Featured
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12 bg-gradient-to-br from-white via-emerald-50 to-teal-50 p-8 rounded-xl shadow-lg border-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Join Our Success Stories?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Let us create a professional website that represents your business perfectly. 
                From concept to completion, we'll work with you every step of the way.
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => setLocation('/payment')}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                  data-testid="button-get-started"
                >
                  Get Started Today
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setLocation('/consultation')}
                  data-testid="button-custom-quote"
                  className="border-emerald-500 text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white hover:border-transparent shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  Get Custom Quote
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}