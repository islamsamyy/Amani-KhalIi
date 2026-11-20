import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { AdminOverviewClient } from "../admin-overview-client";
import * as AppStoreModule from "@/providers/app-store-provider";
import type { BookingRecord, CustomerProfile } from "@/features/data/initial-data";

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe("AdminOverviewClient - Real Data & Dynamic Actions", () => {
  const mockUpdateBookingStatus = vi.fn();
  const mockRefreshFromDatabase = vi.fn();

  const mockBookings: BookingRecord[] = [
    {
      id: "b-1",
      ref: "AK-LIVE-101",
      clientName: "هند المانع",
      phone: "+966551112233",
      packageId: "vip-bridal",
      packageName: "باقة العروس الملكية VIP",
      date: "2025-10-15",
      timeSlot: "02:30 م",
      locationType: "HOTEL_HALL",
      venue: "فندق سانت ريجيس - الجناح الملكي",
      areaId: "north",
      totalAmount: 3500,
      depositAmount: 1050,
      remainingAmount: 2450,
      status: "CONFIRMED",
      addonIds: [],
      notes: "تفضل إطلالة سموكي خفيف مع أندر تون دافئ",
      createdAt: "2025-10-01T10:00:00Z",
    },
    {
      id: "b-2",
      ref: "AK-LIVE-102",
      clientName: "العنود الشمري الحقيقية",
      phone: "+966559988776",
      packageId: "evening-vip",
      packageName: "مكياج السهرات والمناسبات VIP",
      date: "2025-10-18",
      timeSlot: "06:00 م",
      locationType: "CLIENT_HOME",
      venue: "حي النرجس، فيلا 14",
      areaId: "north",
      totalAmount: 950,
      depositAmount: 285,
      remainingAmount: 665,
      status: "PENDING_PAYMENT",
      addonIds: [],
      notes: "بشرة جافة تحتاج ترطيب مكثف",
      createdAt: "2025-10-02T12:00:00Z",
    },
  ];

  const mockInvoices = [
    {
      id: "inv-1",
      invoiceNumber: "INV-2025-101",
      bookingRef: "AK-LIVE-101",
      clientName: "هند المانع",
      packageName: "باقة العروس الملكية VIP",
      issueDate: "2025-10-01",
      totalAmount: 3500,
      depositPaid: 1050,
      remainingBalance: 2450,
      paymentMethod: "Apple Pay" as const,
      status: "مدفوع العربون (30%)" as const,
    },
  ];

  const mockCustomers: CustomerProfile[] = [
    {
      id: "c-1",
      name: "هند المانع",
      phone: "+966551112233",
      tier: "VIP Royal",
      skinType: "مختلطة حساسة",
      undertone: "محايد نضر (Neutral)",
      favoritePalette: "Dior Backstage 001 Universal",
      totalBookings: 2,
      lastVisit: "2025-10-15",
      notes: "تفضل تثبيت قوي مضاد للدموع وأحمر شفاه نيود",
    },
  ];

  const mockGallery = [
    {
      id: "g-1",
      title: "إطلالة عروس سانت ريجيس الفاخرة",
      category: "bridal" as const,
      categoryAr: "عرائس ملكي",
      image: "/gallery/IMG_5729.webp",
      clientType: "عروس فندق سانت ريجيس",
      styleTags: ["مكياج سينمائي", "رموش Mink"],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AppStoreModule, "useAppStore").mockReturnValue({
      bookings: mockBookings,
      invoices: mockInvoices,
      customers: mockCustomers,
      gallery: mockGallery,
      updateBookingStatus: mockUpdateBookingStatus,
      refreshFromDatabase: mockRefreshFromDatabase,
      isSupabaseConnected: true,
      isSyncing: false,
      packages: [],
      addons: [],
      blogPosts: [],
      faqs: [],
      areas: [],
      blockedDates: [],
      selectedPackageId: "vip-bridal",
      setSelectedPackageId: vi.fn(),
      lastConfirmedBooking: mockBookings[0],
      setLastConfirmedBooking: vi.fn(),
      currentUser: null,
      seedDatabase: vi.fn(),
      configureSupabaseConnection: vi.fn(),
      signOutAdmin: vi.fn(),
      addPackage: vi.fn(),
      updatePackage: vi.fn(),
      togglePackageActive: vi.fn(),
      deletePackage: vi.fn(),
      createBooking: vi.fn(),
      addReview: vi.fn(),
      toggleReviewApproval: vi.fn(),
      toggleReviewFeatured: vi.fn(),
      updateCustomerNotes: vi.fn(),
      toggleBlockedDate: vi.fn(),
      addBlogPost: vi.fn(),
      updateBlogPost: vi.fn(),
      deleteBlogPost: vi.fn(),
      toggleBlogPublished: vi.fn(),
      toggleBlogFeatured: vi.fn(),
      deleteReview: vi.fn(),
      deleteBooking: vi.fn(),
      deleteInvoice: vi.fn(),
      deleteCustomer: vi.fn(),
      addGalleryLook: vi.fn(),
      updateGalleryLook: vi.fn(),
      deleteGalleryLook: vi.fn(),
      reviews: [],
    });
  });

  it("renders live active bookings sorted by date rather than hardcoded fake names", () => {
    render(<AdminOverviewClient />);

    // Must show real client "هند المانع"
    expect(screen.getByText("هند المانع")).toBeInTheDocument();
    expect(screen.getByText("فندق سانت ريجيس - الجناح الملكي")).toBeInTheDocument();

    // Must NOT contain hardcoded "نورة بنت مساعد آل سعود" or "سارة الفهيد"
    expect(screen.queryByText("نورة بنت مساعد آل سعود")).not.toBeInTheDocument();
    expect(screen.queryByText("العروس: سارة الفهيد")).not.toBeInTheDocument();
  });

  it("calls updateBookingStatus with the real booking ref when clicking session verification", () => {
    render(<AdminOverviewClient />);

    const verifyBtns = screen.getAllByRole("button", { name: "تم التوثيق" });
    fireEvent.click(verifyBtns[0]);

    expect(mockUpdateBookingStatus).toHaveBeenCalledWith("AK-LIVE-101", "COMPLETED");
  });

  it("renders live urgent pending holds and performs manual confirmation and slot release", () => {
    render(<AdminOverviewClient />);

    // Urgent holds section should display real pending client
    expect(screen.getAllByText("العنود الشمري الحقيقية").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/285/).length).toBeGreaterThanOrEqual(1); // Deposit amount

    // Click "تثبيت يدوي"
    const confirmBtn = screen.getByRole("button", { name: "تثبيت يدوي" });
    fireEvent.click(confirmBtn);
    expect(mockUpdateBookingStatus).toHaveBeenCalledWith("AK-LIVE-102", "CONFIRMED");

    // Click "إفساح"
    const releaseBtn = screen.getByRole("button", { name: "إفساح" });
    fireEvent.click(releaseBtn);
    expect(mockUpdateBookingStatus).toHaveBeenCalledWith("AK-LIVE-102", "CANCELLED");
  });

  it("opens notes modal with real customer profile data", () => {
    render(<AdminOverviewClient />);

    const notesBtns = screen.getAllByRole("button", { name: "الملاحظات" });
    fireEvent.click(notesBtns[0]);

    // Modal should show client's name and real skin notes
    expect(screen.getByText(/ملاحظات الجلسة: هند المانع/)).toBeInTheDocument();
    expect(screen.getByText(/مختلطة حساسة/)).toBeInTheDocument();
    expect(screen.getByText(/Dior Backstage 001 Universal/)).toBeInTheDocument();
  });

  it("triggers refreshFromDatabase when clicking the sync/refresh button", () => {
    render(<AdminOverviewClient />);

    const refreshBtn = screen.getByTitle("تحديث ومزامنة قاعدة البيانات");
    fireEvent.click(refreshBtn);

    expect(mockRefreshFromDatabase).toHaveBeenCalled();
  });
});
