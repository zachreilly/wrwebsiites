// Portfolio projects shown on /portfolio.
// Add a project by copying the example below into the list (and removing the // marks).
// Leave the list empty to show the "Coming Soon" message.

export interface PortfolioItem {
  id: string;
  projectTitle: string;
  clientName: string;
  websiteUrl: string;
  imageUrl: string; // e.g. "/portfolio/client-name.jpg" (put the image in client/public/portfolio/)
  projectType: "basic" | "premium" | "custom";
  industry?: string;
  features?: string; // JSON list, e.g. '["Contact form","Booking"]'
  isFeatured?: boolean;
  projectCompletedDate?: string; // e.g. "2026-09-01"
}

export const portfolioItems: PortfolioItem[] = [
  // {
  //   id: "example",
  //   projectTitle: "Example Business Website",
  //   clientName: "Example Ltd",
  //   websiteUrl: "https://example.co.uk",
  //   imageUrl: "/portfolio/example.jpg",
  //   projectType: "basic",
  //   industry: "Services",
  //   features: '["Contact form","Mobile friendly"]',
  //   projectCompletedDate: "2026-09-01",
  // },
];
