import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AdminCalendarClient } from "../_components/admin-calendar-client";
import * as AppStoreModule from "@/providers/app-store-provider";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe("AdminCalendarClient - Dynamic Calendar & Real Bookings", () => {
  const mockToggleBlockedDate = vi.fn();

  const mockBookings = [
    {
      id: "b-cal-1",
      ref: "AK-CAL-01",
      clientName: "دلال القحطاني",
      phone: "+966551234567",
      packageId: "vip-bridal",
      packageName: "باقة العروس الملكية VIP",
      date: "2025-10-15",
      timeSlot: "03:00 م",
      locationType: "HOTEL_HALL" as const,
      venue: "فندق الريتز كارلتون",
      areaId: "central",
      totalAmount: 3500,
      depositAmount: 1050,
      remainingAmount: 2450,
      status: "CONFIRMED" as const,
      addonIds: [],
      createdAt: "",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AppStoreModule, "useAppStore").mockReturnValue({
      bookings: mockBookings,
      blockedDates: ["2025-10-14", "2025-10-21"],
      toggleBlockedDate: mockToggleBlockedDate,
      packages: [],
      addons: [],
      invoices: [],
      customers: [],
      reviews: [],
      gallery: [],
      blogPosts: [],
      faqs: [],
      areas: [],
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
      addReview: vi.fn(),
      toggleReviewApproval: vi.fn(),
      toggleReviewFeatured: vi.fn(),
      updateCustomerNotes: vi.fn(),
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
    });
  });

  it("displays real booking markers on the calendar matching booking date", () => {
    render(<AdminCalendarClient initialDate="2025-10-09" />);

    // Click on day 15 which has booking for "دلال القحطاني"
    const day15Buttons = screen.getAllByRole("button").filter((b) => b.textContent?.includes("15"));
    expect(day15Buttons.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(day15Buttons[0]);

    // Inspector should display booking details for "دلال القحطاني"
    expect(screen.getByText("دلال القحطاني")).toBeInTheDocument();
    expect(screen.getByText("#AK-CAL-01")).toBeInTheDocument();
    expect(screen.getByText("فندق الريتز كارلتون")).toBeInTheDocument();
  });

  it("toggles blocked date when clicking lock/unlock button", () => {
    render(<AdminCalendarClient initialDate="2025-10-09" />);

    // Click on day 9
    const day9Buttons = screen.getAllByRole("button").filter((b) => b.textContent?.includes("9"));
    fireEvent.click(day9Buttons[0]);

    // Click toggle blocked date button
    const toggleBtn = screen.getByRole("button", { name: /إغلاق تاريخ/ });
    fireEvent.click(toggleBtn);

    expect(mockToggleBlockedDate).toHaveBeenCalledWith("2025-10-09");
  });
});
