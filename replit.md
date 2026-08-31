# Franchise Friend

## Overview

Franchise Friend is a franchise consulting website for Charles Stovall, a franchise consultant based in Charleston, SC. The platform helps prospective franchise owners discover, evaluate, and purchase franchise opportunities through a 4-phase discovery process. The site includes lead capture, a client portal with member authentication, podcast content management, blog posts, and an admin panel for managing members and content.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **State Management**: TanStack React Query for server state, React Context for auth state
- **Animations**: Framer Motion for UI animations

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful API endpoints under `/api/*`
- **Session Management**: Express sessions stored in PostgreSQL using connect-pg-simple
- **Authentication**: Passport.js with Google OAuth 2.0 strategy for admin access, email-based login for members

### Data Storage
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Tables**: leads, podcasts, members, invitations, brands, session

### Key Design Decisions

1. **Shared Schema Pattern**: Database schema lives in `shared/schema.ts` making types available to both frontend and backend, ensuring type safety across the stack.

2. **Storage Abstraction**: The `server/storage.ts` file implements an `IStorage` interface, abstracting database operations and making it easier to swap implementations if needed.

3. **Member Portal System**: Members access content through a 4-phase journey system (phase1-4). Progress is tracked in the database and members authenticate via email lookup.

4. **Admin Authentication**: Admin users authenticate via Google OAuth, with the admin email hardcoded to `charles@franchisefriend.net`.

5. **Lead Capture**: Multiple lead types (consultation, general, newsletter) are captured through forms and stored in the leads table.

6. **Podcast Management**: Admin can create/delete podcast episodes, which are served via an auto-generated RSS feed at `/api/podcast/rss`.

## External Dependencies

### Third-Party Services
- **Neon Database**: PostgreSQL hosting via `@neondatabase/serverless`
- **Google OAuth**: Admin authentication using passport-google-oauth20
- **Calendly**: Embedded scheduling for consultations (external links)

### Email
- **Nodemailer**: Configured for sending emails (transporter setup in routes.ts)

### PDF Generation
- **PDFKit**: Used for generating downloadable PDF content (member portal guides and Ownership Advisor reports)

### Key Environment Variables Required
- `DATABASE_URL`: Neon PostgreSQL connection string
- `SESSION_SECRET`: Secret for express-session
- `GOOGLE_CLIENT_ID`: Google OAuth client ID (for admin auth)
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret (for admin auth)

## Ownership Advisor

Separate product at `/advisor` with Chuck's desk at `/admin/advisor`. Docs live in `docs/ownership-advisor/`. Additive Postgres tables are created on boot. Candidate data is not stored only in memory.