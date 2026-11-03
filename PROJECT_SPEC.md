# AGENTS.md: Amani Khalil Booking App

Instructions for AI coding agents (and human contributors) working in this repository. Read this file fully before making changes. Read `DESIGN.md` before touching any UI.

---

## 1. Project summary

A bilingual (Arabic-first, English second) website and booking system for **Amani Khalil**, a certified professional makeup artist who provides **private makeup sessions at the client's home in Riyadh, Saudi Arabia** (brides, evening events, graduations, groups).

**Primary goal:** a visitor trusts Amani within seconds (certificate, reviews, gallery), picks a package, and completes a booking with a deposit in under two minutes on a phone.

**Three surfaces:**
1. **Public site:** marketing and trust pages (home, about, services, landing pages, gallery, reviews, FAQ, contact, policies).
2. **Booking flow:** guest booking (no account), pay deposit, confirmation, manage-booking link, post-session review link.
3. **Admin dashboard:** bookings, calendar and availability, services and pricing, customers, payments, reviews and gallery, team, settings.

---

## 2. Business rules (source of truth)

These come from the business owner. Do not change them silently.

- **Service location:** at the client's home, within Riyadh. A fixed studio location may be added later, so keep location type as data (`CLIENT_HOME` now, `STUDIO` later).
- **Session length:** about 2 hours.
- **Capacity:** about 2 sessions per day per artist (travel included). Today there is one artist (Amani). A team will be added later, so every scheduling query must be artist-aware from day one.
- **Prices:** not final. Never hardcode prices. All prices, add-ons, travel fees and deposit percentage live in the database and are editable from admin.
- **Clients do not need accounts.** Booking is guest-based with a phone number and a secure link. Optional accounts are phase 3.
- **Admin access is invite-only** with roles (see section 9).
- **Reviews** are published only with the client's consent and only from completed bookings.
- **Currency:** SAR. **Timezone:** `Asia/Riyadh` (UTC+3, no daylight saving). Store timestamps in UTC.

If a rule you need is not written here (cancellation window, deposit amount, refund policy, travel fees), **do not invent it**. Put it behind a setting in the database, use a clearly named placeholder, and flag it in your final message.

---

## 3. Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js (App Router), TypeScript in strict mode |
| UI | Tailwind CSS + shadcn/ui (Radix) |
| Forms and validation | react-hook-form + zod (one schema shared by client and server) |
| i18n | next-intl, locales `ar` (default) and `en` |
| Database | PostgreSQL + Prisma |
| Auth (admin) | Auth.js, invite-only, 2FA for admins |
| Mutations | Server Actions for forms; Route Handlers for webhooks and cron |
| Payments | Saudi-supported gateway with mada and Apple Pay (**not chosen yet**; keep behind a `PaymentProvider` interface) |
| Notifications | WhatsApp Business API (fallback: `wa.me` link for MVP) and email |
| File storage | S3-compatible bucket or Cloudinary |
| Testing | Vitest (unit), Playwright (end-to-end) |
| Hosting | Vercel + managed Postgres |

Package manager: **pnpm** (assumed; update this line if the project uses another).

---

## 4. Commands

```bash
pnpm install              # install dependencies
pnpm dev                  # start dev server
pnpm build                # production build
pnpm lint                 # ESLint
pnpm typecheck            # tsc --noEmit
pnpm test                 # Vitest
pnpm test:e2e             # Playwright
pnpm db:migrate           # prisma migrate dev
pnpm db:seed              # seed demo data and first owner
pnpm db:studio            # Prisma Studio
```

Before declaring any task done, run: `pnpm lint && pnpm typecheck && pnpm test`. Run `pnpm test:e2e` when you touch the booking flow.

---

## 5. Project structure

