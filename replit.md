# replit.md

## Overview

wrwebsites is a professional web development service application built as a full-stack solution for showcasing web development services and handling client inquiries. The application serves as a marketing website for a web development agency that specializes in static website development, hosting, and ongoing support services. The website features affordable launch pricing with two package tiers: Basic Static Website (£75 setup + £10/month) and Premium Static Website (£150 setup + £10/month). Contact information includes phone numbers 07397985279 and 07535778637, and email zachhreillyy@gmail.com.

## Recent Changes (November 3, 2025)

- **Implemented comprehensive project management system** - Added Projects tab to admin dashboard with project list, status tracking, stats (total, in development, completed, on hold), and priority badges
- **Auto-project creation via GoCardless webhook** - When setup fee payment is confirmed, system automatically creates project record linked to customer, pulling data from onboarding (business name, description, domain, estimated completion date)
- **Added clientCode and password fields to customers table** - Customers now have unique client codes (e.g., "WR-001") and hashed passwords copied from onboarding records, enabling portal access
- **Updated customer creation flow** - setupDirectDebit function now fetches clientCode and portalPassword from onboarding record and stores them in customer record during payment setup
- **Fixed database schema synchronization** - Manually added missing columns (client_code, password, wants_user_auth, wants_database, wants_payment_processing, wants_crud_operations, wants_admin_panel, wants_production_features) via ALTER TABLE when db:push failed
- **Project management UI enhancements** - Projects display customer info, package type, status badges (planning, design, development, review, completed, on_hold), priority levels (low, medium, high), days active, domain name, and estimated completion dates
- **Admin project controls** - Admins can update project status via dropdown and post customer-visible updates with images through PostUpdateDialog component

## Previous Changes (October 31, 2025)

- **Added customer completion date preference** - Customers can now set an optional target completion date during onboarding (Step 6), helping prioritize projects and set clear expectations
- **Implemented smart date picker** - Uses shadcn Calendar component with Popover, validates against past dates, displays in GB format, includes helpful description text
- **Enhanced admin dashboard with completion dates** - Target completion dates display in both Client Inquiries and Customer Management tabs with amber badge styling for visibility
- **Customer portal shows target dates** - Dashboard header displays preferred completion date in prominent amber text when set, formatted as "Target Completion: 5 November 2025"
- **Date serialization handled correctly** - Backend uses z.coerce.date().optional().nullable() to convert ISO strings from frontend to Date objects, ensuring proper validation and storage

## Previous Changes (October 25, 2025)

- **Added image upload functionality to project updates** - Admins can now attach screenshots/images when posting updates to customers, images stored in object storage and displayed in customer dashboard updates feed
- **Implemented secure image upload flow** - Uses presigned URLs for direct-to-storage uploads (10MB max), client-side MIME type validation, automatic URL normalization to `/objects/...` paths, images served through backend proxy
- **Enhanced customer updates display** - Images show in timeline feed with click-to-expand functionality, proper responsive styling, and error handling for upload failures
- **Implemented secure customer authentication system** - Added bcrypt password hashing (10 rounds) for client portal access, generating 12-character cryptographically secure passwords using crypto.randomBytes
- **Fixed onboarding completion flow** - Clients now receive auto-generated password and client code (WR-XXX format) on onboarding-complete page, with flexible payment timing allowing payment before or after website completion
- **Integrated payment system with client_onboarding** - Added `setupFeesPaid` field and `clientOnboardingId` linkage to customers/transactions tables, enabling GoCardless webhook to update onboarding records when payments complete
- **Customer portal enhancements** - Login now requires email + password authentication, dashboard displays green "Set Up Payment Now" button for unpaid clients (disappears after payment), shows client code in header
- **Payment data propagation** - Dashboard payment button passes all required fields (clientId, email, name, businessName, package) to payment-setup page ensuring complete GoCardless integration
- **Security improvements** - Passwords never stored in plaintext (hashed before DB storage), one-time plaintext delivery via sessionStorage (not URL), constant-time bcrypt.compare() for login verification

## Previous Changes (October 18, 2025)

