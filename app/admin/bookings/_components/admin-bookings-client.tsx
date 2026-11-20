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
            مؤكد بالعربون (30%)
          </Badge>
        );
      case "PENDING_PAYMENT":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-[10px]">
            بانتظار سداد العربون
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-[#faeaeb] text-[#4a1521] border-[#eedfe0] text-[10px]">
            جلسة مكتملة
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-200 text-[10px]">
            ملغي / مفسوح
          </Badge>
        );
    }
  };

  const handleExportCsv = () => {
    const today = new Date().toISOString().split("T")[0];
    downloadCsvFile(
      `amani-bookings-${today}.csv`,
      ["رقم المرجع", "اسم العميلة", "الجوال", "الباقة", "التاريخ", "الفترة", "الموقع / الفندق", "الإجمالي (ر.س)", "العربون (ر.س)", "المتبقي (ر.س)", "الحالة"],
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
    toast.success(`تم تصدير ${filteredBookings.length} حجز بنجاح بصيغة Excel / CSV ✨`);
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
                  كافة الحجوزات ({bookings.length})
                </TabsTrigger>
                <TabsTrigger value="CONFIRMED" className="rounded-full text-xs font-semibold px-3">
                  مؤكد ({bookings.filter((b) => b.status === "CONFIRMED").length})
                </TabsTrigger>
                <TabsTrigger value="PENDING_PAYMENT" className="rounded-full text-xs font-semibold px-3">
                  معلق ({bookings.filter((b) => b.status === "PENDING_PAYMENT").length})
                </TabsTrigger>
                <TabsTrigger value="COMPLETED" className="rounded-full text-xs font-semibold px-3">
                  مكتمل ({bookings.filter((b) => b.status === "COMPLETED").length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full md:w-72">
              <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#857374]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث بالاسم، #AK، الجوال..."
                className="w-full h-10 ps-10 pe-4 rounded-full border border-[#eedfe0] bg-[#fff8f7] text-xs focus:outline-none focus:border-[#735c00]"
              />
            </div>
          </div>
        </Card>

        {/* Table of Bookings */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">رقم المرجع</TableHead>
              <TableHead>اسم العميلة</TableHead>
              <TableHead>الباقة المطلوبة</TableHead>
              <TableHead>الموعد المحدد</TableHead>
              <TableHead>المقر / الفندق</TableHead>
              <TableHead>الإجمالي</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="w-24 text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-[#857374] text-xs">
                  لا توجد أي حجوزات تطابق الفرز الحالي.
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
                    {b.totalAmount.toLocaleString("ar-SA")} ر.س
                  </TableCell>
                  <TableCell>{getStatusBadge(b.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setSelectedBooking(b)}
                        title="معاينة تفاصيل الحجز"
                        className="h-8 w-8 rounded-full bg-[#faeaeb] hover:bg-[#eedfe0] flex items-center justify-center text-[#2f020d] transition-colors cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`هل أنتِ متأكدة من حذف حجز #${b.ref} للعميلة "${b.clientName}" نهائياً؟`)) {
                            deleteBooking(b.ref);
                          }
                        }}
                        title="حذف الحجز نهائياً"
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
          <DialogContent className="max-w-xl bg-[#fff8f7] border border-[#d7c1c3] p-6 text-right">
            {selectedBooking && (
              <div className="space-y-6">
                <DialogHeader className="text-right">
                  <div className="flex items-center justify-between">
                    <Badge variant="gold" className="text-xs">
                      #{selectedBooking.ref}
                    </Badge>
                    {getStatusBadge(selectedBooking.status)}
                  </div>
                  <DialogTitle className="text-xl font-bold text-[#2f020d] mt-2">
                    تفاصيل حجز: {selectedBooking.clientName}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-[#524345]">
                    {selectedBooking.packageName} • {selectedBooking.date} ({selectedBooking.timeSlot})
                  </DialogDescription>
                </DialogHeader>

                <div className="p-4 rounded-2xl bg-white border border-[#eedfe0] space-y-2 text-xs">
                  <p><strong>الجوال:</strong> {selectedBooking.phone}</p>
                  <p><strong>المقر:</strong> {selectedBooking.venue}</p>
                  <p><strong>الإجمالي:</strong> {selectedBooking.totalAmount.toLocaleString("ar-SA")} ر.س</p>
                  <p><strong>العربون (30%):</strong> {selectedBooking.depositAmount.toLocaleString("ar-SA")} ر.س</p>
                  <p><strong>المتبقي:</strong> {selectedBooking.remainingAmount.toLocaleString("ar-SA")} ر.س</p>
                  {selectedBooking.notes && (
                    <p className="pt-2 border-t border-[#eedfe0] text-[#735c00]">
                      <strong>ملاحظات العميلة:</strong> {selectedBooking.notes}
                    </p>
                  )}
                </div>

                {/* Status action buttons */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#2f020d] block">تغيير حالة الحجز:</span>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        updateBookingStatus(selectedBooking.ref, "CONFIRMED");
                        setSelectedBooking((prev) => prev ? { ...prev, status: "CONFIRMED" } : null);
                      }}
                      className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                    >
                      تأكيد الحجز (تم سداد العربون)
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        updateBookingStatus(selectedBooking.ref, "COMPLETED");
                        setSelectedBooking((prev) => prev ? { ...prev, status: "COMPLETED" } : null);
                      }}
                      className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs"
                    >
                      اعتماد إتمام الجلسة
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
                      إلغاء وإفساح الموعد
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
                    <span>مراسلة واتساب</span>
                  </a>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm(`هل أنتِ متأكدة من حذف حجز #${selectedBooking.ref} نهائياً؟`)) {
                          deleteBooking(selectedBooking.ref);
                          setSelectedBooking(null);
                        }
                      }}
                      className="rounded-full text-rose-600 border-rose-200 hover:bg-rose-50 text-xs font-bold gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>حذف الحجز نهائياً</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedBooking(null)}
                      className="rounded-full text-xs"
                    >
                      إغلاق
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

