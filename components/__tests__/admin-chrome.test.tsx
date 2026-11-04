import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AdminChrome } from "../admin-chrome";
import * as AppStoreModule from "@/providers/app-store-provider";

const mockPush = vi.fn();
const mockRefresh = vi.fn();
let mockPathname = "/admin";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe("AdminChrome - Navigation Menu & Interactive Buttons", () => {
  const mockOnOpenManualBooking = vi.fn();
  const mockOnOpenNotifications = vi.fn();
  const mockSignOutAdmin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockPathname = "/admin";
    vi.spyOn(AppStoreModule, "useAppStore").mockReturnValue({
      bookings: [
        {
          id: "b-1",
          ref: "AK-1",
          clientName: "هند",
          phone: "055",
          packageId: "p-1",
          packageName: "باقة 1",
          date: "2025-10-10",
          timeSlot: "10:00",
          locationType: "STUDIO",
          venue: "أتيليه",
          areaId: "a-1",
          totalAmount: 1000,
          depositAmount: 300,
          remainingAmount: 700,
          status: "CONFIRMED",
          addonIds: [],
          createdAt: "",
        },
      ],
      reviews: [
        {
          id: "r-1",
          clientName: "نورة",
          packageTitle: "باقة 1",
          rating: 5,
          date: "",
          venue: "",
          comment: "",
          approved: false,
          featured: false,
        },
      ],
      packages: [
        {
          id: "pkg-1",
          title: "باقة 1",
          titleEn: "P1",
          price: 1000,
          depositPercentage: 30,
          duration: "ساعتان",
          category: "bridal",
          active: true,
          description: "",
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
      currentUser: {
        id: "mock-user-1",
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: "",
        email: "admin@amanikhalil.sa",
      } as unknown as import("@supabase/supabase-js").User,
      refreshFromDatabase: vi.fn(),
      seedDatabase: vi.fn(),
      configureSupabaseConnection: vi.fn(),
      signOutAdmin: mockSignOutAdmin,
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

  it("renders all 9 primary navigation items with correct labels and links", () => {
    render(
      <AdminChrome
        onOpenManualBooking={mockOnOpenManualBooking}
        onOpenNotifications={mockOnOpenNotifications}
        unreadCount={2}
      />
    );

    expect(screen.getAllByText("النظرة العامة والنشاط").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("جدول الحجوزات والمواعيد").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("تقويم الزفاف والأجندة").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("إدارة الخدمات والباقات").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("الفواتير والمدفوعات").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("سجل العميلات (CRM)").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("المحتوى والتقييمات").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("إدارة المدونة والمقالات").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("الإعدادات والصلاحيات").length).toBeGreaterThanOrEqual(1);
  });

  it("highlights the active navigation link based on current route", () => {
    mockPathname = "/admin/bookings";
    render(
      <AdminChrome
        onOpenManualBooking={mockOnOpenManualBooking}
        onOpenNotifications={mockOnOpenNotifications}
        unreadCount={0}
      />
    );

    const bookingsLinks = screen.getAllByRole("link", { name: /جدول الحجوزات والمواعيد/ });
    const desktopLink = bookingsLinks[0];
    expect(desktopLink.className).toContain("bg-[#4a1521]");
    expect(desktopLink.className).toContain("text-white");
  });

  it("triggers onOpenManualBooking when clicking 'إضافة حجز يدوي'", () => {
    render(
      <AdminChrome
        onOpenManualBooking={mockOnOpenManualBooking}
        onOpenNotifications={mockOnOpenNotifications}
        unreadCount={0}
      />
    );

    const manualBtn = screen.getByRole("button", { name: /إضافة حجز يدوي/ });
    fireEvent.click(manualBtn);

    expect(mockOnOpenManualBooking).toHaveBeenCalledTimes(1);
  });

  it("triggers onOpenNotifications and renders unread count badge when clicking bell button", () => {
    render(
      <AdminChrome
        onOpenManualBooking={mockOnOpenManualBooking}
        onOpenNotifications={mockOnOpenNotifications}
        unreadCount={5}
      />
    );

    const notifBtn = screen.getByRole("button", { name: "الإشعارات" });
    expect(screen.getByText("5")).toBeInTheDocument();

    fireEvent.click(notifBtn);
    expect(mockOnOpenNotifications).toHaveBeenCalledTimes(1);
  });

  it("filters search input and provides clear button", () => {
    render(
      <AdminChrome
        onOpenManualBooking={mockOnOpenManualBooking}
        onOpenNotifications={mockOnOpenNotifications}
        unreadCount={0}
      />
    );

    const searchInput = screen.getByPlaceholderText(/بحث فوري بالاسم/);
    fireEvent.change(searchInput, { target: { value: "سارة" } });
    expect((searchInput as HTMLInputElement).value).toBe("سارة");

    const clearBtn = screen.getByRole("button", { name: "مسح البحث" });
    fireEvent.click(clearBtn);
    expect((searchInput as HTMLInputElement).value).toBe("");
  });

  it("toggles admin profile dropdown menu and executes logout", async () => {
    render(
      <AdminChrome
        onOpenManualBooking={mockOnOpenManualBooking}
        onOpenNotifications={mockOnOpenNotifications}
        unreadCount={0}
      />
    );

    const profileTrigger = screen.getByText("أ.خ").closest("button");
    expect(profileTrigger).toBeInTheDocument();
    fireEvent.click(profileTrigger!);

    // Dropdown should be visible with user email and logout options
    expect(screen.getByText("admin@amanikhalil.sa")).toBeInTheDocument();
    expect(screen.getByText("أجندة حجوزات العرائس")).toBeInTheDocument();

    const logoutBtn = screen.getByRole("button", { name: "تسجيل الخروج" });
    await fireEvent.click(logoutBtn);

    expect(mockSignOutAdmin).toHaveBeenCalledTimes(1);
    await vi.waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/admin/login");
    });
  });

  it("opens mobile navigation drawer when clicking mobile menu hamburger button", () => {
    render(
      <AdminChrome
        onOpenManualBooking={mockOnOpenManualBooking}
        onOpenNotifications={mockOnOpenNotifications}
        unreadCount={0}
      />
    );

    const mobileMenuBtn = screen.getByRole("button", { name: "فتح القائمة الإدارية" });
    fireEvent.click(mobileMenuBtn);

    expect(screen.getByText("لوحة التحكم الملكية")).toBeInTheDocument();
    expect(screen.getByText("إدارة المواعيد، الباقات، الفواتير، وملفات العرائس.")).toBeInTheDocument();
  });
});
