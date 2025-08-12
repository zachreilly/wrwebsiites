# replit.md

## Overview

WebCraft Pro is a professional web development service application built as a full-stack solution for showcasing web development services and handling client inquiries. The application serves as a marketing website for a web development agency that specializes in static website development, hosting, and ongoing support services. It features a modern, responsive design with service showcases, pricing information, client testimonials, and a contact form for quote requests.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using **React** with **TypeScript** and follows a component-based architecture. Key architectural decisions include:

**UI Framework**: Uses **shadcn/ui** components built on top of **Radix UI** primitives for consistent, accessible design patterns. This provides pre-built, customizable components while maintaining design system consistency.

**Styling**: Implements **Tailwind CSS** for utility-first styling with a custom design system that includes CSS variables for theming. The design uses a neutral color palette with primary blue tones and accent yellow colors.

**State Management**: Utilizes **TanStack Query** (React Query) for server state management, providing caching, synchronization, and error handling for API calls.

**Routing**: Uses **Wouter** as a lightweight client-side routing solution instead of React Router, keeping the bundle size minimal.

**Form Handling**: Implements **React Hook Form** with **Zod** validation for type-safe form handling and validation, particularly for the contact form.

### Backend Architecture
The backend follows an **Express.js** server architecture with TypeScript:

**Server Framework**: Uses **Express.js** with TypeScript for the REST API, providing middleware for JSON parsing, CORS handling, and request logging.

**Development Setup**: Integrates **Vite** for development mode with hot module replacement and serves static files in production.

**Storage Abstraction**: Implements an **IStorage interface** with an in-memory implementation (`MemStorage`) that can be easily swapped for database implementations. This provides flexibility for future database integration.

**API Design**: RESTful API structure with endpoints for contact form submissions and admin functionality to retrieve contact requests.

### Data Storage Solutions
**Current Implementation**: Uses **in-memory storage** with Map objects for development and testing purposes.

**Database Schema**: Designed with **Drizzle ORM** and **PostgreSQL** schema definitions, ready for production database integration. The schema includes users and contact_requests tables with proper typing.

**Data Validation**: Implements **Zod schemas** for runtime type validation, ensuring data integrity between client and server.

### Authentication and Authorization
**Current State**: Basic user schema is defined but authentication is not currently implemented in the application flow.

**Future Considerations**: The schema includes user tables with username/password fields, suggesting planned authentication for admin features.

### External Service Integrations
**Database**: Configured for **Neon Database** (serverless PostgreSQL) with connection pooling via `@neondatabase/serverless`.

**Email Services**: Contact form submissions are logged but email notification integration is planned for production use.

**Development Tools**: Integrates **Replit-specific plugins** for development environment optimization and error handling.

**Font Services**: Uses **Google Fonts** for typography (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono).

The architecture emphasizes type safety, developer experience, and scalability while maintaining a clean separation between frontend and backend concerns.