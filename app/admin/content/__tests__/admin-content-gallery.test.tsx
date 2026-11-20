import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminContentClient } from "../_components/admin-content-client";
import * as AppStoreModule from "@/providers/app-store-provider";
import { normalizeImageSrc } from "@/lib/image-upload";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("AdminContentClient - Gallery Image Upload, Edit & Broken Image Recovery", () => {
  const mockAddGalleryLook = vi.fn();
  const mockUpdateGalleryLook = vi.fn();
  const mockDeleteGalleryLook = vi.fn();

  const mockGallery = [
    {
      id: "gal-1",
      title: "مكياج السهرات والمناسبات VIP",
      category: "evening" as const,
      categoryAr: "سهرات ومناسبات",
      image: "C:\\Users\\fake\\broken-local-path.jpg",
      clientType: "عميلة ملكية",
      styleTags: ["سهرة", "فخم"],
    },
    {
      id: "gal-2",
      title: "إطلالة ملكة ناعمة",
      category: "engagement" as const,
      categoryAr: "خطوبة وملكة",
      image: "/gallery/IMG_5730.webp",
      clientType: "حفل عقد قران خاص",
      styleTags: ["ناعم"],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.spyOn(AppStoreModule, "useAppStore").mockReturnValue({
      reviews: [],
      gallery: mockGallery,
      addGalleryLook: mockAddGalleryLook,
      updateGalleryLook: mockUpdateGalleryLook,
      deleteGalleryLook: mockDeleteGalleryLook,
      toggleReviewApproval: vi.fn(),
      toggleReviewFeatured: vi.fn(),
      deleteReview: vi.fn(),
      bookings: [],
      invoices: [],
      customers: [],
      packages: [],
      addons: [],
      blogPosts: [],
      faqs: [],
      areas: [],
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
      addReview: vi.fn(),
      updateCustomerNotes: vi.fn(),
      toggleBlockedDate: vi.fn(),
      addBlogPost: vi.fn(),
      updateBlogPost: vi.fn(),
      deleteBlogPost: vi.fn(),
      toggleBlogPublished: vi.fn(),
      toggleBlogFeatured: vi.fn(),
    });
  });

  it("normalizes relative image paths and rejects invalid local disk paths", () => {
    expect(normalizeImageSrc("gallery/IMG_5729.webp")).toBe("/gallery/IMG_5729.webp");
    expect(normalizeImageSrc("/gallery/IMG_5730.webp")).toBe("/gallery/IMG_5730.webp");
    expect(normalizeImageSrc("https://example.com/look.jpg")).toBe("https://example.com/look.jpg");
    expect(normalizeImageSrc("data:image/jpeg;base64,abc")).toBe("data:image/jpeg;base64,abc");
    expect(normalizeImageSrc("C:\\Users\\Eslam\\photo.jpg")).toBe("");
    expect(normalizeImageSrc("file:///Users/test/photo.jpg")).toBe("");
  });

  it("shows broken image recovery UI and lets admin edit and replace the look image", async () => {
    const user = userEvent.setup();
    render(<AdminContentClient />);

    // Switch to Gallery tab
    const galleryTab = screen.getByRole("tab", { name: /معرض الصور/ });
    await user.click(galleryTab);

    // The broken local path card shows recovery UI instead of broken image icon
    expect(screen.getByText("الصورة غير متوفرة")).toBeInTheDocument();
    const fixBtn = screen.getByRole("button", { name: "رفع صورة بديلة" });
    await user.click(fixBtn);

    // Edit modal opens with existing title
    expect(screen.getByText("تعديل الإطلالة وتحديث الصورة")).toBeInTheDocument();
    const titleInput = screen.getByDisplayValue("مكياج السهرات والمناسبات VIP");
    expect(titleInput).toBeInTheDocument();

    // Switch to Studio Presets tab in uploader and choose a valid image
    await user.click(screen.getByRole("button", { name: "ألبوم الأتيليه" }));
    const presetBtn = screen.getByTitle("إطلالة سهرة فاخرة");
    await user.click(presetBtn);

    // Submit edits
    await user.click(screen.getByRole("button", { name: "حفظ التعديلات" }));

    await waitFor(() => {
      expect(mockUpdateGalleryLook).toHaveBeenCalledWith(
        "gal-1",
        expect.objectContaining({
          title: "مكياج السهرات والمناسبات VIP",
          image: "/gallery/IMG_5731.webp",
        })
      );
    });
  });

  it("uploads an image file from device and publishes a new look", async () => {
    const user = userEvent.setup();
    render(<AdminContentClient />);

    await user.click(screen.getByRole("tab", { name: /معرض الصور/ }));
    await user.click(screen.getByRole("button", { name: /إضافة إطلالة جديدة/ }));

    const fileInput = screen.getByLabelText("رفع صورة من الجهاز") as HTMLInputElement;
    const mockFile = new File(["dummy-image-bytes"], "bridal-look.jpg", {
      type: "image/jpeg",
    });

    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    const titleInput = screen.getByPlaceholderText(/مثال: مكياج العروس الملكي/);
    fireEvent.change(titleInput, { target: { value: "إطلالة عروس الرياض الجديدة" } });

    // Wait for FileReader to produce data URL
    await waitFor(() => {
      const previewImg = screen.getByAltText("معاينة الصورة") as HTMLImageElement;
      expect(previewImg.src).toContain("data:image/");
    });

    await user.click(screen.getByRole("button", { name: "نشر في المعرض" }));

    await waitFor(() => {
      expect(mockAddGalleryLook).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "إطلالة عروس الرياض الجديدة",
          image: expect.stringContaining("data:image/"),
        })
      );
    });
  });

  it("persists contract clauses to localStorage on save", async () => {
    const user = userEvent.setup();
    render(<AdminContentClient />);

    await user.click(screen.getByRole("tab", { name: /بنود العقد والسياسات الرسمية/ }));
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "بند محدث رسمي للعقد" } });

    await user.click(screen.getByRole("button", { name: /تحديث وحفظ بنود العقد/ }));
    expect(localStorage.getItem("amani_contract_clauses_v1")).toBe("بند محدث رسمي للعقد");
  });
});