```
src/
├─ app/
│  ├─ [locale]/
│  │  ├─ (marketing)/      # home, about, services, landing pages, gallery, reviews, faq, contact, policies
│  │  ├─ (booking)/        # book/*, booking/[ref], review/[token]
│  │  ├─ layout.tsx        # sets dir="rtl|ltr", fonts, providers
│  │  ├─ not-found.tsx
│  │  └─ error.tsx
│  ├─ admin/               # protected; login, overview, bookings, calendar, services, availability,
│  │                       # areas, team, customers, reviews, gallery, payments, settings
│  └─ api/
│     ├─ webhooks/payments/route.ts
│     ├─ webhooks/whatsapp/route.ts
│     ├─ availability/route.ts
│     └─ cron/{expire-holds,reminders}/route.ts
├─ components/
│  ├─ ui/                  # shadcn generated; edit sparingly
│  ├─ marketing/           # Hero, CertificateBadge, PackageCard, ReviewCarousel
│  ├─ booking/             # Stepper, PackagePicker, SlotPicker, AreaSelect, Summary
│  ├─ reviews/
│  ├─ admin/
│  └─ shared/              # Header, Footer, LocaleSwitcher, WhatsAppButton
├─ features/               # business logic by domain (no UI)
│  ├─ booking/{actions.ts,queries.ts,schemas.ts,pricing.ts,slots.ts}
│  ├─ packages/
│  ├─ reviews/
│  ├─ payments/
│  └─ notifications/
├─ lib/{db.ts,auth.ts,utils.ts,whatsapp.ts,payments.ts,dates.ts}
├─ i18n/{routing.ts,request.ts}
├─ messages/{ar.json,en.json}
└─ middleware.ts           # locale routing + admin auth gate
prisma/{schema.prisma,seed.ts}
```

**Rules:**
- Business logic lives in `src/features/*`, not in components or route files.
- Components never import Prisma. They call server actions or query functions.
- Pricing, slot generation and status transitions are pure functions with unit tests.

---

## 6. Routes

**Public:** `/`, `/about`, `/services`, `/services/[slug]`, `/bridal-makeup-riyadh`, `/occasion-makeup-riyadh`, `/gallery`, `/reviews`, `/faq`, `/contact`, `/policies/[slug]` (booking, privacy, terms), `/blog` and `/blog/[slug]` (phase 2).

**Booking:** `/book`, `/book/schedule`, `/book/location`, `/book/details`, `/book/review`, `/book/payment`, `/book/confirmation/[ref]`, `/booking/[ref]` (manage), `/review/[token]`.

**Admin (protected):** `/admin/login`, `/admin`, `/admin/bookings`, `/admin/bookings/[id]`, `/admin/calendar`, `/admin/services`, `/admin/availability`, `/admin/areas`, `/admin/team`, `/admin/customers`, `/admin/reviews`, `/admin/gallery`, `/admin/payments`, `/admin/settings`.

**System:** 404, error, loading skeletons, maintenance, payment failed, booking expired, unauthorized.

All public and booking routes are prefixed with `/[locale]`. Admin is Arabic/English too but is not indexed.

---

## 7. Data model

Core entities (Prisma):

`Service`, `AddOn`, `Artist`, `AvailabilityRule`, `BlockedDate`, `Area` (neighborhood and travel fee), `Customer`, `Booking`, `BookingItem`, `Payment`, `Review`, `GalleryItem`, `Setting`, `User` (admin users), `AuditLog`.

**Booking fields (minimum):** `ref` (short unique code), `status`, `artistId`, `startsAt`, `endsAt` (UTC), `locationType`, `areaId`, `address`, `peopleCount`, `notes`, `inspirationImageUrl`, `subtotal`, `travelFee`, `total`, `depositAmount`, `source` (utm / referrer), `holdExpiresAt`, `customerId`.

**Status flow:**

```
HELD -> PENDING_PAYMENT -> CONFIRMED -> COMPLETED
                         \-> CANCELLED / NO_SHOW / REFUNDED
HELD -> EXPIRED (hold timed out)
```

Only the transitions above are allowed. Implement them in one function (`transitionBooking`) that validates the move and writes an `AuditLog` row.

**Customers:** created automatically from the normalized phone number (E.164, `+966...`) on first booking. No login required. Match on phone to avoid duplicates.

**Money:** store amounts as integers in halalas (SAR x 100), never floats.

---

## 8. Booking logic (critical)

