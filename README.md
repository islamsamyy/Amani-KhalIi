# Amani Khalil (`Amani-KhalIi`) — Luxury Bridal & Occasion Makeup Booking Platform (Riyadh)

<p align="center">
  <img src="./public/ak-logo-full.png" alt="Amani Khalil Studio Logo" width="220" />
</p>

> **Documentation & Proposals:**
> - **Detailed Project Documentation (EN):** [`docs/PROJECT_DOCUMENTATION.md`](./docs/PROJECT_DOCUMENTATION.md)
> - **البربوزال التجاري ودراسة الفوائد (AR Commercial Proposal):** [`docs/COMMERCIAL_PROPOSAL_AR.md`](./docs/COMMERCIAL_PROPOSAL_AR.md)

## Table of Contents
- [Executive Summary & Business Utility](#executive-summary--business-utility)
- [Full System Screenshots (UI & Dashboards)](#full-system-screenshots-ui--dashboards)
- [System Architecture & Layers](#system-architecture--layers)
- [Data Model & Business Rules](#data-model--business-rules)
- [Database Schema, Migrations & RLS](#database-schema-migrations--rls)
- [Application Modules & API Endpoints](#application-modules--api-endpoints)
- [Getting Started, Scripts & Testing](#getting-started-scripts--testing)
- [Business Value, ROI & Growth Opportunities](#business-value-roi--growth-opportunities)

---

## Executive Summary & Business Utility
`Amani-KhalIi` is a bilingual (Arabic-first RTL, English LTR) **Next.js 16.4.6**, **React 19**, and **Supabase** luxury beauty booking and studio operations platform for **Amani Khalil**, a CIDESCO-certified makeup artist providing private in-home sessions across **Riyadh, Saudi Arabia**.

Designed to convert mobile and desktop visitors into deposit-secured bookings in **under two minutes without requiring account registration**, it combines SEO-targeted local landing pages, an artist-capacity-aware booking engine (`Asia/Riyadh`, `SAR`), and a full-featured `/admin` operations suite.

---

## Full System Screenshots (UI & Dashboards)
Live screenshots captured from the running Next.js application (`1440x900` desktop viewport):

### 1. Public Marketing, Services & Trust Layer
| Home Page (`/`) | Services & Interactive Calculator (`/services`) |
| :---: | :---: |
| ![Home Page](./docs/screenshots/01-home.png) | ![Services Page](./docs/screenshots/02-services.png) |

| VIP Bridal Experience (`/services/vip-bridal`) | Portfolio Gallery (`/gallery`) |
| :---: | :---: |
| ![VIP Bridal](./docs/screenshots/03-vip-bridal.png) | ![Gallery](./docs/screenshots/04-gallery.png) |

### 2. Guest Booking Flow, Social Proof & Admin Portal
| 4-Step Guest Booking Flow (`/book`) | Verified Client Reviews (`/reviews`) |
| :---: | :---: |
| ![Booking Flow](./docs/screenshots/05-booking-flow.png) | ![Reviews](./docs/screenshots/06-reviews.png) |

| Invite-Only Admin Portal Login (`/admin/login`) |
| :---: |
| ![Admin Login](./docs/screenshots/07-admin-login.png) |

---

## System Architecture & Layers

```mermaid
flowchart TB
    subgraph L1["1. Bilingual Marketing & Local SEO Layer"]
        Home["/ • /about • /services • /services/vip-bridal • /gallery • /reviews • /blog/[slug] • /faq • /policies • /contact"]
        LocalSEO["/bridal-makeup-riyadh • /occasion-makeup-riyadh"]
    end

    subgraph L2["2. Accountless Guest Booking Layer"]
        Book["/book (booking-flow-client.tsx)"]
        Confirm["/book/confirmation (Secure Manage-Booking Link)"]
    end

    subgraph L3["3. Invite-Only Admin Operations Suite (/admin)"]
        Admin["/admin/{bookings,calendar,customers,invoices,services,content,blog,settings}"]
        Chrome["admin-chrome.tsx + Radix UI + Sonner"]
    end

    subgraph L4["4. Domain Rules, Persistence & QA Layer"]
        Proxy["proxy.ts & /auth/callback"]
        Supa["Supabase Postgres + Server RPCs (002..005 migrations) + /api/supabase/seed"]
        Tests["Vitest 4 + Testing Library (10 test files, 33 tests)"]
    end

    L1 --> L2 --> L4
    L3 --> L4
```

| Layer | Responsibility | Key Files |
| :--- | :--- | :--- |
| **Marketing & Local SEO Layer** | Arabic-first trust building, CIDESCO badge, signature styles, and Riyadh SEO funnels | `app/page.tsx`, `app/{bridal-makeup-riyadh,occasion-makeup-riyadh,services/vip-bridal}/page.tsx` |
| **Guest Booking Layer** | Frictionless <2 min 4-step booking flow with Riyadh district travel fees, add-ons, skin form, and confirmation | `app/book/page.tsx`, `app/book/confirmation/page.tsx`, `features/booking/pricing.ts` |
| **Admin Operations Layer** | Role-gated calendar, booking triage, customer CRM, invoicing, dynamic service pricing, and CMS | `app/admin/{bookings,calendar,customers,invoices,services,content,blog,settings}/page.tsx` |
| **Security & RPC Layer** | Server-side pricing calculation, atomic booking confirmation RPCs, and invite-only admin auth | `proxy.ts`, `lib/supabase/*`, `supabase/migrations/002..005*.sql` |
| **QA & Component Layer** | Radix UI primitives and Vitest component/admin tests | `components/ui/*`, `components/__tests__/*`, `app/admin/_components/__tests__/admin-overview.test.tsx` |

---

## Data Model & Business Rules
- **Timezone & Currency:** Strict `Asia/Riyadh` (UTC+3) display with UTC database persistence and `SAR` pricing.
- **Zero Hardcoded Prices:** All packages, add-ons, district travel fees, and deposit percentages live in `service_packages`, `addons`, and `riyadh_areas` and are editable from `/admin/services` and `/admin/settings`.
- **Artist-Aware Capacity:** Designed around ~2-hour sessions and ~2 sessions/day per artist (`CLIENT_HOME` active, `STUDIO` ready).
- **Consent-First Social Proof:** Reviews and gallery photos are published only with explicit client consent.

```mermaid
erDiagram
    SERVICE_PACKAGES ||--o{ BOOKINGS : selected_in
    RIYADH_AREAS ||--o{ BOOKINGS : determines_travel_fee
    CUSTOMERS ||--o{ BOOKINGS : places
    BOOKINGS ||--o| INVOICES : generates
    BOOKINGS ||--o| REVIEWS : unlocks_consent_review
```

---

## Database Schema, Migrations & RLS
Defined across `supabase/schema.sql` and migrations `002_relations_security_rpc.sql` through `005_admin_delete_operations.sql`:

| Table | Purpose |
| :--- | :--- |
| `public.admin_users` | Invite-only admin accounts & RBAC roles |
| `public.service_packages` | Dynamic bridal, VIP, and occasion makeup packages & SAR pricing |
| `public.addons` | Optional add-on services (hair styling, trial session, extra guests) |
| `public.riyadh_areas` | Riyadh neighborhoods and travel fee matrix |
| `public.customers` | Guest & repeat client CRM records |
| `public.bookings` | Core appointments, artist assignment, location type, deposit status |
| `public.invoices` | Booking invoices & payment tracking |
| `public.blocked_dates` | Calendar availability & blackout dates |
| `public.reviews`, `public.gallery_looks`, `public.blog_posts`, `public.faqs` | Social proof & CMS content |

---

## Application Modules & API Endpoints
- **Public & Booking Routes:** `/`, `/about`, `/services`, `/services/vip-bridal`, `/bridal-makeup-riyadh`, `/occasion-makeup-riyadh`, `/gallery`, `/reviews`, `/blog`, `/blog/[slug]`, `/faq`, `/policies`, `/contact`, `/book`, `/book/confirmation`
- **Admin Routes:** `/admin`, `/admin/login`, `/admin/bookings`, `/admin/calendar`, `/admin/customers`, `/admin/invoices`, `/admin/services`, `/admin/services/new`, `/admin/content`, `/admin/blog`, `/admin/settings`
- **API & Auth Endpoints:**
  - `app/api/supabase/seed/route.ts` — Database seed initializer
  - `app/auth/callback/route.ts` — Supabase invite/auth callback

---

## Getting Started, Scripts & Testing

```bash
git clone https://github.com/islamsamyy/Amani-KhalIi.git
cd Amani-KhalIi
npm install
```

| Script | Command | Description |
| :--- | :--- | :--- |
| Dev | `npm run dev` | Start Next.js 16 dev server |
| Build | `npm run build` | Production build |
| Start | `npm run start` | Serve production build |
| Lint | `npm run lint` | Run ESLint 9 |
| Test | `npm test` | Run Vitest suite (`10` test files, `33` tests passing) |

---

## Business Value, ROI & Growth Opportunities
*(See [`docs/COMMERCIAL_PROPOSAL_AR.md`](./docs/COMMERCIAL_PROPOSAL_AR.md) for the full Arabic commercial proposal / بربوزال تجاري)*

- **Direct Revenue Without Marketplace Fees:** Eliminates manual WhatsApp/DM scheduling friction and retains 100% of bridal/VIP margins.
- **Higher Average Order Value (AOV):** Interactive add-ons and transparent Riyadh neighborhood travel pricing lift per-booking revenue.
- **Multi-Artist Studio Scaling:** Because scheduling and location (`CLIENT_HOME` / `STUDIO`) are data-driven, Amani can onboard junior artists and operate as a Riyadh luxury beauty agency taking a commission per booking.
- **Saudi Payments & BNPL (Moyasar / Tabby / Tamara):** Integrating local Mada, Apple Pay, and Tabby/Tamara installments on `/book` directly lifts high-ticket VIP Bridal conversions.
- **Automated WhatsApp Lifecycle:** Trigger pre-appointment prep guides and post-session consent review links automatically to compound organic trust.
