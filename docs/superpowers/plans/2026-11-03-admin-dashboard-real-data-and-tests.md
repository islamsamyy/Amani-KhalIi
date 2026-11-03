# Admin Dashboard Real Data & Unit Testing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all dummy/placeholder data across the Admin Dashboard with live data from the backend and state store (showing latest active bookings sorted by date), polish UI/UX for RTL and responsiveness, and build a unit test suite covering admin navigation menus, drawers, and interactive buttons.

**Architecture:**
- **Store & Data Layer:** Leverage `useAppStore` in `providers/app-store-provider.tsx` and Supabase clients. Dynamically sort active bookings by date, derive urgent holds (`PENDING_PAYMENT`), calculate real financial and capacity KPIs, and feed real customer profiles into notes modals.
- **UI/UX Polishing:** Dynamic Arabic calendar date/time formatting in `Asia/Riyadh`, dynamic progress bar calculations, real WhatsApp prefilled links, real navigation links, dynamic notification generator from live pending items, and responsive shadcn drawers.
- **Testing Layer:** Configure Vitest with `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom` to test `AdminChrome` navigation, mobile drawer toggling, real-time search, action buttons, status updates, and session dialogs.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Radix UI (shadcn), Supabase (`@supabase/ssr`, `@supabase/supabase-js`), Lucide React, Sonner, Vitest, `@testing-library/react`, `jsdom`.

**Spec:** `PROJECT_SPEC.md`

## Global Constraints
- Admin dashboard must be Arabic-first, RTL (`dir="rtl"`), and mobile-responsive (390px+).
- Currency in SAR (displayed as `ر.س`), timezone `Asia/Riyadh`.
- Components must consume data via `useAppStore` and Supabase clients, never hardcoding mock clients or static dates.
- Do not break existing booking or public site functionality.

## Review Focus
1. Empty booking states: Ensure graceful fallback cards when no bookings or holds exist.
2. Booking status transitions: Ensure status updates (verify, manual confirm, release hold) update the exact booking record and trigger store/database updates.
3. Customer notes association: Ensure clicking a session's notes opens the exact customer's skin profile and notes matching the booking's client phone/name.
4. Navigation active states: Verify desktop sidebar and mobile drawer highlight the active route correctly.
5. Search filtering: Verify the search bar in `AdminChrome` handles empty queries, case-insensitivity, and clearing correctly without crashing.

---

### Task 1: Testing Framework Setup (Vitest + React Testing Library)

**Files:**
- Modify: `my-app/package.json`
- Create: `my-app/vitest.config.mts`
- Create: `my-app/test/setup.ts`
- Create: `my-app/test/smoke.test.ts`

**Interfaces:**
- Produces: `npm test` script executing Vitest in a jsdom environment with `@/` alias resolution and Jest-DOM assertions.

- [ ] **Step 1: Install testing dependencies**
  Install `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`, `@vitejs/plugin-react` in `my-app`.

- [ ] **Step 2: Create `vitest.config.mts` and `test/setup.ts`**
  Configure path aliases (`@/` -> `./`), jsdom environment, globals, and setup file importing `@testing-library/jest-dom/vitest`.

- [ ] **Step 3: Create smoke test `test/smoke.test.ts`**
  Verify basic assertions and DOM rendering work.

- [ ] **Step 4: Run test to verify testing setup**
  Run: `npm test` in `my-app`. Expected: 1 passed test.

---

### Task 2: Replace Dummy Data with Real Backend Data in Admin Overview

**Files:**
- Modify: `my-app/app/admin/_components/admin-overview-client.tsx`

**Interfaces:**
- Consumes: `bookings`, `invoices`, `customers`, `gallery`, `updateBookingStatus`, `refreshFromDatabase`, `isSupabaseConnected`, `isSyncing` from `useAppStore()`.
- Produces: Live schedule sorted by date, live pending holds, live dynamic KPIs and progress bars, dynamic weekly signature look, and customer notes inspector.

- [ ] **Step 1: Write test for Admin Overview data rendering & button actions**
  Create `my-app/app/admin/_components/__tests__/admin-overview.test.tsx` testing that:
  - Latest active bookings are sorted by date.
  - Clicking "تم التوثيق" calls `updateBookingStatus` with the booking's actual reference.
  - Urgent holds list pending payment bookings with manual confirm and release buttons.
  - Notes button opens the modal with the client's actual notes and skin info.

- [ ] **Step 2: Run test to see it fail against existing hardcoded implementation**
  Run: `npx vitest run app/admin/_components/__tests__/admin-overview.test.tsx`.

