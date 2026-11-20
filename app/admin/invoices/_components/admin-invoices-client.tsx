"use client";

import React, { useState } from "react";
import { useAppStore } from "@/providers/app-store-provider";
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
      ["رقم الفاتورة", "مرجع الحجز", "اسم العميلة", "الباقة", "تاريخ الإصدار", "الإجمالي (ر.س)", "العربون المحصل (ر.س)", "المتبقي (ر.س)", "بوابة الدفع", "الحالة"],
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
    toast.success(`تم تصدير التقرير المالي (${filteredInvoices.length} فاتورة) بنجاح ✨`);
  };

  return (
    <div dir="rtl" className="lg:pr-72 transition-all duration-300">
      <main className="w-full pt-24 px-4 sm:px-6 lg:px-10 pb-16 bg-[#fff8f7] min-h-screen space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-serif text-[#2f020d]">سجل الفواتير والمدفوعات الرسمية</h1>
            <p className="text-xs text-[#524345] mt-1">
              متابعة العرابين المحصلة 30%، الفواتير الإلكترونية، والمبالغ المستحقة يوم المناسبة.
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
              <span>تصدير التقرير المالي</span>
            </Button>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm">
            <span className="text-xs font-bold text-[#524345] block mb-2">إجمالي التعاقدات الرسمية</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-serif text-[#2f020d]">
                {totalRevenue.toLocaleString("ar-SA")}
              </span>
              <span className="text-xs font-bold text-[#735c00]">ر.س</span>
            </div>
            <p className="text-[11px] text-[#857374] mt-2">عبر كافة القنوات وبوابات الدفع</p>
          </Card>

          <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm">
            <span className="text-xs font-bold text-[#524345] block mb-2">العرابين المحصلة (30%)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-serif text-emerald-700">
                {totalDeposits.toLocaleString("ar-SA")}
              </span>
              <span className="text-xs font-bold text-[#735c00]">ر.س</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-2">مدفوعة ومؤكدة بالحساب البنكي</p>
          </Card>

          <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm">
            <span className="text-xs font-bold text-[#524345] block mb-2">المتبقي المستحق يوم المناسبة</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-serif text-[#ba1a1a]">
                {totalOutstanding.toLocaleString("ar-SA")}
              </span>
              <span className="text-xs font-bold text-[#735c00]">ر.س</span>
            </div>
            <p className="text-[11px] text-[#857374] mt-2">يُحصّل نقداً أو بالشبكة عند إنهاء الجلسة</p>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#857374]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث برقم الفاتورة، اسم العميلة، #AK..."
            className="w-full h-10 ps-10 pe-4 rounded-full border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
          />
        </div>

        {/* Invoices Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم الفاتورة</TableHead>
              <TableHead>المرجع</TableHead>
              <TableHead>اسم العميلة</TableHead>
              <TableHead>الباقة</TableHead>
              <TableHead>الإجمالي</TableHead>
              <TableHead>العربون المحصل</TableHead>
              <TableHead>المتبقي</TableHead>
              <TableHead>بوابة الدفع</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="w-24 text-center">الإجراءات</TableHead>
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
                  {inv.totalAmount.toLocaleString("ar-SA")} ر.س
                </TableCell>
                <TableCell className="text-xs font-bold text-emerald-700">
                  {inv.depositPaid.toLocaleString("ar-SA")} ر.س
                </TableCell>
                <TableCell className="text-xs font-bold text-[#ba1a1a]">
                  {inv.remainingBalance.toLocaleString("ar-SA")} ر.س
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
                      title="معاينة تفاصيل الفاتورة"
                      className="h-8 w-8 rounded-full bg-[#faeaeb] hover:bg-[#eedfe0] flex items-center justify-center text-[#2f020d] transition-colors cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`هل أنتِ متأكدة من حذف الفاتورة "${inv.invoiceNumber}" نهائياً؟`)) {
                          deleteInvoice(inv.id);
                        }
                      }}
                      title="حذف الفاتورة نهائياً"
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
          <DialogContent className="max-w-md bg-[#fff8f7] border border-[#d7c1c3] p-6 text-right">
            {selectedInvoice && (
              <div className="space-y-4">
                <DialogHeader className="text-right">
                  <DialogTitle className="text-lg font-bold text-[#2f020d]">
                    فاتورة: {selectedInvoice.invoiceNumber}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-[#524345]">
                    حجز #{selectedInvoice.bookingRef} • {selectedInvoice.clientName}
                  </DialogDescription>
                </DialogHeader>

                <div className="p-4 rounded-2xl bg-white border border-[#eedfe0] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>الباقة:</span>
                    <strong>{selectedInvoice.packageName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>الإجمالي الكلي:</span>
                    <strong>{selectedInvoice.totalAmount.toLocaleString("ar-SA")} ر.س</strong>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>العربون المسدد:</span>
                    <span>{selectedInvoice.depositPaid.toLocaleString("ar-SA")} ر.س</span>
                  </div>
                  <div className="flex justify-between text-[#ba1a1a] font-bold">
                    <span>المتبقي المستحق:</span>
                    <span>{selectedInvoice.remainingBalance.toLocaleString("ar-SA")} ر.س</span>
                  </div>
                  <div className="flex justify-between text-[#524345] pt-2 border-t border-[#eedfe0]">
                    <span>طريقة الدفع:</span>
                    <span>{selectedInvoice.paymentMethod}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        toast.success("جارٍ طباعة الفاتورة...");
                        window.print();
                      }}
                      className="rounded-full bg-[#4a1521] text-white text-xs font-bold"
                    >
                      <Printer className="h-3.5 w-3.5 ms-1" />
                      <span>طباعة</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm(`هل أنتِ متأكدة من حذف الفاتورة "${selectedInvoice.invoiceNumber}" نهائياً؟`)) {
                          deleteInvoice(selectedInvoice.id);
                          setSelectedInvoice(null);
                        }
                      }}
                      className="rounded-full text-rose-600 border-rose-200 hover:bg-rose-50 text-xs font-bold gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>حذف الفاتورة</span>
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedInvoice(null)}
                    className="rounded-full text-xs"
                  >
                    إغلاق
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

