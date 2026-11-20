import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HomeClient } from "../home-client";
import { LuxuryCountersAndInteractive } from "../_components/luxury-counters-interactive";
import { SignatureStyleFinder } from "../_components/signature-style-finder";
import { BridalTimelineHygiene } from "../_components/bridal-timeline-hygiene";
import { RiyadhCoverageSection } from "../_components/riyadh-coverage-section";
import { HomeBlogFaqCta } from "../_components/home-blog-faq-cta";
import * as AppStoreModule from "@/providers/app-store-provider";
import {
  INITIAL_PACKAGES,
  INITIAL_ADDONS,
  INITIAL_REVIEWS,
  INITIAL_GALLERY,
  INITIAL_BLOG_POSTS,
  INITIAL_FAQS,
  INITIAL_AREAS,
} from "@/features/data/initial-data";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Home Page Senior UI/UX Enhancements", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AppStoreModule, "useAppStore").mockReturnValue({
      packages: INITIAL_PACKAGES,
      addons: INITIAL_ADDONS,
      bookings: [],
      invoices: [],
      customers: [],
      reviews: INITIAL_REVIEWS,
      gallery: INITIAL_GALLERY,
      blogPosts: INITIAL_BLOG_POSTS,
      faqs: INITIAL_FAQS,
      areas: INITIAL_AREAS,
      blockedDates: [],
      selectedPackageId: "vip-bridal",
      setSelectedPackageId: vi.fn(),
      lastConfirmedBooking: null,
      setLastConfirmedBooking: vi.fn(),
      isSupabaseConnected: true,
      isSyncing: false,
      currentUser: null,
      refreshFromDatabase: vi.fn(),
      seedDatabase: vi.fn(),
      configureSupabaseConnection: vi.fn(),
      signOutAdmin: vi.fn(),
      addPackage: vi.fn(),
      updatePackage: vi.fn(),
      togglePackageActive: vi.fn(),
      deletePackage: vi.fn(),
      createBooking: vi.fn(),
      updateBookingStatus: vi.fn(),
      deleteBooking: vi.fn(),
      deleteInvoice: vi.fn(),
      deleteCustomer: vi.fn(),
      addGalleryLook: vi.fn(),
      updateGalleryLook: vi.fn(),
      deleteGalleryLook: vi.fn(),
      addReview: vi.fn(),
      toggleReviewApproval: vi.fn(),
      toggleReviewFeatured: vi.fn(),
      deleteReview: vi.fn(),
      updateCustomerNotes: vi.fn(),
      toggleBlockedDate: vi.fn(),
      addBlogPost: vi.fn(),
      updateBlogPost: vi.fn(),
      deleteBlogPost: vi.fn(),
      toggleBlogPublished: vi.fn(),
      toggleBlogFeatured: vi.fn(),
    });
  });

  it("renders single non-duplicate hero overlay controls and all new luxury sections", () => {
    const { container } = render(<HomeClient />);

    // Hero controls must appear only once (fixed duplicate overlay bug)
    expect(
      screen.getAllByRole("button", { name: "تكبير صورة الاستوديو بالحجم الكامل" })
    ).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "الصورة السابقة" })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "الصورة التالية" })).toHaveLength(1);

    // Standardized Western stats in Hero
    expect(screen.getByText("+10 سنوات")).toBeInTheDocument();
    expect(screen.getAllByText("+1,500").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("4.9 ★").length).toBeGreaterThanOrEqual(1);

    // Hero WhatsApp direct button with updated number
    expect(screen.getByText("+966 50 465 5724")).toBeInTheDocument();
    const waLinks = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href") === "https://wa.me/966504655724");
    expect(waLinks.length).toBeGreaterThanOrEqual(1);

    // Brands slideshow is 2nd section; VenuesTrustStrip is removed
    const sections = container.querySelectorAll("section");
    expect(sections[1]).toHaveAttribute("aria-label", "الماركات العالمية الفاخرة المعتمدة");
    expect(screen.getAllByText("DIOR").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.queryByText("نُخبة قصور وفنادق الرياض التي نتشرف بخدمة عرائسها:")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("اختبري ثبات الإطلالة تحت إضاءة مناسبتكِ")
    ).not.toBeInTheDocument();
    expect(screen.getByText("اختاري توقيع إطلالتكِ قبل الحجز")).toBeInTheDocument();
    expect(
      screen.getByText("رحلة تجهيزكِ خطوة بخطوة حتى لحظة الزفة")
    ).toBeInTheDocument();
    expect(screen.getByText("ميثاق التعقيم والخصوصية الملكي")).toBeInTheDocument();
    expect(
      screen.getByText("خدمة التجهيز في مقركِ بجميع أحياء وفنادق الرياض")
    ).toBeInTheDocument();
    expect(screen.getByText("أسرار العروس من دفتر أماني خليل")).toBeInTheDocument();
  });

  it("renders LuxuryCountersAndInteractive animated counters", () => {
    render(<LuxuryCountersAndInteractive />);

    expect(screen.getByText("+1,500")).toBeInTheDocument();
    expect(screen.getByText("18 ساعة")).toBeInTheDocument();
    expect(screen.getByText("4.9 ★")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("switches signature styles interactively and pre-selects matching package", async () => {
    const user = userEvent.setup();
    const onSelectStyle = vi.fn();
    render(<SignatureStyleFinder onSelectStyle={onSelectStyle} />);

    // Click Velvet Bronze Glam tab
    const bronzeTab = screen.getByRole("tab", { name: /سهرة مخملية برونزية/ });
    await user.click(bronzeTab);

    expect(bronzeTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Pat McGrath Bronze Palette")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /احجزي هذا الستايل الآن/ }));
    expect(onSelectStyle).toHaveBeenCalledWith("evening-vip", "سهرة مخملية برونزية");
  });

  it("renders BridalTimelineHygiene 4 stages and 4 medical hygiene pillars", () => {
    render(<BridalTimelineHygiene />);
    expect(screen.getByText("قبل 21 يوماً")).toBeInTheDocument();
    expect(screen.getByText("تعقيم طبي 100% (CIDESCO)")).toBeInTheDocument();
    expect(screen.getByText("سرية تامة وميثاق خصوصية")).toBeInTheDocument();
  });

  it("renders RiyadhCoverageSection from store areas and triggers area selection", async () => {
    const user = userEvent.setup();
    const onSelectArea = vi.fn();
    render(<RiyadhCoverageSection onSelectArea={onSelectArea} />);

    expect(screen.getByText(INITIAL_AREAS[0].nameAr)).toBeInTheDocument();
    const areaButtons = screen.getAllByRole("button", { name: /احجزي في هذا النطاق/ });
    expect(areaButtons).toHaveLength(INITIAL_AREAS.length);

    await user.click(areaButtons[0]);
    expect(onSelectArea).toHaveBeenCalledWith(INITIAL_AREAS[0].id, INITIAL_AREAS[0].nameAr);
  });

  it("renders live published blog posts and expands FAQ accordion items", async () => {
    const user = userEvent.setup();
    render(<HomeBlogFaqCta />);

    const publishedPosts = INITIAL_BLOG_POSTS.filter((p) => p.published);
    expect(screen.getByText(publishedPosts[0].title)).toBeInTheDocument();

    // Click first FAQ item to expand answer
    const firstFaqBtn = screen.getByRole("button", { name: INITIAL_FAQS[0].question });
    await user.click(firstFaqBtn);
    expect(screen.getByText(INITIAL_FAQS[0].answer)).toBeVisible();
  });
});
