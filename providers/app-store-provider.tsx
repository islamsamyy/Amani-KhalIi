"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseConfig } from "@/lib/supabase/config";
import {
  ServicePackage,
  AddOnItem,
  BookingRecord,
  InvoiceRecord,
  CustomerProfile,
  ReviewItem,
  GalleryLook,
  BlogPost,
  FaqEntry,
  RiyadhArea,
  INITIAL_PACKAGES,
  INITIAL_ADDONS,
  INITIAL_BOOKINGS,
  INITIAL_INVOICES,
  INITIAL_CUSTOMERS,
  INITIAL_REVIEWS,
  INITIAL_GALLERY,
  INITIAL_BLOG_POSTS,
  INITIAL_FAQS,
  INITIAL_AREAS,
} from "@/features/data/initial-data";
import { toast } from "sonner";

interface AppStoreContextType {
  packages: ServicePackage[];
  addons: AddOnItem[];
  bookings: BookingRecord[];
  invoices: InvoiceRecord[];
  customers: CustomerProfile[];
  reviews: ReviewItem[];
  gallery: GalleryLook[];
  blogPosts: BlogPost[];
  faqs: FaqEntry[];
  areas: RiyadhArea[];
  blockedDates: string[];
  selectedPackageId: string;
  setSelectedPackageId: (id: string) => void;
  lastConfirmedBooking: BookingRecord | null;
  setLastConfirmedBooking: (booking: BookingRecord | null) => void;

  // Supabase & Auth state
  isSupabaseConnected: boolean;
  isSyncing: boolean;
  currentUser: User | null;
  refreshFromDatabase: () => Promise<void>;
  seedDatabase: () => Promise<boolean>;
  configureSupabaseConnection: (url: string, key?: string) => Promise<boolean>;
  signOutAdmin: () => Promise<void>;

  // Actions
  addPackage: (pkg: Omit<ServicePackage, "id">) => void;
  updatePackage: (id: string, updates: Partial<ServicePackage>) => void;
  togglePackageActive: (id: string) => void;
  deletePackage: (id: string) => void;

  createBooking: (
    booking: Omit<BookingRecord, "id" | "ref" | "createdAt"> & {
      paymentMethod?: InvoiceRecord["paymentMethod"];
      skinType?: string;
    }
  ) => BookingRecord;
  updateBookingStatus: (ref: string, status: BookingRecord["status"]) => void;

  addReview: (review: Omit<ReviewItem, "id" | "approved" | "featured">) => void;
  toggleReviewApproval: (id: string) => void;
  toggleReviewFeatured: (id: string) => void;
  deleteReview: (id: string) => void;

  updateCustomerNotes: (id: string, notes: string) => void;
  toggleBlockedDate: (date: string) => void;

  // Blog Actions
  addBlogPost: (post: Omit<BlogPost, "id">) => void;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  toggleBlogPublished: (id: string) => void;
  toggleBlogFeatured: (id: string) => void;
}

const AppStoreContext = createContext<AppStoreContextType | null>(null);

