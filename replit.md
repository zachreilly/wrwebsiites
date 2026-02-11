# replit.md

## Overview
wrwebsites is a full-stack web application designed to showcase web development services, manage client inquiries, and process payments. It serves as a marketing platform for a web development agency specializing in static website development, hosting, and support, offering Basic (£75 setup + £10/month) and Premium (£150 setup + £10/month) packages. The platform aims to streamline client onboarding, project management, and payment collection, with a vision to expand its market potential through enhanced features and efficient client handling.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
### UI/UX Decisions
The frontend uses React with TypeScript, leveraging `shadcn/ui` (built on Radix UI) for consistent and accessible components. Styling is managed with Tailwind CSS, utilizing a custom design system with CSS variables for theming. The design uses a simplified emerald green and white colour palette with gray accents for a professional, trustworthy appearance. Google Fonts (Inter) are used for typography. No animations, scroll effects, or 3D components are used — content loads instantly for fast mobile performance. Cards use clean white backgrounds with subtle shadows (shadow-md).

### Technical Implementations
*   **Frontend**: React, TypeScript, Wouter for routing, TanStack Query for server state management, React Hook Form with Zod for form handling.
*   **Backend**: Express.js with TypeScript, integrated with Vite for development and serving static files.
*   **Data Storage**: Utilizes an `IStorage` interface with an in-memory `MemStorage` for development, designed to be swapped for a PostgreSQL database. Drizzle ORM and Zod schemas are used for type-safe data validation and schema definition.
*   **SEO**: Comprehensive SEO optimization including dynamic meta tags, JSON-LD structured data, `robots.txt`, and `sitemap.xml` for improved search engine visibility and social sharing.
*   **Project Management**: Admin dashboard with project tracking, status updates, and auto-creation of projects via GoCardless webhooks.
*   **Customer Portal**: Secure authentication using bcrypt hashed passwords, displaying project status, updates (with image uploads), and payment information.
*   **Onboarding**: Multi-step client onboarding process for package selection, template/color customization, domain/hosting details, content, design preferences, and additional features, including a smart date picker for target completion dates.
*   **Analytics**: Integrated traffic analytics system with real-time page view and click event tracking.
*   **Consultation**: A dynamic pricing configurator for custom project requests, managed via the admin dashboard.

### System Design Choices
The architecture emphasizes type safety, component-based design, and a clear separation of concerns between frontend and backend. It's built for scalability and a positive developer experience, with flexible storage abstraction.

## External Dependencies
*   **Database**: Neon Database (serverless PostgreSQL) via `@neondatabase/serverless`.
*   **Payment Processing**: GoCardless for live direct debit payments (setup fees and recurring subscriptions), including webhook processing.
*   **Fonts**: Google Fonts (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono).
*   **Development Tools**: Replit-specific plugins.