- [ ] **Step 3: Implement dynamic data integration in `admin-overview-client.tsx`**
  - Sort active bookings (`status !== "CANCELLED"`) by date/time ascending.
  - Dynamically render session cards with client name, package name, time slot, venue/hotel, status badge, and real client phone in WhatsApp link.
  - Calculate travel buffer notice dynamically if consecutive sessions are scheduled on the same day.
  - Urgent Holds: filter `bookings.filter(b => b.status === "PENDING_PAYMENT")`. Provide "تثبيت يدوي" calling `updateBookingStatus(b.ref, "CONFIRMED")` and "إفساح" calling `updateBookingStatus(b.ref, "CANCELLED")`.
  - Dynamic Arabic current date for Riyadh: `new Intl.DateTimeFormat('ar-SA', { dateStyle: 'full', timeZone: 'Asia/Riyadh' }).format(new Date())`.
  - Dynamic Progress bar values:
    * Capacity progress: `(activeTodayOrUpcoming.length / maxCapacity) * 100`.
    * Confirmed rate: `(confirmedBookings.length / bookings.length) * 100`.
    * Deposits collection rate: `(totalDeposits / totalRevenue) * 100`.
  - Signature Look: retrieve first featured or latest look from `gallery`.
  - Session notes modal: bind to `selectedCustomerProfile` from `customers` matching the session's client.

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx vitest run app/admin/_components/__tests__/admin-overview.test.tsx`. Expected: PASS.

---

### Task 3: Dynamic Notifications & Badges in Admin Navigation

**Files:**
- Modify: `my-app/components/admin-chrome.tsx`
- Modify: `my-app/components/interactive-shell.tsx`

**Interfaces:**
- Consumes: `bookings`, `reviews`, `packages`, `customers`, `invoices` from `useAppStore()`.
- Produces: Real-time badge counts on navigation menu items and dynamic notifications generated from pending bookings and unapproved reviews.

- [ ] **Step 1: Write test for dynamic notifications and badges**
  Create `my-app/components/__tests__/admin-notifications.test.tsx` verifying:
  - Unread count reflects pending bookings (`PENDING_PAYMENT`) + unapproved reviews (`!approved`).
  - Clicking "تحديد الكل كمقروء" clears the unread badge.
  - Notification items show real client names and booking details.

- [ ] **Step 2: Run test to see it fail**
  Run: `npx vitest run components/__tests__/admin-notifications.test.tsx`.

- [ ] **Step 3: Update `interactive-shell.tsx` & `admin-chrome.tsx`**
  - Generate dynamic notification items:
    * New pending booking requests with deposit amount and client name.
    * Unapproved reviews waiting for approval.
    * Recent confirmed appointments.
  - Compute unread count dynamically from active actionable items.
  - Ensure `AdminChrome` badges reflect `bookings.filter(b => b.status === "CONFIRMED").length`, `reviews.filter(r => !r.approved).length`, etc.

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx vitest run components/__tests__/admin-notifications.test.tsx`. Expected: PASS.

---

### Task 4: Unit Testing Admin Navigation Menu & Buttons

**Files:**
- Create: `my-app/components/__tests__/admin-chrome.test.tsx`

**Interfaces:**
- Tests: `AdminChrome` component navigation links, mobile drawer, search input, action buttons, profile dropdown, and logout.

- [ ] **Step 1: Write unit tests in `admin-chrome.test.tsx`**
  - Test all 9 nav items render with correct hrefs and labels.
  - Test active item styling when on `/admin`, `/admin/bookings`, etc.
  - Test mobile menu drawer button opens the drawer.
  - Test live search input updates and filters.
  - Test "إضافة حجز يدوي" button triggers `onOpenManualBooking`.
  - Test notification bell button triggers `onOpenNotifications`.
  - Test admin profile dropdown opens on click and contains calendar, settings, public site, and logout links.
  - Test logout button invokes `signOutAdmin`.

- [ ] **Step 2: Run tests to verify all pass**
  Run: `npx vitest run components/__tests__/admin-chrome.test.tsx`. Expected: PASS.

---

### Task 5: UI/UX Audit & Calendar/Settings Real Data Integration

**Files:**
- Modify: `my-app/app/admin/calendar/_components/admin-calendar-client.tsx`
- Modify: `my-app/app/admin/settings/_components/admin-settings-client.tsx`

**Interfaces:**
- Consumes: `bookings`, `blockedDates`, `toggleBlockedDate`, `areas` from `useAppStore()`.
- Produces: Dynamic month calendar navigation with real booking markers, real blocked date toggling, and persistent system settings.

- [ ] **Step 1: Write test for Calendar client**
  Create `my-app/app/admin/calendar/__tests__/admin-calendar.test.tsx` testing that:
  - Days with bookings show the booking client name.
  - Toggling blocked date calls `toggleBlockedDate`.
  - Selected day displays matching booking details.

- [ ] **Step 2: Update `admin-calendar-client.tsx`**
  - Connect current month/year dynamically (with next/prev month navigation).
  - Map store bookings to calendar days accurately.
  - Smooth blocked date toggling and inspect dialog for selected day.

- [ ] **Step 3: Update `admin-settings-client.tsx`**
  - Persist settings (deposit percentage, max sessions, WhatsApp template) in localStorage or store.
  - Toast confirmation with accurate values.

- [ ] **Step 4: Run calendar tests to verify they pass**
  Run: `npx vitest run app/admin/calendar/__tests__/admin-calendar.test.tsx`. Expected: PASS.

---

### Task 6: Full Verification & Build Check

**Files:**
- All touched files

- [ ] **Step 1: Run complete Vitest suite**
  Run: `npm test` in `my-app`. Expected: 100% tests pass.

- [ ] **Step 2: Run typecheck**
  Run: `npx tsc --noEmit` in `my-app`. Expected: 0 errors.

- [ ] **Step 3: Run production build**
  Run: `npm run build` in `my-app`. Expected: successful build.

