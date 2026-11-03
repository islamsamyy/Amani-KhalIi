"use client";

import React, { useState } from "react";
import { useAppStore } from "@/providers/app-store-provider";
import { CustomerProfile } from "@/features/data/initial-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Search,
  Phone,
  MessageCircle,
  Calendar,
  Save,
  Heart,
  Crown,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export function AdminCustomersClient() {
  const { customers, updateCustomerNotes } = useAppStore();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || "c-01");
  const [searchQuery, setSearchQuery] = useState("");
  const [notesDraft, setNotesDraft] = useState("");

  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q);
  });

  const selectedCustomer =
    customers.find((c) => c.id === selectedCustomerId) || customers[0];

  // Initialize draft when customer changes
  React.useEffect(() => {
    if (selectedCustomer) {
      setNotesDraft(selectedCustomer.notes);
    }
  }, [selectedCustomerId, selectedCustomer]);

  const handleSaveNotes = () => {
    if (selectedCustomer) {
      updateCustomerNotes(selectedCustomer.id, notesDraft);
    }
  };

  return (
    <div dir="rtl" className="lg:pe-72 transition-all duration-300">
      <main className="w-full pt-24 px-4 sm:px-6 lg:px-10 pb-16 bg-[#fff8f7] min-h-screen space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-serif text-[#2f020d]">سجل العميلات وتتبع التفضيلات (CRM)</h1>
            <p className="text-xs text-[#524345] mt-1">
              ملفات العرائس الخاصة، نوع البشرة، أرقام الفاونديشن المفضلة، وسجل الحجوزات المكتملة.
            </p>
          </div>
        </div>

        {/* Master Detail CRM Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Customer List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative">
              <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#857374]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث باسم العميلة أو الجوال..."
                className="w-full h-11 ps-10 pe-4 rounded-2xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
              />
            </div>

            <div className="space-y-3">
              {filteredCustomers.map((c) => {
                const isSelected = c.id === selectedCustomerId;
                return (
                  <Card
                    key={c.id}
                    onClick={() => setSelectedCustomerId(c.id)}
                    className={`p-4 rounded-3xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#4a1521] bg-[#fff0f1] ring-2 ring-[#4a1521] shadow-md"
                        : "border-[#eedfe0] bg-white hover:bg-[#fff8f7]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-full bg-[#4a1521] text-white flex items-center justify-center font-bold text-xs">
                          {c.name.split(" ")[0][0]}
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-[#2f020d]">{c.name}</h3>
                          <span className="text-[10px] text-[#857374]">{c.phone}</span>
                        </div>
                      </div>
                      <Badge variant="gold" className="text-[10px]">
                        {c.tier}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#524345] pt-2 border-t border-[#eedfe0]/60">
                      <span>البشرة: {c.skinType}</span>
                      <span className="font-bold text-[#735c00]">{c.totalBookings} حجوزات</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Customer Profile Card (7 cols) */}
          <div className="lg:col-span-7">
            {selectedCustomer ? (
              <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#eedfe0]">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-2xl bg-[#4a1521] text-[#fed65b] flex items-center justify-center font-serif text-xl font-bold">
                      {selectedCustomer.name.split(" ")[0][0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-[#2f020d]">{selectedCustomer.name}</h2>
                        <Badge variant="gold" className="text-[10px]">{selectedCustomer.tier}</Badge>
                      </div>
                      <p className="text-xs text-[#857374] mt-0.5">{selectedCustomer.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="h-10 px-4 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>واتساب</span>
                    </a>
                    <a
                      href={`tel:${selectedCustomer.phone}`}
                      className="h-10 px-4 rounded-full bg-[#faeaeb] hover:bg-[#eedfe0] text-[#2f020d] text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      <span>اتصال</span>
                    </a>
                  </div>
                </div>

                {/* Skin & Aesthetics Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#fff0f1] border border-[#eedfe0] space-y-1">
                    <span className="text-[#735c00] font-bold block">نوع البشرة والأندر تون:</span>
                    <p className="text-[#2f020d] font-semibold">{selectedCustomer.skinType} • {selectedCustomer.undertone}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#fff0f1] border border-[#eedfe0] space-y-1">
                    <span className="text-[#735c00] font-bold block">الباليت والمستحضرات المفضلة:</span>
                    <p className="text-[#2f020d] font-semibold truncate">{selectedCustomer.favoritePalette}</p>
                  </div>
                </div>

                {selectedCustomer.allergies && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    <strong>تنبيه تحسس مسجل:</strong> {selectedCustomer.allergies}
                  </div>
                )}

                {/* Editable Artist Notes */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#2f020d]">ملاحظات خبيرة التجميل أماني خليل:</label>
                    <span className="text-[10px] text-[#857374]">تُحفظ في ملف العميلة الشخصي</span>
                  </div>
                  <textarea
                    rows={4}
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-[#eedfe0] bg-[#fff8f7] text-xs focus:outline-none focus:border-[#735c00] leading-relaxed"
                  />
                  <div className="flex justify-end pt-1">
                    <Button
                      size="sm"
                      onClick={handleSaveNotes}
                      className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs font-bold gap-1.5"
                    >
                      <Save className="h-3.5 w-3.5 text-[#fed65b]" />
                      <span>حفظ الملاحظة</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="text-center py-16 text-xs text-[#857374]">
                يرجى اختيار عميلة من القائمة لمعاينة ملفها.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