- **Implemented live color preview** - All 9 template previews now update in real-time when customers select different color schemes, allowing instant visualization of how each template looks in their chosen colors
- **Comprehensive color mapping system** - Created dynamic color classes for all 10 color schemes (Emerald Green, Ocean Blue, Royal Purple, Sunset Orange, Rose Pink, Navy Blue, Forest Green, Crimson Red, Slate Gray, Amber Gold) that adapt to both light and dark theme variations

## Previous Changes (October 17, 2025)

- **Implemented visual template selection system** in onboarding flow with 9 template style previews (Modern, Classic, Minimalist, Bold, Creative, Corporate, Elegant, Tech, Magazine)
- **Added 10 color scheme options** with gradient previews for customer website customization
- **GoCardless payment integration now LIVE** - Real direct debit payments enabled for £75/£150 setup fees and £10/month recurring subscriptions
- **Fixed ES module compatibility** for GoCardless CommonJS library using createRequire pattern
- **Added project status workflow** to payment requests table (pending_payment → paid_pending_build → built_awaiting_approval → approved → published)
- **Enhanced admin dashboard** with template/color scheme display and project status management buttons
- Updated onboarding to 6-step process: Package & Contact → Template Selection → Domain/Hosting → Website Content → Design Preferences → Additional Features

## Previous Changes (August 20, 2025)

- Updated branding from "WebCraft Pro" to "wrwebsites" throughout the application
- Implemented content from user's business description including pricing structure, service descriptions, and contact information
- Updated pricing section to reflect two-tier structure: Basic (£75 + £10/month) and Premium (£150 + £10/month) packages
- Modified services section to match user's specific service descriptions for static websites and domain/hosting
- **Completely removed contact forms** per user request - website now only displays direct contact information (email and phone)
- **Added comprehensive traffic analytics system** with PostgreSQL database integration
- **Implemented password-protected admin dashboard** at `/admin` with analytics visualization (password: BADMAN123)
- Added real-time page view and click event tracking with automatic data collection
- **Implemented direct debit payment system** with secure customer data collection for both Basic (£75 + £10/month) and Premium (£150 + £10/month) packages
- **Enhanced payment funnel** at `/payment` with 5-step process: package selection, client details, domain info (premium only), payment setup, and thank you page
- **Integrated comprehensive client onboarding system** with detailed data collection replacing static checklists
- **Updated pricing section buttons** to link directly to payment page with pre-selected packages
- **Enhanced terms and conditions visibility** with prominent preview sections and professional modal presentations
- **Integrated specific banking details** for payment collection: Zachary Reilly, Sort Code: 60-84-07, Account: 46122747
- **Added payment management dashboard** at `/admin/payments` for viewing and managing customer payment requests
- **Created comprehensive client management system** in admin dashboard showing actual submissions with detailed project information
- **Added professional thank you page** with 24-hour email contact promise and clear next steps guidance
- Created comprehensive payment request storage in PostgreSQL database for lead management
- Fixed TypeScript type errors and updated storage implementation for analytics, payment, and client data
- **Implemented consultation page** at `/consultation` with dynamic pricing configurator for custom project requests
- **Added consultation management tab** to admin dashboard for reviewing custom project inquiries with pricing details
- **Fixed consultation page background** to match main website's green gradient theme
- **Enhanced navigation** with prominent "Custom Quote" button linking to consultation page
- **Integrated consultation database** with comprehensive project configuration tracking and status management

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

**Payment Processing**: Integrated with **GoCardless** for direct debit payments in LIVE mode. Handles:
- Customer creation and bank account verification
- Direct debit mandate setup (BACS scheme for UK)
- One-time setup fee payments (£75 Basic / £150 Premium)
- Recurring monthly subscriptions (£10/month)
- Webhook processing for payment status updates
- Uses createRequire pattern for CommonJS compatibility with ES modules

**Email Services**: Contact form submissions are logged but email notification integration is planned for production use.

**Development Tools**: Integrates **Replit-specific plugins** for development environment optimization and error handling.

**Font Services**: Uses **Google Fonts** for typography (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono).

The architecture emphasizes type safety, developer experience, and scalability while maintaining a clean separation between frontend and backend concerns.