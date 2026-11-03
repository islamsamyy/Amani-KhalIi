"use client";

import React, { useState } from "react";
import { useAppStore } from "@/providers/app-store-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Lock,
  Unlock,
  Sparkles,
  Hotel,
} from "lucide-react";
import { toast } from "sonner";

interface AdminCalendarClientProps {
  initialDate?: string;
}

export function AdminCalendarClient({
  initialDate = "2025-10-09",
}: AdminCalendarClientProps = {}) {
  const { bookings, blockedDates, toggleBlockedDate } = useAppStore();

  const [dateCursor, setDateCursor] = useState(() => {
    const parts = initialDate.split("-");
    return {
      year: parseInt(parts[0] || "2025", 10),
      month: parseInt(parts[1] || "10", 10) - 1, // 0-indexed
      day: parseInt(parts[2] || "9", 10),
    };
  });

  const [selectedDay, setSelectedDay] = useState<number>(dateCursor.day);

  const daysInMonthCount = new Date(
    dateCursor.year,
    dateCursor.month + 1,
    0
  ).getDate();
  const daysInMonth = Array.from(
    { length: daysInMonthCount },
    (_, i) => i + 1
  );

  const monthNames = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const handlePrevMonth = () => {
    setDateCursor((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11, day: 1 };
      return { ...prev, month: prev.month - 1, day: 1 };
    });
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    setDateCursor((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0, day: 1 };
      return { ...prev, month: prev.month + 1, day: 1 };
    });
    setSelectedDay(1);
  };

  const getFormatDateStr = (day: number) => {
    const mm = String(dateCursor.month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${dateCursor.year}-${mm}-${dd}`;
  };

  const getDayBookings = (day: number) => {
    const targetDate = getFormatDateStr(day);
    return bookings.filter((b) => b.date === targetDate);
  };

  const isDayBlocked = (day: number) => {
    const targetDate = getFormatDateStr(day);
    return blockedDates.includes(targetDate);
  };

  const activeDayDateStr = getFormatDateStr(selectedDay);
  const activeDayBookings = getDayBookings(selectedDay);
  const activeDayBlocked = isDayBlocked(selectedDay);

  return (
    <div dir="rtl" className="lg:pr-72 transition-all duration-300">
      <main className="w-full pt-24 px-4 sm:px-6 lg:px-10 pb-16 bg-[#fff8f7] min-h-screen space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-serif text-[#2f020d]">
              تقويم الزفاف وإشغال المواعيد
            </h1>
            <p className="text-xs text-[#524345] mt-1">
              متابعة مواعيد العرائس وجدول الإشغال اليومي وإغلاق الأيام الممتلئة أو فترات الإجازة.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => toggleBlockedDate(activeDayDateStr)}
              variant="outline"
              size="sm"
              className={`rounded-full text-xs font-bold gap-1.5 ${
                activeDayBlocked
                  ? "text-emerald-700 border-emerald-300 bg-emerald-50"
                  : "text-[#ba1a1a] border-[#eedfe0] bg-white"
              }`}
            >
              {activeDayBlocked ? (
                <>
                  <Unlock className="h-4 w-4" />
                  <span>
                    إعادة إتاحة يوم {selectedDay} {monthNames[dateCursor.month]}
                  </span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>
                    إغلاق تاريخ {selectedDay} {monthNames[dateCursor.month]} (إجازة)
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Calendar Grid & Day Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calendar Month Grid (8 cols) */}
          <Card className="lg:col-span-8 rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eedfe0]">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-[#735c00]" />
                <h2 className="text-base font-bold text-[#2f020d]">
                  {monthNames[dateCursor.month]} {dateCursor.year}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePrevMonth}
                  className="h-8 w-8 rounded-full p-0 flex items-center justify-center cursor-pointer"
                  title="الشهر السابق"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleNextMonth}
                  className="h-8 w-8 rounded-full p-0 flex items-center justify-center cursor-pointer"
                  title="الشهر القادم"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Badge variant="gold" className="text-xs ms-2">
                  عروس واحدة يومياً (VIP)
                </Badge>
              </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {[
                "الأحد",
                "الاثنين",
                "الثلاثاء",
                "الأربعاء",
                "الخميس",
                "الجمعة",
                "السبت",
              ].map((d) => (
                <div
                  key={d}
                  className="font-bold text-[#735c00] py-2 bg-[#faeaeb] rounded-xl text-[11px]"
                >
                  {d}
                </div>
              ))}

              {daysInMonth.map((day) => {
                const dayBookings = getDayBookings(day);
                const blocked = isDayBlocked(day);
                const isSelected = selectedDay === day;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`min-h-[74px] p-2 rounded-2xl border flex flex-col justify-between items-start text-start transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#4a1521] bg-[#fff0f1] ring-2 ring-[#4a1521]"
                        : blocked
                        ? "border-dashed border-[#d7c1c3] bg-gray-50 opacity-60"
                        : "border-[#eedfe0] bg-white hover:bg-[#fff8f7]"
                    }`}
                  >
                    <span className="font-bold text-xs text-[#2f020d]">
                      {day}
                    </span>
                    <div className="w-full space-y-1">
                      {blocked && (
                        <span className="text-[9px] font-bold text-[#ba1a1a] block truncate">
                          مغلق / إجازة
                        </span>
                      )}
                      {dayBookings.map((b) => (
                        <span
                          key={b.id}
                          className="text-[9px] font-bold text-white bg-[#4a1521] px-1.5 py-0.5 rounded-md block truncate"
                          title={b.clientName}
                        >
                          {b.clientName.split(" ")[0]}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Selected Day Inspector (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#eedfe0]">
                <h3 className="text-sm font-bold text-[#2f020d]">
                  جدول يوم {selectedDay} {monthNames[dateCursor.month]} {dateCursor.year}
                </h3>
                {activeDayBlocked ? (
                  <Badge
                    variant="outline"
                    className="bg-[#ffdad6] text-[#ba1a1a] border-none text-[10px]"
                  >
                    مغلق
                  </Badge>
                ) : activeDayBookings.length > 0 ? (
                  <Badge variant="gold" className="text-[10px]">
                    {activeDayBookings.length} حجوزات
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 text-[10px]"
                  >
                    متاح للحجز
                  </Badge>
                )}
              </div>

              {activeDayBookings.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#857374] space-y-2">
                  <p>لا توجد جلسات مؤكدة لهذا اليوم حتى الآن.</p>
                  <Button
                    size="sm"
                    onClick={() => toggleBlockedDate(activeDayDateStr)}
                    className="rounded-full bg-[#faeaeb] text-[#2f020d] text-xs hover:bg-[#eedfe0] cursor-pointer"
                  >
                    {activeDayBlocked ? "إعادة إتاحة اليوم" : "إغلاق اليوم كإجازة"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeDayBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl bg-[#fff0f1] border border-[#eedfe0] space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#2f020d]">
                          {b.clientName}
                        </span>
                        <span className="font-mono text-[#735c00]">
                          #{b.ref}
                        </span>
                      </div>
                      <p className="text-[#524345]">
                        <strong>الباقة:</strong> {b.packageName}
                      </p>
                      <p className="text-[#524345] flex items-center gap-1">
                        <Clock className="h-3 w-3 text-[#735c00]" />
                        <span>{b.timeSlot}</span>
                      </p>
                      <p className="text-[#524345] flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#735c00]" />
                        <span className="truncate">{b.venue}</span>
                      </p>
                      <div className="pt-1 flex justify-between items-center text-[11px]">
                        <span className="font-bold text-[#2f020d]">
                          {b.totalAmount.toLocaleString("en-US")} ر.س
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-800 text-[10px]"
                        >
                          {b.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
