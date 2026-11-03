import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  INITIAL_PACKAGES,
  INITIAL_ADDONS,
  INITIAL_AREAS,
  INITIAL_BOOKINGS,
  INITIAL_INVOICES,
  INITIAL_CUSTOMERS,
  INITIAL_REVIEWS,
  INITIAL_GALLERY,
  INITIAL_BLOG_POSTS,
  INITIAL_FAQS,
} from "@/features/data/initial-data";

export async function POST() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Supabase is not configured yet." },
      { status: 400 }
    );
  }

  try {
    await supabase.from("service_packages").upsert(
      INITIAL_PACKAGES.map((p) => ({
        id: p.id,
        title: p.title,
        title_en: p.titleEn,
        price: p.price,
        deposit_percentage: p.depositPercentage,
        duration: p.duration,
        category: p.category,
        popular: Boolean(p.popular),
        active: p.active,
        description: p.description,
        features: p.features,
        badge: p.badge ?? null,
      })),
      { onConflict: "id", ignoreDuplicates: true }
    );

    await supabase.from("addons").upsert(
      INITIAL_ADDONS.map((a) => ({
        id: a.id,
        title: a.title,
        price: a.price,
        description: a.description,
        popular: Boolean(a.popular),
      })),
      { onConflict: "id", ignoreDuplicates: true }
    );

    await supabase.from("riyadh_areas").upsert(
      INITIAL_AREAS.map((a) => ({
        id: a.id,
        name_ar: a.nameAr,
        name_en: a.nameEn,
        zone: a.zone,
        travel_fee: a.travelFee,
      })),
      { onConflict: "id", ignoreDuplicates: true }
    );

    await supabase.from("bookings").upsert(
      INITIAL_BOOKINGS.map((b) => ({
        id: b.id,
        ref: b.ref,
        client_name: b.clientName,
        phone: b.phone,
        package_id: b.packageId,
        package_name: b.packageName,
        date: b.date,
        time_slot: b.timeSlot,
        location_type: b.locationType,
        venue: b.venue,
        area_id: b.areaId,
        total_amount: b.totalAmount,
        deposit_amount: b.depositAmount,
        remaining_amount: b.remainingAmount,
        status: b.status,
        addon_ids: b.addonIds,
        notes: b.notes ?? null,
        created_at: b.createdAt,
      })),
      { onConflict: "ref", ignoreDuplicates: true }
    );

    await supabase.from("invoices").upsert(
      INITIAL_INVOICES.map((i) => ({
        id: i.id,
        invoice_number: i.invoiceNumber,
        booking_ref: i.bookingRef,
        client_name: i.clientName,
        package_name: i.packageName,
        issue_date: i.issueDate,
        total_amount: i.totalAmount,
        deposit_paid: i.depositPaid,
        remaining_balance: i.remainingBalance,
        payment_method: i.paymentMethod,
        status: i.status,
      })),
      { onConflict: "invoice_number" }
    );

    await supabase.from("customers").upsert(
      INITIAL_CUSTOMERS.map((c) => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        tier: c.tier,
        skin_type: c.skinType,
        undertone: c.undertone,
        allergies: c.allergies ?? null,
        favorite_palette: c.favoritePalette,
        total_bookings: c.totalBookings,
        last_visit: c.lastVisit,
        notes: c.notes,
      })),
      { onConflict: "id", ignoreDuplicates: true }
    );

    await supabase.from("reviews").upsert(
      INITIAL_REVIEWS.map((r) => ({
        id: r.id,
        client_name: r.clientName,
        package_title: r.packageTitle,
        rating: r.rating,
        date: r.date,
        venue: r.venue,
        comment: r.comment,
        approved: r.approved,
        featured: r.featured,
      })),
      { onConflict: "id", ignoreDuplicates: true }
    );

    await supabase.from("gallery_looks").upsert(
      INITIAL_GALLERY.map((g) => ({
        id: g.id,
        title: g.title,
        category: g.category,
        category_ar: g.categoryAr,
        image: g.image,
        client_type: g.clientType,
        style_tags: g.styleTags,
      })),
      { onConflict: "id", ignoreDuplicates: true }
    );

    await supabase.from("blog_posts").upsert(
      INITIAL_BLOG_POSTS.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        category: p.category,
        category_ar: p.categoryAr,
        author: p.author,
        author_role: p.authorRole,
        read_time: p.readTime,
        published_at: p.publishedAt,
        cover_image: p.coverImage,
        featured: Boolean(p.featured),
        published: p.published,
        tags: p.tags,
      })),
      { onConflict: "id", ignoreDuplicates: true }
    );

    await supabase.from("faqs").upsert(
      INITIAL_FAQS.map((f) => ({
        id: f.id,
        category: f.category,
        category_ar: f.categoryAr,
        question: f.question,
        answer: f.answer,
        keywords: f.keywords,
      })),
      { onConflict: "id", ignoreDuplicates: true }
    );

    await supabase.from("blocked_dates").upsert(
      [
        { date: "2025-10-14", reason: "محجوز بالكامل لعروس VIP" },
        { date: "2025-10-21", reason: "إجازة الأتيليه الرسمية" },
      ],
      { onConflict: "date" }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Seed failed" },
      { status: 500 }
    );
  }
}

