import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { InteractiveShell } from "../interactive-shell";
import * as AppStoreModule from "@/providers/app-store-provider";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => "/admin",
  useRouter: () => ({
    push: mockPush,
    refresh: vi.fn(),
  }),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe("Dynamic Notifications Center & Navigation Badges", () => {
  const mockBookings = [
    {
      id: "b-1",
      ref: "AK-NOTIF-01",
      clientName: "عبير السبيعي",
      phone: "+966500000001",
      packageId: "vip-bridal",
      packageName: "باقة العروس الملكية VIP",
      date: "2025-10-20",
      timeSlot: "04:00 م",
      locationType: "HOTEL_HALL" as const,
      venue: "فندق الفورسيزونز",
      areaId: "central",
      totalAmount: 2800,
      depositAmount: 840,
      remainingAmount: 1960,
      status: "PENDING_PAYMENT" as const,
      addonIds: [],
      createdAt: "2025-10-05T12:00:00Z",
    },
  ];

  const mockReviews = [
    {
      id: "r-1",
      clientName: "مشاعل القرني",
      packageTitle: "باقة الملكة الفاخرة",
      rating: 5,
      date: "أمس",
      venue: "الرياض",
      comment: "مكياج لا يُعلى عليه وثبات أسطوري!",
      approved: false,
      featured: false,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AppStoreModule, "useAppStore").mockReturnValue({
      bookings: mockBookings,
      reviews: mockReviews,
      packages: [
        {
          id: "pkg-1",
          title: "باقة العروس الملكية VIP",
          titleEn: "VIP",
          price: 2800,
          depositPercentage: 30,
          duration: "4 ساعات",
          category: "bridal",
          active: true,
          description: "وصف",
          features: [],
        },
      ],
      addons: [],
      invoices: [],
      customers: [],
      gallery: [],
      blogPosts: [],
      faqs: [],
      areas: [],
      blockedDates: [],
      selectedPackageId: "pkg-1",
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
      deleteGalleryLook: vi.fn(),
    });
  });

  it("renders live dynamic notifications instead of hardcoded mock strings", () => {
    render(
      <InteractiveShell>
        <div>Admin Content</div>
      </InteractiveShell>
    );

    // Open notifications dialog by clicking the bell button
    const bellBtn = screen.getByRole("button", { name: "الإشعارات" });
    fireEvent.click(bellBtn);

    // Dialog should display live pending booking alert for "عبير السبيعي"
    expect(screen.getByText(/عبير السبيعي/)).toBeInTheDocument();
    expect(screen.getByText(/#AK-NOTIF-01/)).toBeInTheDocument();

    // Dialog should display live unapproved review for "مشاعل القرني"
    expect(screen.getByText(/مشاعل القرني/)).toBeInTheDocument();

    // Must NOT contain old hardcoded mock names
    expect(screen.queryByText("سارة بنت عبدالله")).not.toBeInTheDocument();
    expect(screen.queryByText("نورة السديري")).not.toBeInTheDocument();
  });

  it("clears unread badge when clicking 'تحديد الكل كمقروء'", () => {
    render(
      <InteractiveShell>
        <div>Admin Content</div>
      </InteractiveShell>
    );

    const bellBtn = screen.getByRole("button", { name: "الإشعارات" });
    fireEvent.click(bellBtn);

    const clearBtn = screen.getByRole("button", { name: "تحديد الكل كمقروء" });
    fireEvent.click(clearBtn);

    // Re-open notifications dialog to verify zero unread state
    fireEvent.click(bellBtn);
    expect(screen.getByText("لا توجد تنبيهات غير مقروءة")).toBeInTheDocument();
  });
});