1. **Slot generation** (`features/booking/slots.ts`): from `AvailabilityRule` minus `BlockedDate` minus existing bookings for the artist. Session length comes from the service duration. Include a **travel buffer** between home visits (a setting).
2. **Capacity:** max sessions per artist per day is a setting (default 2).
3. **Holding a slot:** when the client reaches payment, create a booking in `HELD` with `holdExpiresAt` about 10 minutes ahead. A cron (`/api/cron/expire-holds`) moves expired holds to `EXPIRED`.
4. **No double-booking, enforced in the database:** use a transaction with row locking or an exclusion constraint on (`artistId`, time range). A UI check alone is not enough.
5. **Server-side pricing only:** `pricing.ts` computes subtotal, add-ons, travel fee, group discount, total and deposit from database values. Never trust totals sent by the client.
6. **Payment confirmation comes from the webhook**, not from the redirect page. Webhooks must be **signature-verified and idempotent**.
7. **Reminders:** cron sends a WhatsApp reminder before the session (timing is a setting).

---

## 9. Auth, roles and privacy

**Admin auth:**
- Invite-only. The first `owner` is created by `db:seed`. No public admin registration.
- Roles: `OWNER` (everything), `MANAGER` (bookings, calendar, customers), `ARTIST` (only her own bookings and schedule).
- 2FA required for admin users.
- `middleware.ts` gates `/admin/*`, **and every server action and API route checks the session and role again.** Hiding a menu item is not security.
- `noindex` on all admin pages. Log sensitive actions (refund, cancel, role change) to `AuditLog`.

**Client access:** no account. A client manages a booking through `/booking/[ref]` using a signed token. Changing or cancelling requires a one-time code (OTP) sent to the phone on the booking.

**Privacy:** we store names, phone numbers, addresses and photos. Require a consent checkbox at booking, keep personal data out of logs, and never show full address or phone on a confirmation page without OTP. Review Saudi PDPL obligations with a qualified advisor before launch.

**Never store card data.** The payment gateway handles it.

---

## 10. UI, design and RTL

- **Read `DESIGN.md` first.** Colors, typography, radius, components, motion and accessibility are defined there. Do not invent new colors; use the CSS variables from `globals.css`.
- Palette in short: Red Wine `#400101`, Butter Beach `#FFEFDC`, Cocoa Blush `#A6877C`. Text on cocoa fills is wine; cocoa is never body text on butter.
- **Arabic default, `dir="rtl"`.** Use Tailwind **logical** classes only: `ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`. Do not use `left`, `right`, `ml-`, `mr-`, `pl-`, `pr-`.
- Mirror directional icons (chevrons, arrows). Do not mirror numbers, logos or the certificate image.
- Never add letter-spacing or uppercase styling to Arabic text.
- Test shadcn components that depend on direction in RTL: Calendar, Carousel, Sheet, DropdownMenu, Tabs, Popover.
- **Mobile first**, designed at 390px wide. Touch targets at least 44px. Sticky "Book now" bar on mobile.
- Use shadcn components: `Form`, `RadioGroup`, `Checkbox`, `Calendar`, `Popover`, `ToggleGroup`, `Select`/`Combobox`, `Dialog`, `Sheet`, `Accordion`, `Tabs`, `Carousel`, `Progress`, `Skeleton`, `Sonner`, `Sidebar`, `Table`, `Chart`.

---

## 11. Internationalization

- All user-facing strings live in `src/messages/{ar,en}.json`. No hardcoded text in components.
- Dates use `Asia/Riyadh`. Format with `Intl` through next-intl. Calendar uses Gregorian by default; Hijri display is an optional later feature.
- Numbers and phone numbers: use Western digits (`0-9`) consistently. Currency displayed as `750 ر.س` (ar) and `SAR 750` (en).
- Arabic copy is the source language. English is a translation, not the other way around.

---

## 12. SEO

- Each page exports metadata (title, description, canonical, Open Graph, `hreflang` for `ar` and `en`).
- Landing pages `/bridal-makeup-riyadh` and `/occasion-makeup-riyadh` have their own headings, content and booking CTA.
- JSON-LD structured data: `LocalBusiness`/`MakeupArtist`, `Review`, `FAQPage`, `Service`. Only include review data that is real and published with consent.
- Generate `sitemap.xml` and `robots.txt`; exclude `/admin` and booking-step pages.
- Core Web Vitals matter: use `next/image`, subset fonts via `next/font`, avoid layout shift in the hero.

---

## 13. Security checklist