const STORAGE_KEY = "amani_app_state_v1";

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [packages, setPackages] = useState<ServicePackage[]>(INITIAL_PACKAGES);
  const [addons, setAddons] = useState<AddOnItem[]>(INITIAL_ADDONS);
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(INITIAL_INVOICES);
  const [customers, setCustomers] =
    useState<CustomerProfile[]>(INITIAL_CUSTOMERS);
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [gallery, setGallery] = useState<GalleryLook[]>(INITIAL_GALLERY);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [faqs, setFaqs] = useState<FaqEntry[]>(INITIAL_FAQS);
  const [areas, setAreas] = useState<RiyadhArea[]>(INITIAL_AREAS);
  const [blockedDates, setBlockedDates] = useState<string[]>([
    "2025-10-14",
    "2025-10-21",
  ]);
  const [selectedPackageId, setSelectedPackageId] =
    useState<string>("vip-bridal");
  const [lastConfirmedBooking, setLastConfirmedBooking] =
    useState<BookingRecord | null>(INITIAL_BOOKINGS[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const seedDatabase = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/supabase/seed", { method: "POST" });
      const data = await res.json();
      return Boolean(data?.ok);
    } catch {
      return false;
    }
  }, []);

  const refreshRef = useRef<() => Promise<void>>(async () => {});

  const refreshFromDatabase = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) {
      setIsSupabaseConnected(false);
      return;
    }

    setIsSyncing(true);
    try {
      const [
        pkgRes,
        addonRes,
        areaRes,
        adminSnapRes,
        revRes,
        galRes,
        blogRes,
        faqRes,
        blkRes,
      ] = await Promise.all([
        supabase
          .from("service_packages")
          .select("*")
          .order("created_at", { ascending: true }),
        supabase
          .from("addons")
          .select("*")
          .order("created_at", { ascending: true }),
        supabase.from("riyadh_areas").select("*"),
        supabase.rpc("get_admin_dashboard_snapshot"),
        supabase
          .from("reviews")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("gallery_looks")
          .select("*")
          .order("created_at", { ascending: true }),
        supabase
          .from("blog_posts")
          .select("*")
          .order("published_at", { ascending: false }),
        supabase.from("faqs").select("*"),
        supabase.from("blocked_dates").select("*"),
      ]);

      // If service_packages table is accessible, we are connected to live Supabase DB
      if (!pkgRes.error) {
        setIsSupabaseConnected(true);

        // Auto-seed if table is empty on first run
        if (pkgRes.data && pkgRes.data.length === 0) {
          const seeded = await seedDatabase();
          if (seeded) {
            setIsSyncing(false);
            if (refreshRef.current) {
              await refreshRef.current();
            }
            return;
          }
        }

        if (pkgRes.data && pkgRes.data.length > 0) {
          setPackages(
            pkgRes.data.map((r) => ({
              id: r.id,
              title: r.title,
              titleEn: r.title_en || "",
              price: Number(r.price),
              depositPercentage: Number(r.deposit_percentage ?? 30),
              duration: r.duration,
              category: r.category,
              popular: Boolean(r.popular),
              active: Boolean(r.active),
              description: r.description,
              features: Array.isArray(r.features) ? r.features : [],
              badge: r.badge || undefined,
            }))
          );
        }

        if (!addonRes.error && addonRes.data && addonRes.data.length > 0) {
          setAddons(
            addonRes.data.map((a) => ({
              id: a.id,
              title: a.title,
              price: Number(a.price),
              description: a.description,
              popular: Boolean(a.popular),
            }))
          );
        }

        if (!areaRes.error && areaRes.data && areaRes.data.length > 0) {
          setAreas(
            areaRes.data.map((a) => ({
              id: a.id,
              nameAr: a.name_ar,
              nameEn: a.name_en,
              zone: a.zone,
              travelFee: Number(a.travel_fee ?? 0),
            }))
          );
        }

        if (!adminSnapRes.error && adminSnapRes.data) {
          const snap = adminSnapRes.data as {
            bookings?: Array<{
              id: string;
              ref: string;
              client_name: string;
              phone: string;
              package_id: string;
              package_name: string;
              date: string;
              time_slot: string;
              location_type: BookingRecord["locationType"];
              venue: string;
              area_id: string;
              total_amount: number;
              deposit_amount: number;
              remaining_amount: number;
              status: BookingRecord["status"];
              addon_ids: unknown;
              notes: string | null;
              created_at: string;
            }>;
            invoices?: Array<{
              id: string;
              invoice_number: string;
              booking_ref: string;
              client_name: string;
              package_name: string;
              issue_date: string;
              total_amount: number;
              deposit_paid: number;
              remaining_balance: number;
              payment_method: InvoiceRecord["paymentMethod"];
              status: InvoiceRecord["status"];
            }>;
            customers?: Array<{
              id: string;
              name: string;
              phone: string;
              tier: CustomerProfile["tier"];
              skin_type: string;
              undertone: string;
              allergies?: string | null;
              favorite_palette: string;
              total_bookings?: number;
              last_visit: string;
              notes?: string | null;
            }>;
          };

          if (Array.isArray(snap.bookings) && snap.bookings.length > 0) {
            const mappedBookings: BookingRecord[] = snap.bookings.map((b) => ({
              id: b.id,
              ref: b.ref,
              clientName: b.client_name,
              phone: b.phone,
              packageId: b.package_id,
              packageName: b.package_name,
              date: b.date,
              timeSlot: b.time_slot
                ? b.time_slot.replace(/\u200B/g, "")
                : "عصراً (02:00 م)",
              locationType: b.location_type,
              venue: b.venue,
              areaId: b.area_id,
              totalAmount: Number(b.total_amount),
              depositAmount: Number(b.deposit_amount),
              remainingAmount: Number(b.remaining_amount),
              status: b.status,
              addonIds: Array.isArray(b.addon_ids) ? b.addon_ids : [],
              notes: b.notes || undefined,
              createdAt: b.created_at,
            }));
            setBookings(mappedBookings);
            setLastConfirmedBooking(mappedBookings[0]);
          }

          if (Array.isArray(snap.invoices) && snap.invoices.length > 0) {
            setInvoices(
              snap.invoices.map((i) => ({
                id: i.id,
                invoiceNumber: i.invoice_number,
                bookingRef: i.booking_ref,
                clientName: i.client_name,
                packageName: i.package_name,
                issueDate: i.issue_date,
                totalAmount: Number(i.total_amount),
                depositPaid: Number(i.deposit_paid),
                remainingBalance: Number(i.remaining_balance),
                paymentMethod: i.payment_method,
                status: i.status,
              }))
            );
          }

          if (Array.isArray(snap.customers) && snap.customers.length > 0) {
            setCustomers(
              snap.customers.map((c) => ({
                id: c.id,
                name: c.name,
                phone: c.phone,
                tier: c.tier,
                skinType: c.skin_type,
                undertone: c.undertone,
                allergies: c.allergies || undefined,
                favoritePalette: c.favorite_palette,
                totalBookings: Number(c.total_bookings ?? 1),
                lastVisit: c.last_visit,
                notes: c.notes || "",
              }))
            );
          }
        }

        if (!revRes.error && revRes.data && revRes.data.length > 0) {
          setReviews(
            revRes.data.map((r) => ({
              id: r.id,
              clientName: r.client_name,
              packageTitle: r.package_title,
              rating: Number(r.rating),
              date: r.date,
              venue: r.venue,
              comment: r.comment,
              approved: Boolean(r.approved),
              featured: Boolean(r.featured),
            }))
          );
        }

        if (!galRes.error && galRes.data && galRes.data.length > 0) {
          setGallery(
            galRes.data.map((g) => ({
              id: g.id,
              title: g.title,
              category: g.category,
              categoryAr: g.category_ar,
              image: g.image,
              clientType: g.client_type,
              styleTags: Array.isArray(g.style_tags) ? g.style_tags : [],
            }))
          );
        }

        if (!blogRes.error && blogRes.data && blogRes.data.length > 0) {
          setBlogPosts(
            blogRes.data.map((p) => ({
              id: p.id,
              slug: p.slug,
              title: p.title,
              excerpt: p.excerpt,
              content: p.content,
              category: p.category,
              categoryAr: p.category_ar,
              author: p.author,
              authorRole: p.author_role,
              readTime: p.read_time,
              publishedAt: p.published_at,
              coverImage: p.cover_image,
              featured: Boolean(p.featured),
              published: Boolean(p.published),
              tags: Array.isArray(p.tags) ? p.tags : [],
            }))
          );
        }

        if (!faqRes.error && faqRes.data && faqRes.data.length > 0) {
          setFaqs(
            faqRes.data.map((f) => ({
              id: f.id,
              category: f.category,
              categoryAr: f.category_ar,
              question: f.question,
              answer: f.answer,
              keywords: Array.isArray(f.keywords) ? f.keywords : [],
            }))
          );
        }

        if (!blkRes.error && blkRes.data) {
          setBlockedDates(blkRes.data.map((d) => d.date));
        }
      } else {
        setIsSupabaseConnected(false);
      }
    } catch {
      setIsSupabaseConnected(false);
    } finally {
      setIsSyncing(false);
    }
  }, [seedDatabase]);

  useEffect(() => {
    refreshRef.current = refreshFromDatabase;
  }, [refreshFromDatabase]);

  const configureSupabaseConnection = useCallback(
    async (url: string, key?: string): Promise<boolean> => {
      const cleanUrl = url.trim().replace(/\/+$/, "");
      if (!cleanUrl.startsWith("https://")) {
        toast.error("يرجى إدخال رابط مشروع Supabase صحيح يبدأ بـ https://");
        return false;
      }
      try {
        localStorage.setItem("amani_supabase_url", cleanUrl);
        document.cookie = `amani_supabase_url=${encodeURIComponent(cleanUrl)}; path=/; max-age=2592000; SameSite=Lax`;
        if (key && key.trim()) {
          localStorage.setItem("amani_supabase_key", key.trim());
          document.cookie = `amani_supabase_key=${encodeURIComponent(key.trim())}; path=/; max-age=2592000; SameSite=Lax`;
        }
        await seedDatabase();
        await refreshFromDatabase();
        toast.success(
          "تم الاتصال بقاعدة بيانات Supabase ومزامنة البيانات بنجاح ✨"
        );
        return true;
      } catch {
        toast.error("تعذر حفظ إعدادات الاتصال");
        return false;
      }
    },
    [refreshFromDatabase, seedDatabase]
  );

  const signOutAdmin = useCallback(async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    document.cookie = "amani_admin_session=; path=/; max-age=0; SameSite=Lax";
    setCurrentUser(null);
    toast.success("تم تسجيل الخروج الآمن بنجاح");
  }, []);

  // Load localStorage fallback first, then sync live from Supabase + subscribe to Realtime + Auth
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.packages) setPackages(parsed.packages);
        if (
          Array.isArray(parsed.bookings) &&
          parsed.bookings.length > 0 &&
          !String(parsed.bookings[0]?.id || "").startsWith("slot-")
        ) {
          setBookings(parsed.bookings);
        }
        if (parsed.invoices) setInvoices(parsed.invoices);
        if (parsed.customers) setCustomers(parsed.customers);
        if (parsed.reviews) setReviews(parsed.reviews);
        if (parsed.blogPosts) setBlogPosts(parsed.blogPosts);
        if (parsed.blockedDates) setBlockedDates(parsed.blockedDates);
        if (parsed.selectedPackageId)
          setSelectedPackageId(parsed.selectedPackageId);
        if (parsed.lastConfirmedBooking)
          setLastConfirmedBooking(parsed.lastConfirmedBooking);
      }
    } catch {}
    setIsLoaded(true);

    const { isConfigured } = getSupabaseConfig();
    if (!isConfigured) return;

    refreshFromDatabase();

    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setCurrentUser(data.user);
    });

    const {
      data: { subscription: authSub },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user ?? null);
      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "TOKEN_REFRESHED"
      ) {
        if (refreshRef.current) {
          void refreshRef.current();
        }
      }
    });

    const channel = supabase
      .channel("amani-atelier-live-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public" },
        () => {
          refreshFromDatabase();
        }
      )
      .subscribe();

    return () => {
      authSub.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [refreshFromDatabase]);

  // Save state snapshot to localStorage for instant offline resilience
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          packages,
          bookings,
          invoices,
          customers,
          reviews,
          blogPosts,
          blockedDates,
          selectedPackageId,
          lastConfirmedBooking,
        })
      );
    } catch {}
  }, [
    isLoaded,
    packages,
    bookings,
    invoices,
    customers,
    reviews,
    blogPosts,
    blockedDates,
    selectedPackageId,
    lastConfirmedBooking,
  ]);

  const addPackage = (pkg: Omit<ServicePackage, "id">) => {
    const id = "pkg-" + Date.now();
    const newPkg: ServicePackage = { ...pkg, id };
    setPackages((prev) => [newPkg, ...prev]);
    toast.success(`تمت إضافة الباقة بنجاح: ${pkg.title} ✨`);

    const supabase = createClient();
    if (supabase) {
      void (async () => {
        const { error } = await supabase.from("service_packages").insert({
          id: newPkg.id,
          title: newPkg.title,
          title_en: newPkg.titleEn || "",
          price: newPkg.price,
          deposit_percentage: newPkg.depositPercentage,
          duration: newPkg.duration,
          category: newPkg.category,
          popular: Boolean(newPkg.popular),
          active: newPkg.active,
          description: newPkg.description,
          features: newPkg.features,
          badge: newPkg.badge ?? null,
        });
        if (error) {
          toast.error("تعذر حفظ الباقة الجديدة في قاعدة البيانات", {
            description: error.message,
          });
        }
        if (refreshRef.current) await refreshRef.current();
      })();
    }
  };

  const updatePackage = (id: string, updates: Partial<ServicePackage>) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    toast.success("تم تحديث بيانات الباقة بنجاح ✨");

    const supabase = createClient();
    if (supabase) {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.titleEn !== undefined) dbUpdates.title_en = updates.titleEn;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.depositPercentage !== undefined)
        dbUpdates.deposit_percentage = updates.depositPercentage;
      if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.popular !== undefined) dbUpdates.popular = updates.popular;
      if (updates.active !== undefined) dbUpdates.active = updates.active;
      if (updates.description !== undefined)
        dbUpdates.description = updates.description;
      if (updates.features !== undefined) dbUpdates.features = updates.features;
      if (updates.badge !== undefined) dbUpdates.badge = updates.badge;

      void (async () => {
        const { error } = await supabase
          .from("service_packages")
          .update(dbUpdates)
          .eq("id", id);
        if (error) {
          toast.error("تعذر تحديث بيانات الباقة في قاعدة البيانات", {
            description: error.message,
          });
        }
        if (refreshRef.current) await refreshRef.current();
      })();
    }
  };

  const togglePackageActive = (id: string) => {
    let nextActive = true;
    setPackages((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          nextActive = !p.active;
          toast.success(
            nextActive
              ? `تم تفعيل الباقة: ${p.title}`
              : `تم إيقاف تفعيل الباقة مؤقتاً: ${p.title}`
          );
          return { ...p, active: nextActive };
        }
        return p;
      })
    );

    const supabase = createClient();
    if (supabase) {
      void (async () => {
        const { error } = await supabase
          .from("service_packages")
          .update({ active: nextActive })
          .eq("id", id);
        if (error) {
          toast.error("تعذر تغيير حالة تفعيل الباقة", {
            description: error.message,
          });
        }
        if (refreshRef.current) await refreshRef.current();
      })();
    }
  };

  const deletePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
    toast.success("تم حذف الباقة بنجاح");

    const supabase = createClient();
    if (supabase) {
      void (async () => {
        const { error } = await supabase
          .from("service_packages")
          .delete()
          .eq("id", id);
        if (error) {
          // Package is referenced by existing bookings (FK) -> archive instead of delete.
          await supabase
            .from("service_packages")
            .update({ active: false })
            .eq("id", id);
          toast.info("الباقة مرتبطة بحجوزات سابقة، تم إخفاؤها بدلاً من حذفها.");
        }
        if (refreshRef.current) await refreshRef.current();
      })();
    }
  };

  const createBooking = (
    bookingData: Omit<BookingRecord, "id" | "ref" | "createdAt"> & {
      paymentMethod?: InvoiceRecord["paymentMethod"];
      skinType?: string;
    }
  ): BookingRecord => {
    const id = "b-" + Date.now();
    const ref = "AK-2025-" + Math.floor(1000 + Math.random() * 9000);
    const createdAt = new Date().toISOString();
    const newBooking: BookingRecord = {
      id,
      ref,
      clientName: bookingData.clientName,
      phone: bookingData.phone,
      packageId: bookingData.packageId,
      packageName: bookingData.packageName,
      date: bookingData.date,
      timeSlot: bookingData.timeSlot,
      locationType: bookingData.locationType,
      venue: bookingData.venue,
      areaId: bookingData.areaId,
      totalAmount: bookingData.totalAmount,
      depositAmount: bookingData.depositAmount,
      remainingAmount: bookingData.remainingAmount,
      status: bookingData.status,
      addonIds: bookingData.addonIds,
      notes: bookingData.notes,
      createdAt,
    };

    setBookings((prev) => [newBooking, ...prev]);
    setLastConfirmedBooking(newBooking);

    // Also generate an invoice automatically
    const newInvoice: InvoiceRecord = {
      id: "inv-" + Date.now(),
      invoiceNumber: "INV-2025-" + Math.floor(1000 + Math.random() * 9000),
      bookingRef: ref,
      clientName: newBooking.clientName,
      packageName: newBooking.packageName,
      issueDate: createdAt.split("T")[0],
      totalAmount: newBooking.totalAmount,
      depositPaid: newBooking.depositAmount,
      remainingBalance: newBooking.remainingAmount,
      paymentMethod: bookingData.paymentMethod || "Apple Pay",
      status: "مدفوع العربون (30%)",
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    // Also add or update customer CRM profile
    const existingCustomer = customers.find(
      (c) =>
        c.phone === newBooking.phone ||
        c.name.trim() === newBooking.clientName.trim()
    );
    const crmCustomer: CustomerProfile = existingCustomer
      ? {
          ...existingCustomer,
          totalBookings: existingCustomer.totalBookings + 1,
          lastVisit: newBooking.date,
          notes: newBooking.notes
            ? `${existingCustomer.notes} | حجز #${ref}: ${newBooking.notes}`
            : existingCustomer.notes,
        }
      : {
          id: "c-" + Date.now(),
          name: newBooking.clientName,
          phone: newBooking.phone,
          tier: newBooking.totalAmount >= 2500 ? "VIP Royal" : "Diamond",
          skinType: bookingData.skinType || "مختلطة نضرة",
          undertone: "دافئ (Warm Golden)",
          favoritePalette: "Dior Backstage & Charlotte Tilbury Pillow Talk",
          totalBookings: 1,
          lastVisit: newBooking.date,
          notes:
            newBooking.notes ||
            `تم إنشاء ملف العميلة تلقائياً مع الحجز #${ref} (${newBooking.packageName}).`,
        };

    setCustomers((prev) =>
      existingCustomer
        ? prev.map((c) => (c.id === existingCustomer.id ? crmCustomer : c))
        : [crmCustomer, ...prev]
    );

    const supabase = createClient();
    if (supabase) {
      void (async () => {
        const { error } = await supabase.rpc("create_booking", {
          p: {
            id: newBooking.id,
            ref: newBooking.ref,
            client_name: newBooking.clientName,
            phone: newBooking.phone,
            package_id: newBooking.packageId,
            date: newBooking.date,
            time_slot: newBooking.timeSlot,
            location_type: newBooking.locationType,
            venue: newBooking.venue,
            area_id: newBooking.areaId,
            total_amount: newBooking.totalAmount,
            deposit_amount: newBooking.depositAmount,
            remaining_amount: newBooking.remainingAmount,
            status: newBooking.status,
            addon_ids: newBooking.addonIds,
            notes: newBooking.notes ?? "",
            skin_type: bookingData.skinType ?? "",
            invoice: {
              id: newInvoice.id,
              invoice_number: newInvoice.invoiceNumber,
              issue_date: newInvoice.issueDate,
              payment_method: newInvoice.paymentMethod,
              status: newInvoice.status,
            },
          },
        });
        if (error) {
          const msg = error.message || "";
          toast.error(
            msg.includes("DATE_BLOCKED")
              ? "هذا التاريخ غير متاح للحجز."
              : "تعذر حفظ الحجز في قاعدة البيانات. يرجى المحاولة مرة أخرى."
          );
          setBookings((prev) => prev.filter((b) => b.ref !== newBooking.ref));
          setInvoices((prev) =>
            prev.filter((i) => i.bookingRef !== newBooking.ref)
          );
        }
        if (refreshRef.current) await refreshRef.current();
      })();
    }

    return newBooking;
  };

  const updateBookingStatus = (ref: string, status: BookingRecord["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.ref === ref ? { ...b, status } : b))
    );

    // Synchronize invoices in memory immediately
    if (status === "COMPLETED") {
      setInvoices((prev) =>
        prev.map((i) =>
          i.bookingRef === ref
            ? { ...i, status: "مسدد بالكامل", remainingBalance: 0 }
            : i
        )
      );
    } else if (status === "CANCELLED") {
      setInvoices((prev) =>
        prev.map((i) =>
          i.bookingRef === ref ? { ...i, status: "ملغاة / مسترجعة" } : i
        )
      );
    }

    toast.success(`تم تحديث حالة الحجز #${ref} إلى: ${status}`);

    const supabase = createClient();
    if (supabase) {
      void (async () => {
        const { error } = await supabase.rpc("admin_update_booking_status", {
          p_ref: ref,
          p_status: status,
        });
        if (error) {
          toast.error("تعذر تحديث حالة الحجز في قاعدة البيانات", {
            description: error.message,
          });
        }
        if (refreshRef.current) await refreshRef.current();
      })();
    }
  };

  const addReview = (
    reviewData: Omit<ReviewItem, "id" | "approved" | "featured">
  ) => {
    const newRev: ReviewItem = {
      ...reviewData,
      id: "rev-" + Date.now(),
      approved: true,
      featured: false,
    };
    setReviews((prev) => [newRev, ...prev]);
    toast.success("شكراً لكِ! تم استقبال تقييمكِ بنجاح وتم نشره في الموقع ");

    const supabase = createClient();
    if (supabase) {
      void (async () => {
        await supabase.from("reviews").insert({
          id: newRev.id,
          client_name: newRev.clientName,
          package_title: newRev.packageTitle,
          rating: newRev.rating,
          date: newRev.date,
          venue: newRev.venue,
          comment: newRev.comment,
          approved: newRev.approved,
          featured: newRev.featured,
        });
        if (refreshRef.current) await refreshRef.current();
      })();
    }
  };

  const toggleReviewApproval = (id: string) => {
    let nextApproved = true;
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          nextApproved = !r.approved;
          return { ...r, approved: nextApproved };
        }
        return r;
      })
    );
    toast.success("تم تحديث حالة اعتماد التقييم");

    const supabase = createClient();
    if (supabase) {
      void (async () => {
        const { error } = await supabase
          .from("reviews")
          .update({ approved: nextApproved })
          .eq("id", id);
        if (error) {
          toast.error("تعذر تحديث حالة اعتماد التقييم");
        }
        if (refreshRef.current) await refreshRef.current();
      })();
    }
  };

  const toggleReviewFeatured = (id: string) => {
    let nextFeatured = false;
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          nextFeatured = !r.featured;
          return { ...r, featured: nextFeatured };
        }
        return r;
      })
    );
    toast.success("تم تحديث تمييز التقييم");

    const supabase = createClient();
    if (supabase) {
      void (async () => {
        const { error } = await supabase
          .from("reviews")
          .update({ featured: nextFeatured })
          .eq("id", id);
        if (error) {
          toast.error("تعذر تحديث تمييز التقييم");
        }
        if (refreshRef.current) await refreshRef.current();
      })();
    }
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast.success("تم حذف التقييم بنجاح");
    const supabase = createClient();
    if (supabase) {
      void (async () => {
        const { error } = await supabase.from("reviews").delete().eq("id", id);
        if (error) {
          toast.error("تعذر حذف التقييم من قاعدة البيانات");
        }
        if (refreshRef.current) await refreshRef.current();
      })();
    }
  };

  const updateCustomerNotes = (id: string, notes: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, notes } : c))
    );
    toast.success("تم حفظ ملاحظات ملف العميلة بنجاح");

    const supabase = createClient();
    if (supabase) {
      void (async () => {
        const { error } = await supabase.rpc("admin_update_customer_notes", {
          p_id: id,
          p_notes: notes,
        });
        if (error) {
          toast.error("تعذر حفظ ملاحظات ملف العميلة في قاعدة البيانات");
        }
        if (refreshRef.current) await refreshRef.current();
      })();
    }
  };

  const toggleBlockedDate = (date: string) => {
    let wasBlocked = false;
    setBlockedDates((prev) => {
      wasBlocked = prev.includes(date);
      const updated = wasBlocked
        ? prev.filter((d) => d !== date)
        : [...prev, date];
      toast.success(
        wasBlocked
          ? `تمت إتاحة التاريخ مجدداً: ${date}`
          : `تم إغلاق التاريخ: ${date}`
      );
      return updated;
    });

    const supabase = createClient();
    if (supabase) {
      void (async () => {
        let err;
        if (wasBlocked) {
          const res = await supabase
            .from("blocked_dates")
            .delete()
            .eq("date", date);
          err = res.error;
        } else {
          const res = await supabase
            .from("blocked_dates")
            .upsert({ date, reason: "إجازة / مغلق من لوحة التحكم" });
          err = res.error;
        }
        if (err) {
          toast.error("تعذر تحديث حالة إغلاق التاريخ في قاعدة البيانات");
        }
        if (refreshRef.current) await refreshRef.current();
      })();
    }
  };

  const addBlogPost = (postData: Omit<BlogPost, "id">) => {
    const newPost: BlogPost = {
      ...postData,
      id: "post-" + Date.now(),
    };
    setBlogPosts((prev) => [newPost, ...prev]);
    toast.success(`تم نشر المقال بنجاح: ${postData.title} ✨`);

    const supabase = createClient();
    if (supabase) {
      void (async () => {
        const { error } = await supabase.from("blog_posts").insert({
          id: newPost.id,
          slug: newPost.slug,
          title: newPost.title,
          excerpt: newPost.excerpt,
          content: newPost.content,
          category: newPost.category,
          category_ar: newPost.categoryAr,
          author: newPost.author,
          author_role: newPost.authorRole,
          read_time: newPost.readTime,
          published_at: newPost.publishedAt,
          cover_image: newPost.coverImage,
          featured: Boolean(newPost.featured),
          published: newPost.published,
          tags: newPost.tags,
        });
        if (error) {
          toast.error("تعذر نشر المقال في قاعدة البيانات", {
            description: error.message,
          });
        }
        if (refreshRef.current) await refreshRef.current();
      })();
    }
  };

  const updateBlogPost = (id: string, updates: Partial<BlogPost>) => {
    setBlogPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    toast.success("تم تحديث بيانات المقال بنجاح");

    const supabase = createClient();
    if (supabase) {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.excerpt !== undefined) dbUpdates.excerpt = updates.excerpt;
      if (updates.content !== undefined) dbUpdates.content = updates.content;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.categoryAr !== undefined)
        dbUpdates.category_ar = updates.categoryAr;
      if (updates.published !== undefined)
        dbUpdates.published = updates.published;
      if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;

      void (async () => {
        const { error } = await supabase
          .from("blog_posts")
          .update(dbUpdates)
          .eq("id", id);
        if (error) {
          toast.error("تعذر تحديث بيانات المقال");
        }
        if (refreshRef.current) await refreshRef.current();
      })();
    }
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
    toast.success("تم حذف المقال بنجاح");

    const supabase = createClient();
    if (supabase) {
      void (async () => {
        const { error } = await supabase
          .from("blog_posts")
          .delete()
          .eq("id", id);
        if (error) {
          toast.error("تعذر حذف المقال من قاعدة البيانات");
        }
        if (refreshRef.current) await refreshRef.current();
      })();
    }
  };

  const toggleBlogPublished = (id: string) => {
    let nextPub = true;
    setBlogPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          nextPub = !p.published;
          return { ...p, published: nextPub };
        }
        return p;
      })
    );
    toast.success("تم تغيير حالة نشر المقال");

    const supabase = createClient();
    if (supabase) {
      void (async () => {
        const { error } = await supabase
          .from("blog_posts")
          .update({ published: nextPub })
          .eq("id", id);
        if (error) {
          toast.error("تعذر تحديث حالة نشر المقال");
        }
        if (refreshRef.current) await refreshRef.current();
      })();
    }
  };

  const toggleBlogFeatured = (id: string) => {
    let nextFeat = false;
    setBlogPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          nextFeat = !p.featured;
          return { ...p, featured: nextFeat };
        }
        return p;
      })
    );
    toast.success("تم تحديث تمييز المقال في الواجهة الرئيسية للمدونة");

    const supabase = createClient();
    if (supabase) {
      void (async () => {
        const { error } = await supabase
          .from("blog_posts")
          .update({ featured: nextFeat })
          .eq("id", id);
        if (error) {
          toast.error("تعذر تحديث تمييز المقال");
        }
        if (refreshRef.current) await refreshRef.current();
      })();
    }
  };

  return (
    <AppStoreContext.Provider
      value={{
        packages,
        addons,
        bookings,
        invoices,
        customers,
        reviews,
        gallery,
        blogPosts,
        faqs,
        areas,
        blockedDates,
        selectedPackageId,
        setSelectedPackageId,
        lastConfirmedBooking,
        setLastConfirmedBooking,
        isSupabaseConnected,
        isSyncing,
        currentUser,
        refreshFromDatabase,
        seedDatabase,
        configureSupabaseConnection,
        signOutAdmin,
        addPackage,
        updatePackage,
        togglePackageActive,
        deletePackage,
        createBooking,
        updateBookingStatus,
        addReview,
        toggleReviewApproval,
        toggleReviewFeatured,
        deleteReview,
        updateCustomerNotes,
        toggleBlockedDate,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        toggleBlogPublished,
        toggleBlogFeatured,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppStoreProvider");
  }
  return context;
}
