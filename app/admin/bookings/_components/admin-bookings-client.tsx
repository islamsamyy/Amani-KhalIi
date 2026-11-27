"use client";

import React, { useState } from "react";
import { useAppStore } from "@/providers/app-store-provider";
import { useLanguage } from "@/providers/language-provider";
import { BookingRecord } from "@/features/data/initial-data";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye,
  MessageCircle,
  Phone,
  FileSpreadsheet,
  Download,
  PlusCircle,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { downloadCsvFile } from "@/lib/image-upload";

export function AdminBookingsClient() {
  const { t, dir } = useLanguage();
  const { bookings, updateBookingStatus, deleteBooking } = useAppStore();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== "ALL" && b.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.clientName.toLowerCase().includes(q) ||
      b.ref.toLowerCase().includes(q) ||
      b.packageName.toLowerCase().includes(q) ||
      b.venue.toLowerCase().includes(q) ||
      b.phone.includes(q)
    );
  });

  const getStatusBadge = (status: BookingRecord["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
            {t("مؤكد بالعربون (30%)", "Confirmed (30% Deposit)")}
          </Badge>
        );
      case "PENDING_PAYMENT":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-[10px]">
            {t("بانتظار سداد العربون", "Awaiting Deposit")}
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-[#faeaeb] text-[#4a1521] border-[#eedfe0] text-[10px]">
            {t("جلسة مكتملة", "Completed Session")}
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-200 text-[10px]">
            {t("ملغي / مفسوح", "Cancelled / Released")}
          </Badge>
        );
    }
  };

  const handleExportCsv = () => {
    const today = new Date().toISOString().split("T")[0];
    downloadCsvFile(
      `amani-bookings-${today}.csv`,
      [
        t("رقم المرجع", "Ref"),
        t("اسم العميلة", "Client Name"),
        t("الجوال", "Phone"),
        t("الباقة", "Package"),
        t("التاريخ", "Date"),
        t("الفترة", "Time Slot"),
        t("الموقع / الفندق", "Venue / Hotel"),
        t("الإجمالي (ر.س)", "Total (SAR)"),
        t("العربون (ر.س)", "Deposit (SAR)"),
        t("المتبقي (ر.س)", "Remaining (SAR)"),
        t("الحالة", "Status"),
      ],
      filteredBookings.map((b) => [
        b.ref,
        b.clientName,
        b.phone,
        b.packageName,
        b.date,
        b.timeSlot,
        b.venue,
        b.totalAmount,
        b.depositAmount,
        b.remainingAmount,
        b.status,
      ])
    );
    toast.success(
      t(
        `تم تصدير ${filteredBookings.length} حجز بنجاح بصيغة Excel / CSV ✨`,
        `Exported ${filteredBookings.length} bookings to CSV successfully ✨`
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
              {t("إدارة الحجوزات والمواعيد", "Bookings & Appointments")}
            </h1>
            <p className="text-xs text-[#524345] mt-1">
              {t(
                "متابعة مواعيد العرائس والسهرات، الفرز الفوري، فحص الفواتير، وتحديث حالات المواعيد.",
                "Track bridal & soirée bookings, filter statuses, inspect invoices, and update appointment states."
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="rounded-full text-xs font-bold gap-1.5 bg-white"
            >
              <Download className="h-4 w-4 text-[#735c00]" />
              <span>{t("تصدير كشف المواعيد", "Export Bookings CSV")}</span>
            </Button>
          </div>
        </div>

        {/* Filters & Search */}
        <Card className="rounded-3xl border border-[#eedfe0] bg-white p-4 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full md:w-auto">
              <TabsList className="bg-[#faeaeb] p-1 rounded-full flex flex-wrap gap-1">
                <TabsTrigger value="ALL" className="rounded-full text-xs font-semibold px-4">
                  {t("كافة الحجوزات", "All Bookings")} ({bookings.length})
                </TabsTrigger>
                <TabsTrigger value="CONFIRMED" className="rounded-full text-xs font-semibold px-3">
                  {t("مؤكد", "Confirmed")} ({bookings.filter((b) => b.status === "CONFIRMED").length})
                </TabsTrigger>
                <TabsTrigger value="PENDING_PAYMENT" className="rounded-full text-xs font-semibold px-3">
                  {t("معلق", "Pending")} ({bookings.filter((b) => b.status === "PENDING_PAYMENT").length})
                </TabsTrigger>
                <TabsTrigger value="COMPLETED" className="rounded-full text-xs font-semibold px-3">
                  {t("مكتمل", "Completed")} ({bookings.filter((b) => b.status === "COMPLETED").length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full md:w-72">
              <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#857374]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("بحث بالاسم، #AK، الجوال...", "Search by name, #AK, phone...")}
                className="w-full h-10 ps-10 pe-4 rounded-full border border-[#eedfe0] bg-[#fff8f7] text-xs focus:outline-none focus:border-[#735c00]"
              />
            </div>
          </div>
        </Card>

        {/* Table of Bookings */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">{t("رقم المرجع", "Ref")}</TableHead>
              <TableHead>{t("اسم العميلة", "Client Name")}</TableHead>
              <TableHead>{t("الباقة المطلوبة", "Package")}</TableHead>
              <TableHead>{t("الموعد المحدد", "Date & Time")}</TableHead>
              <TableHead>{t("المقر / الفندق", "Venue / Hotel")}</TableHead>
              <TableHead>{t("الإجمالي", "Total")}</TableHead>
              <TableHead>{t("الحالة", "Status")}</TableHead>
              <TableHead className="w-24 text-center">{t("الإجراءات", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-[#857374] text-xs">
                  {t("لا توجد أي حجوزات تطابق الفرز الحالي.", "No bookings match the current filter.")}
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((b) => (
                <TableRow
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className="cursor-pointer hover:bg-[#fff0f1]/70 transition-colors"
                >
                  <TableCell className="font-mono font-bold text-xs text-[#4a1521]">
                    #{b.ref}
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-xs text-[#2f020d] block">{b.clientName}</span>
                    <span className="text-[10px] text-[#857374]">{b.phone}</span>
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-[#524345]">
                    {b.packageName}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="font-semibold block">{b.date}</span>
                    <span className="text-[10px] text-[#735c00]">{b.timeSlot}</span>
                  </TableCell>
                  <TableCell className="text-xs text-[#524345] max-w-[180px] truncate">
                    {b.venue}
                  </TableCell>
                  <TableCell className="text-xs font-bold font-serif text-[#2f020d]">
                    {b.totalAmount.toLocaleString("en-US")} {t("ر.س", "SAR")}
                  </TableCell>
                  <TableCell>{getStatusBadge(b.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setSelectedBooking(b)}
                        title={t("معاينة تفاصيل الحجز", "Inspect booking details")}
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
                                `هل أنتِ متأكدة من حذف حجز #${b.ref} للعميلة "${b.clientName}" نهائياً؟`,
                                `Are you sure you want to permanently delete booking #${b.ref} for "${b.clientName}"?`
                              )
                            )
                          ) {
                            deleteBooking(b.ref);
                          }
                        }}
                        title={t("حذف الحجز نهائياً", "Permanently delete booking")}
                        className="h-8 w-8 rounded-full bg-white hover:bg-rose-50 text-rose-600 border border-[#eedfe0] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Booking Details Inspector Dialog */}
        <Dialog
          open={selectedBooking !== null}
          onOpenChange={(open) => !open && setSelectedBooking(null)}
        >
          <DialogContent dir={dir} className="max-w-xl bg-[#fff8f7] border border-[#d7c1c3] p-6 text-start">
            {selectedBooking && (
              <div className="space-y-6">
                <DialogHeader className="text-start">
                  <div className="flex items-center justify-between">
                    <Badge variant="gold" className="text-xs">
                      #{selectedBooking.ref}
                    </Badge>
                    {getStatusBadge(selectedBooking.status)}
                  </div>
                  <DialogTitle className="text-xl font-bold text-[#2f020d] mt-2">
                    {t("تفاصيل حجز:", "Booking Details:")} {selectedBooking.clientName}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-[#524345]">
                    {selectedBooking.packageName} • {selectedBooking.date} ({selectedBooking.timeSlot})
                  </DialogDescription>
                </DialogHeader>

                <div className="p-4 rounded-2xl bg-white border border-[#eedfe0] space-y-2 text-xs">
                  <p><strong>{t("الجوال:", "Phone:")}</strong> {selectedBooking.phone}</p>
                  <p><strong>{t("المقر:", "Venue:")}</strong> {selectedBooking.venue}</p>
                  <p><strong>{t("الإجمالي:", "Total:")}</strong> {selectedBooking.totalAmount.toLocaleString("en-US")} {t("ر.س", "SAR")}</p>
                  <p><strong>{t("العربون (30%):", "Deposit (30%):")}</strong> {selectedBooking.depositAmount.toLocaleString("en-US")} {t("ر.س", "SAR")}</p>
                  <p><strong>{t("المتبقي:", "Remaining:")}</strong> {selectedBooking.remainingAmount.toLocaleString("en-US")} {t("ر.س", "SAR")}</p>
                  {selectedBooking.notes && (
                    <p className="pt-2 border-t border-[#eedfe0] text-[#735c00]">
                      <strong>{t("ملاحظات العميلة:", "Client Notes:")}</strong> {selectedBooking.notes}
                    </p>
                  )}
                </div>

                {/* Status action buttons */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#2f020d] block">
                    {t("تغيير حالة الحجز:", "Change Booking Status:")}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        updateBookingStatus(selectedBooking.ref, "CONFIRMED");
                        setSelectedBooking((prev) => prev ? { ...prev, status: "CONFIRMED" } : null);
                      }}
                      className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                    >
                      {t("تأكيد الحجز (تم سداد العربون)", "Confirm Booking (Deposit Paid)")}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        updateBookingStatus(selectedBooking.ref, "COMPLETED");
                        setSelectedBooking((prev) => prev ? { ...prev, status: "COMPLETED" } : null);
                      }}
                      className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs"
                    >
                      {t("اعتماد إتمام الجلسة", "Mark Session Complete")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        updateBookingStatus(selectedBooking.ref, "CANCELLED");
                        setSelectedBooking((prev) => prev ? { ...prev, status: "CANCELLED" } : null);
                      }}
                      className="rounded-full text-rose-700 border-rose-200 hover:bg-rose-50 text-xs"
                    >
                      {t("إلغاء وإفساح الموعد", "Cancel & Release Slot")}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#eedfe0]">
                  <a
                    href={`https://wa.me/${selectedBooking.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#25D366] hover:underline flex items-center gap-1"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{t("مراسلة واتساب", "Message on WhatsApp")}</span>
                  </a>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (
                          confirm(
                            t(
                              `هل أنتِ متأكدة من حذف حجز #${selectedBooking.ref} نهائياً؟`,
                              `Are you sure you want to permanently delete booking #${selectedBooking.ref}?`
                            )
                          )
                        ) {
                          deleteBooking(selectedBooking.ref);
                          setSelectedBooking(null);
                        }
                      }}
                      className="rounded-full text-rose-600 border-rose-200 hover:bg-rose-50 text-xs font-bold gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>{t("حذف الحجز نهائياً", "Delete Permanently")}</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedBooking(null)}
                      className="rounded-full text-xs"
                    >
                      {t("إغلاق", "Close")}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

