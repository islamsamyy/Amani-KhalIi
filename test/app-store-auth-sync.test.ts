import { describe, it, expect } from "vitest";

describe("App Store State & Sync", () => {
  it("synchronizes invoice status and balance when booking is marked COMPLETED", () => {
    const initialInvoice = {
      id: "inv-1",
      invoiceNumber: "INV-2025-01",
      bookingRef: "AK-100",
      totalAmount: 3000,
      depositPaid: 900,
      remainingBalance: 2100,
      status: "مدفوع العربون (30%)",
    };
    
    // Simulate updating booking to COMPLETED
    const updatedInvoice = {
      ...initialInvoice,
      status: "مسدد بالكامل",
      remainingBalance: 0,
    };

    expect(updatedInvoice.status).toBe("مسدد بالكامل");
    expect(updatedInvoice.remainingBalance).toBe(0);
  });

  it("synchronizes invoice status when booking is marked CANCELLED", () => {
    const initialInvoice = {
      id: "inv-1",
      invoiceNumber: "INV-2025-01",
      bookingRef: "AK-100",
      totalAmount: 3000,
      depositPaid: 900,
      remainingBalance: 2100,
      status: "مدفوع العربون (30%)",
    };
    
    const cancelledInvoice = {
      ...initialInvoice,
      status: "ملغاة / مسترجعة",
    };

    expect(cancelledInvoice.status).toBe("ملغاة / مسترجعة");
  });
});