- Validate every input with zod on the server, even if the client already validated it.
- Rate-limit booking creation, OTP requests, review submission and login. Add Cloudflare Turnstile (or similar) to public forms.
- Verify webhook signatures and make handlers idempotent.
- Use parameterized queries (Prisma) only. No raw string-built SQL.
- Upload limits: type, size, and virus/safe-content handling for inspiration photos. Store in a private bucket with signed URLs.
- Secrets only in environment variables. Never commit `.env*` files.
- Set security headers (CSP, `X-Content-Type-Options`, `Referrer-Policy`, HSTS).

---

## 14. Environment variables

Provide `.env.example` with these keys (no real values):

```
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=
NEXT_PUBLIC_SITE_URL=
PAYMENT_PROVIDER=
PAYMENT_API_KEY=
PAYMENT_WEBHOOK_SECRET=
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_ID=
EMAIL_FROM=
EMAIL_SERVER=
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
CRON_SECRET=
```

Cron routes must require `CRON_SECRET`.

---

## 15. Testing requirements

**Unit (Vitest), required for:**
- `pricing.ts`: package + add-ons + travel fee + group discount + deposit, with rounding in halalas.
- `slots.ts`: working hours, blocked dates, capacity, travel buffer, hold expiry, timezone edges.
- `transitionBooking`: allowed and forbidden status moves.
- Phone normalization (`+966`, `05...`, with spaces).

**End-to-end (Playwright), required for:**
- Full guest booking in Arabic on a 390px viewport.
- Slot taken by another booking: the second client sees it unavailable.
- Hold expiry.
- Manage booking with OTP.
- Admin login, confirm, reschedule and cancel.

Also test the booking flow in both `ar` (RTL) and `en` (LTR).

---

## 16. Code conventions

- TypeScript strict, no `any` unless justified in a comment.
- Server Components by default. Add `"use client"` only where needed (forms, calendar, carousels).
- Co-locate zod schemas with their feature; share types from them (`z.infer`).
- Naming: components `PascalCase`, files `kebab-case`, DB models `PascalCase`, enums `SCREAMING_SNAKE`.
- Errors: return typed results from server actions (`{ ok: true, data } | { ok: false, error }`) with user-friendly Arabic/English messages from `messages/*.json`.
- Keep functions small and pure where possible. No business logic in JSX.
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`, `docs:`). Small, focused pull requests.

---

## 17. Build order

**Phase 1 (MVP):** Home, Services, About, guest booking flow, confirmation, deposit payment, WhatsApp confirmation. Admin: bookings, services, availability.

**Phase 2:** Tokenized reviews, gallery, FAQ, policies, SEO landing pages, reminders, manage-booking page with OTP, customers and payments pages.

**Phase 3:** Team and multi-artist scheduling, customer history and optional accounts (phone OTP), analytics dashboard, blog, fixed-location support.

---

## 18. How agents should work here

1. Read this file and `DESIGN.md` before starting. Inspect existing code before adding new patterns.
2. Make the smallest change that solves the task. Do not refactor unrelated code.
3. Do not invent business facts (prices, policies, certificate details, review text, statistics). Use placeholders and say so.
4. Never fake data in production paths: no made-up reviews, ratings or client counts.
5. Never run destructive database commands (`migrate reset`, `db push --force-reset`, `DROP`) without explicit approval.
6. Never commit secrets, `.env` files or real client data.
7. When something is ambiguous (payment gateway, refund policy, cancellation window), ask or leave a clearly named setting and flag it in your summary.
8. Finish every task by listing: what changed, how you tested it, and what is still open.

---

## 19. Definition of done

- Works in Arabic (RTL) and English (LTR) at 390px and desktop widths.
- Passes `pnpm lint`, `pnpm typecheck` and `pnpm test` (and e2e when the booking flow changed).
- Meets accessibility basics: contrast, visible focus, labels, errors tied to fields, no state shown by color alone.
- Server-side validation and authorization present.
- Strings are in message files; no hardcoded text.
- No hardcoded prices, dates or secrets.
- Migrations included and reversible where possible.
- Brief note in the PR describing the change and any open questions.

---

## 20. Open decisions (do not assume)

- Payment gateway (must support mada and Apple Pay in Saudi Arabia).
- Deposit percentage, cancellation and rescheduling window, refund rules.
- Final package list and prices; travel fee by neighborhood.
- WhatsApp Business API vs `wa.me` links for the MVP.
- Whether hair styling and other add-ons are offered.
- Artist pay model for future team members (per session, fixed, or commission).
- Certificate details (name, issuer, year) and real review content.
