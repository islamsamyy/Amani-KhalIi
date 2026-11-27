"use client";

import React, { useState } from "react";
import { useAppStore } from "@/providers/app-store-provider";
import { useLanguage } from "@/providers/language-provider";
import { InvoiceRecord } from "@/features/data/initial-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  FileSpreadsheet,
  Download,
  Printer,
  DollarSign,
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { downloadCsvFile } from "@/lib/image-upload";

export function AdminInvoicesClient() {
  const { t, dir } = useLanguage();
  const { invoices, deleteInvoice } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.bookingRef.toLowerCase().includes(q) ||
      inv.clientName.toLowerCase().includes(q) ||
      inv.packageName.toLowerCase().includes(q)
    );
  });

  const totalRevenue = invoices.reduce((s, i) => s + i.totalAmount, 0);
  const totalDeposits = invoices.reduce((s, i) => s + i.depositPaid, 0);
  const totalOutstanding = invoices.reduce((s, i) => s + i.remainingBalance, 0);

  const handleExport = () => {
    const today = new Date().toISOString().split("T")[0];
    downloadCsvFile(
      `amani-invoices-${today}.csv`,
      [
        t("رقم الفاتورة", "Invoice #"),
        t("مرجع الحجز", "Booking Ref"),
        t("اسم العميلة", "Client Name"),
        t("الباقة", "Package"),
        t("تاريخ الإصدار", "Issue Date"),
        t("الإجمالي (ر.س)", "Total (SAR)"),
        t("العربون المحصل (ر.س)", "Deposit Paid (SAR)"),
        t("المتبقي (ر.س)", "Remaining (SAR)"),
        t("بوابة الدفع", "Payment Method"),
        t("الحالة", "Status"),
      ],
      filteredInvoices.map((inv) => [
        inv.invoiceNumber,
        inv.bookingRef,
        inv.clientName,
        inv.packageName,
        inv.issueDate,
        inv.totalAmount,
        inv.depositPaid,
        inv.remainingBalance,
        inv.paymentMethod,
        inv.status,
      ])
    );
    toast.success(
      t(
        `تم تصدير التقرير المالي (${filteredInvoices.length} فاتورة) بنجاح ✨`,
        `Exported financial report (${filteredInvoices.length} invoices) ✨`
      )
    );
  };

  return (
    <div dir={dir} className="lg:ps-72 transition-all duration-300">
      <main className="w-full pt-24 px-4 sm:px-6 lg:px-10 pb-16 bg-[#fff8f7] min-h-screen space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-serif text-[#2f020d]">
              {t("سجل الفواتير والمدفوعات الرسمية", "Official Invoices & Payments")}
            </h1>
            <p className="text-xs text-[#524345] mt-1">
              {t(
                "متابعة العرابين المحصلة 30%، الفواتير الإلكترونية، والمبالغ المستحقة يوم المناسبة.",
                "Monitor collected 30% deposits, digital invoices, and remaining balances due on event day."
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="rounded-full text-xs font-bold gap-1.5 bg-white"
            >
              <Download className="h-4 w-4 text-[#735c00]" />
              <span>{t("تصدير التقرير المالي", "Export Financial CSV")}</span>
            </Button>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm">
            <span className="text-xs font-bold text-[#524345] block mb-2">
              {t("إجمالي التعاقدات الرسمية", "Total Official Contracts")}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-serif text-[#2f020d]">
                {totalRevenue.toLocaleString("en-US")}
              </span>
              <span className="text-xs font-bold text-[#735c00]">{t("ر.س", "SAR")}</span>
            </div>
            <p className="text-[11px] text-[#857374] mt-2">
              {t("عبر كافة القنوات وبوابات الدفع", "Across all channels & payment gateways")}
            </p>
          </Card>

          <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm">
            <span className="text-xs font-bold text-[#524345] block mb-2">
              {t("العرابين المحصلة (30%)", "Collected Deposits (30%)")}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-serif text-emerald-700">
                {totalDeposits.toLocaleString("en-US")}
              </span>
              <span className="text-xs font-bold text-[#735c00]">{t("ر.س", "SAR")}</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-2">
              {t("مدفوعة ومؤكدة بالحساب البنكي", "Paid & verified in bank account")}
            </p>
          </Card>

          <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm">
            <span className="text-xs font-bold text-[#524345] block mb-2">
              {t("المتبقي المستحق يوم المناسبة", "Remaining Due on Event Day")}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-serif text-[#ba1a1a]">
                {totalOutstanding.toLocaleString("en-US")}
              </span>
              <span className="text-xs font-bold text-[#735c00]">{t("ر.س", "SAR")}</span>
            </div>
            <p className="text-[11px] text-[#857374] mt-2">
              {t("يُحصّل نقداً أو بالشبكة عند إنهاء الجلسة", "Collected via cash or card upon session completion")}
            </p>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#857374]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("بحث برقم الفاتورة، اسم العميلة، #AK...", "Search by invoice #, client name, #AK...")}
            className="w-full h-10 ps-10 pe-4 rounded-full border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
          />
        </div>

        {/* Invoices Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("رقم الفاتورة", "Invoice #")}</TableHead>
              <TableHead>{t("المرجع", "Ref")}</TableHead>
              <TableHead>{t("اسم العميلة", "Client Name")}</TableHead>
              <TableHead>{t("الباقة", "Package")}</TableHead>
              <TableHead>{t("الإجمالي", "Total")}</TableHead>
              <TableHead>{t("العربون المحصل", "Deposit Paid")}</TableHead>
              <TableHead>{t("المتبقي", "Remaining")}</TableHead>
              <TableHead>{t("بوابة الدفع", "Payment Method")}</TableHead>
              <TableHead>{t("الحالة", "Status")}</TableHead>
              <TableHead className="w-24 text-center">{t("الإجراءات", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((inv) => (
              <TableRow
                key={inv.id}
                onClick={() => setSelectedInvoice(inv)}
                className="cursor-pointer hover:bg-[#fff0f1]/70 transition-colors"
              >
                <TableCell className="font-mono font-bold text-xs text-[#2f020d]">
                  {inv.invoiceNumber}
                </TableCell>
                <TableCell className="font-mono text-xs text-[#735c00]">
                  #{inv.bookingRef}
                </TableCell>
                <TableCell className="font-bold text-xs text-[#2f020d]">
                  {inv.clientName}
                </TableCell>
                <TableCell className="text-xs text-[#524345]">
                  {inv.packageName}
                </TableCell>
                <TableCell className="font-bold text-xs font-serif text-[#2f020d]">
                  {inv.totalAmount.toLocaleString("en-US")} {t("ر.س", "SAR")}
                </TableCell>
                <TableCell className="text-xs font-bold text-emerald-700">
                  {inv.depositPaid.toLocaleString("en-US")} {t("ر.س", "SAR")}
                </TableCell>
                <TableCell className="text-xs font-bold text-[#ba1a1a]">
                  {inv.remainingBalance.toLocaleString("en-US")} {t("ر.س", "SAR")}
                </TableCell>
                <TableCell className="text-xs text-[#524345]">
                  {inv.paymentMethod}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                    {inv.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setSelectedInvoice(inv)}
                      title={t("معاينة تفاصيل الفاتورة", "View invoice details")}
                      className="h-8 w-8 rounded-full bg-[#faeaeb] hover:bg-[#eedfe0] flex items-center justify-center text-[#2f020d] transition-colors cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          confirm(
                            t(
                              `هل أنتِ متأكدة من حذف الفاتورة "${inv.invoiceNumber}" نهائياً؟`,
                              `Are you sure you want to permanently delete invoice "${inv.invoiceNumber}"?`
                            )
                          )
                        ) {
                          deleteInvoice(inv.id);
                        }
                      }}
                      title={t("حذف الفاتورة نهائياً", "Delete invoice permanently")}
                      className="h-8 w-8 rounded-full bg-white hover:bg-rose-50 text-rose-600 border border-[#eedfe0] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Invoice Inspector Dialog */}
        <Dialog
          open={selectedInvoice !== null}
          onOpenChange={(open) => !open && setSelectedInvoice(null)}
        >
          <DialogContent dir={dir} className="max-w-md bg-[#fff8f7] border border-[#d7c1c3] p-6 text-start">
            {selectedInvoice && (
              <div className="space-y-4">
                <DialogHeader className="text-start">
                  <DialogTitle className="text-lg font-bold text-[#2f020d]">
                    {t("فاتورة:", "Invoice:")} {selectedInvoice.invoiceNumber}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-[#524345]">
                    {t("حجز", "Booking")} #{selectedInvoice.bookingRef} • {selectedInvoice.clientName}
                  </DialogDescription>
                </DialogHeader>

                <div className="p-4 rounded-2xl bg-white border border-[#eedfe0] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>{t("الباقة:", "Package:")}</span>
                    <strong>{selectedInvoice.packageName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("الإجمالي الكلي:", "Grand Total:")}</span>
                    <strong>{selectedInvoice.totalAmount.toLocaleString("en-US")} {t("ر.س", "SAR")}</strong>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>{t("العربون المسدد:", "Deposit Paid:")}</span>
                    <span>{selectedInvoice.depositPaid.toLocaleString("en-US")} {t("ر.س", "SAR")}</span>
                  </div>
                  <div className="flex justify-between text-[#ba1a1a] font-bold">
                    <span>{t("المتبقي المستحق:", "Remaining Balance:")}</span>
                    <span>{selectedInvoice.remainingBalance.toLocaleString("en-US")} {t("ر.س", "SAR")}</span>
                  </div>
                  <div className="flex justify-between text-[#524345] pt-2 border-t border-[#eedfe0]">
                    <span>{t("طريقة الدفع:", "Payment Method:")}</span>
                    <span>{selectedInvoice.paymentMethod}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        toast.success(t("جارٍ طباعة الفاتورة...", "Printing invoice..."));
                        window.print();
                      }}
                      className="rounded-full bg-[#4a1521] text-white text-xs font-bold"
                    >
                      <Printer className="h-3.5 w-3.5 ms-1" />
                      <span>{t("طباعة", "Print")}</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (
                          confirm(
                            t(
                              `هل أنتِ متأكدة من حذف الفاتورة "${selectedInvoice.invoiceNumber}" نهائياً؟`,
                              `Are you sure you want to permanently delete invoice "${selectedInvoice.invoiceNumber}"?`
                            )
                          )
                        ) {
                          deleteInvoice(selectedInvoice.id);
                          setSelectedInvoice(null);
                        }
                      }}
                      className="rounded-full text-rose-600 border-rose-200 hover:bg-rose-50 text-xs font-bold gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>{t("حذف الفاتورة", "Delete Invoice")}</span>
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedInvoice(null)}
                    className="rounded-full text-xs"
                  >
                    {t("إغلاق", "Close")}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

