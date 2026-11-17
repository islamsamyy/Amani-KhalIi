# Amani Khalili — Luxury Bridal & Occasion Makeup Platform (Riyadh)

A full-stack Next.js 16 and Supabase web application for a luxury bridal and occasion makeup artist in Riyadh, featuring localized service landing pages, online booking, portfolio gallery, blog, client reviews, and a comprehensive admin suite.

## Executive Summary & Purpose
`Amani-KhalIi` delivers a high-converting digital presence and booking engine for bridal and occasion makeup services in Riyadh. Clients can explore services, view the gallery, read policies/FAQs, and book appointments online, while the business owner manages bookings, calendar availability, customers, invoices, blog posts, and site content from `/admin`.

## Core Functionality & Features
- **Service & Marketing Pages**:
  - Dedicated SEO landing pages: `/bridal-makeup-riyadh`, `/occasion-makeup-riyadh`, `/services`, `/gallery`, `/about`, `/reviews`, `/blog`, `/faq`, `/policies`, `/contact`.
- **Online Booking (`/book`) & Auth (`/auth`)**:
  - End-to-end appointment booking flow with toast notifications (`sonner`) and Supabase authentication.
- **Admin Operations Suite (`/admin`)**:
  - **Bookings (`/admin/bookings`)** & **Calendar (`/admin/calendar`)**: Schedule and appointment management.
  - **Customers (`/admin/customers`)** & **Invoices (`/admin/invoices`)**: Client CRM and billing records.
  - **Blog (`/admin/blog`)** & **Content (`/admin/content`)**: CMS for articles and page copy.

## Architecture & Tech Stack
- **Framework**: Next.js 16 (`16.4.4`) App Router & React 19 (`19.3.0`)
- **Language**: TypeScript 5
- **UI**: Radix UI (`accordion`, `dialog`, `popover`, `select`, `slot`, `switch`, `tabs`), Tailwind CSS 4, `lucide-react`, `sonner`
- **Backend & Auth**: Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- **Testing**: Vitest + Testing Library (`@testing-library/react`, `happy-dom`, `jsdom`)

## Project Structure
```text
├── app/
│   ├── (marketing)/      # Marketing home & landing sections
│   ├── admin/            # Admin suite (blog, bookings, calendar, content, customers, invoices)
│   ├── api/              # Backend API routes
│   ├── auth/             # Authentication
│   ├── blog/             # Blog articles
│   ├── book/             # Appointment booking
│   ├── bridal-makeup-riyadh/
│   ├── occasion-makeup-riyadh/
│   ├── gallery/          # Portfolio gallery
│   ├── services/         # Service catalog
│   └── reviews/          # Client testimonials
├── components/           # Shared UI components
├── features/             # Feature-sliced modules
├── lib/                  # Supabase clients & helpers
├── providers/            # React context providers
├── supabase/             # Database schema & migrations
└── test/                 # Vitest test suite
```

## Getting Started

```bash
git clone https://github.com/islamsamyy/Amani-KhalIi.git
cd Amani-KhalIi
npm install
```

### Available Scripts
| Command | Description |
| :--- | :--- |
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest unit/component tests |
