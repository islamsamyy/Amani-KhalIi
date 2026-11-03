-- =============================================================================
-- AMANI KHALIL HAUTE BEAUTÉ ATELIER — SUPABASE POSTGRES SCHEMA, RLS & SEED DATA
-- =============================================================================

-- 1. TABLES
create table if not exists public.service_packages (
  id text primary key,
  title text not null,
  title_en text not null default '',
  price integer not null,
  deposit_percentage integer not null default 30,
  duration text not null,
  category text not null check (category in ('bridal', 'engagement', 'evening', 'trial', 'group')),
  popular boolean not null default false,
  active boolean not null default true,
  description text not null,
  features jsonb not null default '[]'::jsonb,
  badge text,
  created_at timestamptz not null default now()
);

create table if not exists public.addons (
  id text primary key,
  title text not null,
  price integer not null,
  description text not null,
  popular boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.riyadh_areas (
  id text primary key,
  name_ar text not null,
  name_en text not null,
  zone text not null,
  travel_fee integer not null default 0
);

create table if not exists public.bookings (
  id text primary key,
  ref text unique not null,
  client_name text not null,
  phone text not null,
  package_id text not null,
  package_name text not null,
  date text not null,
  time_slot text not null,
  location_type text not null check (location_type in ('HOTEL_HALL', 'CLIENT_HOME', 'STUDIO')),
  venue text not null,
  area_id text not null,
  total_amount integer not null,
  deposit_amount integer not null,
  remaining_amount integer not null,
  status text not null check (status in ('CONFIRMED', 'PENDING_PAYMENT', 'COMPLETED', 'CANCELLED')),
  addon_ids jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id text primary key,
  invoice_number text unique not null,
  booking_ref text not null,
  client_name text not null,
  package_name text not null,
  issue_date text not null,
  total_amount integer not null,
  deposit_paid integer not null,
  remaining_balance integer not null,
  payment_method text not null,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id text primary key,
  name text not null,
  phone text not null,
  tier text not null default 'Gold',
  skin_type text not null default 'مختلطة',
  undertone text not null default 'محايد (Neutral)',
  allergies text,
  favorite_palette text not null default 'Dior Backstage & Charlotte Tilbury',
  total_bookings integer not null default 1,
  last_visit text not null,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id text primary key,
  client_name text not null,
  package_title text not null,
  rating integer not null check (rating between 1 and 5),
  date text not null,
  venue text not null,
  comment text not null,
  approved boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_looks (
  id text primary key,
  title text not null,
  category text not null,
  category_ar text not null,
  image text not null,
  client_type text not null,
  style_tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id text primary key,
  slug text unique not null,
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null,
  category_ar text not null,
  author text not null,
  author_role text not null,
  read_time text not null,
  published_at text not null,
  cover_image text not null,
  featured boolean not null default false,
  published boolean not null default true,
  tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id text primary key,
  category text not null,
  category_ar text not null,
  question text not null,
  answer text not null,
  keywords jsonb not null default '[]'::jsonb
);

create table if not exists public.blocked_dates (
  date text primary key,
  reason text default 'إجازة / محجوز بالكامل',
  created_at timestamptz not null default now()
);

-- 2. INDEXES FOR PERFORMANCE
create index if not exists idx_bookings_date on public.bookings (date);
create index if not exists idx_bookings_status on public.bookings (status);
create index if not exists idx_bookings_created_at on public.bookings (created_at desc);
create index if not exists idx_invoices_booking_ref on public.invoices (booking_ref);
create index if not exists idx_customers_phone on public.customers (phone);
create index if not exists idx_blog_posts_slug on public.blog_posts (slug);

-- 3. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
alter table public.service_packages enable row level security;
alter table public.addons enable row level security;
alter table public.riyadh_areas enable row level security;
alter table public.bookings enable row level security;
alter table public.invoices enable row level security;
alter table public.customers enable row level security;
alter table public.reviews enable row level security;
alter table public.gallery_looks enable row level security;
alter table public.blog_posts enable row level security;
alter table public.faqs enable row level security;
alter table public.blocked_dates enable row level security;

-- 4. EXPLICIT ROLE GRANTS FOR DATA API
grant usage on schema public to anon, authenticated;
grant select on public.service_packages, public.addons, public.riyadh_areas, public.reviews, public.gallery_looks, public.blog_posts, public.faqs, public.blocked_dates to anon, authenticated;
grant select, insert on public.bookings, public.invoices, public.customers to anon, authenticated;
grant insert on public.reviews to anon, authenticated;
grant all on all tables in schema public to authenticated;

-- 5. RLS POLICIES (Idempotent drop & create)
-- Public catalog read policies
drop policy if exists "Public can view service_packages" on public.service_packages;
create policy "Public can view service_packages" on public.service_packages
  for select to anon, authenticated using (true);

drop policy if exists "Admins can manage service_packages" on public.service_packages;
create policy "Admins can manage service_packages" on public.service_packages
  for all to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "Public can view addons" on public.addons;
create policy "Public can view addons" on public.addons
  for select to anon, authenticated using (true);

drop policy if exists "Admins can manage addons" on public.addons;
create policy "Admins can manage addons" on public.addons
  for all to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "Public can view riyadh_areas" on public.riyadh_areas;
create policy "Public can view riyadh_areas" on public.riyadh_areas
  for select to anon, authenticated using (true);

drop policy if exists "Public can view blocked_dates" on public.blocked_dates;
create policy "Public can view blocked_dates" on public.blocked_dates
  for select to anon, authenticated using (true);

drop policy if exists "Admins can manage blocked_dates" on public.blocked_dates;
create policy "Admins can manage blocked_dates" on public.blocked_dates
  for all to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- Bookings, Invoices, Customers: Brides can create bookings/invoices/CRM entries, and view bookings/invoices; Authenticated admins have full control
drop policy if exists "Anyone can read bookings" on public.bookings;
create policy "Anyone can read bookings" on public.bookings
  for select to anon, authenticated using (true);

drop policy if exists "Anyone can create bookings" on public.bookings;
create policy "Anyone can create bookings" on public.bookings
  for insert to anon, authenticated with check (true);

drop policy if exists "Admins can update or delete bookings" on public.bookings;
create policy "Admins can update or delete bookings" on public.bookings
  for all to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "Anyone can read invoices" on public.invoices;
create policy "Anyone can read invoices" on public.invoices
  for select to anon, authenticated using (true);

drop policy if exists "Anyone can create invoices" on public.invoices;
create policy "Anyone can create invoices" on public.invoices
  for insert to anon, authenticated with check (true);

drop policy if exists "Admins can manage invoices" on public.invoices;
create policy "Admins can manage invoices" on public.invoices
  for all to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "Anyone can read customers" on public.customers;
create policy "Anyone can read customers" on public.customers
  for select to anon, authenticated using (true);

drop policy if exists "Anyone can create customers" on public.customers;
create policy "Anyone can create customers" on public.customers
  for insert to anon, authenticated with check (true);

drop policy if exists "Admins can manage customers" on public.customers;
create policy "Admins can manage customers" on public.customers
  for all to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- Reviews, Gallery, Blog, FAQs
drop policy if exists "Public can view reviews" on public.reviews;
create policy "Public can view reviews" on public.reviews
  for select to anon, authenticated using (true);

drop policy if exists "Public can submit reviews" on public.reviews;
create policy "Public can submit reviews" on public.reviews
  for insert to anon, authenticated with check (true);

drop policy if exists "Admins can manage reviews" on public.reviews;
create policy "Admins can manage reviews" on public.reviews
  for all to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "Public can view gallery_looks" on public.gallery_looks;
create policy "Public can view gallery_looks" on public.gallery_looks
  for select to anon, authenticated using (true);

drop policy if exists "Admins can manage gallery_looks" on public.gallery_looks;
create policy "Admins can manage gallery_looks" on public.gallery_looks
  for all to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "Public can view blog_posts" on public.blog_posts;
create policy "Public can view blog_posts" on public.blog_posts
  for select to anon, authenticated using (true);

drop policy if exists "Admins can manage blog_posts" on public.blog_posts;
create policy "Admins can manage blog_posts" on public.blog_posts
  for all to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "Public can view faqs" on public.faqs;
create policy "Public can view faqs" on public.faqs
  for select to anon, authenticated using (true);

drop policy if exists "Admins can manage faqs" on public.faqs;
create policy "Admins can manage faqs" on public.faqs
  for all to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- 6. SEED DATA (IDEMPOTENT UPSERTS)
insert into public.service_packages (id, title, title_en, price, deposit_percentage, duration, category, popular, active, badge, description, features)
values
  (
    'vip-bridal',
    'باقة العروس الملكية VIP',
    'Royal Bridal VIP Package',
    2800,
    30,
    '٤ إلى ٥ ساعات تفرغ كامل',
    'bridal',
    true,
    true,
    'الأكثر طلباً للعرائس',
    'تتضمن الزيارة الخارجية لكافة فنادق وقصور أفراح الرياض، رموش Mink 3D مخصصة، عناية متكاملة قبل المكياج، وحقيبة رتوش فاخرة هدية (بقيمة ٤٥٠ ر.س).',
    '["حضور حصري لعروس واحدة يومياً لضمان التفرغ الملكي التام","تهيئة كورية مكثفة للبشرة والمساج اللمفاوي قبل تطبيق الفاونديشن","تقنية التثبيت الهيدروليكي المقاوم للدموع والأضواء السينمائية حتى ١٨ ساعة","حقيبة رتوش فاخرة متكاملة تشمل أحمر الشفاه وبودرة التثبيت هدية","تركيب رموش Mink ثلاثية الأبعاد خفيفة الوزن ومخصصة لمورفولوجيا العين","شاملة رسوم الانتقال لكافة أحياء وقصور وفنادق مدينة الرياض"]'::jsonb
  ),
  (
    'milkah-engagement',
    'باقة الملكة والخطوبة الفاخرة',
    'Luxury Engagement & Milkah',
    1400,
    30,
    'ساعتان ونصف',
    'engagement',
    false,
    true,
    'إطلالة ملكية ناعمة',
    'إطلالة ملكية ناعمة مصممة لأضواء الحفل والتصوير الفوتوغرافي عالي الدقة. رموش فاخرة مع مستحضرات تثبيت مضادة للتعرق تدوم ١٦ ساعة.',
    '["تغطية مخملية خفيفة تبرز إشراقة الملامح دون لمعان زيتي","مكياج عيون ساحر متناغم مع لون فستان الحفل والمجوهرات","رموش طبيعية فاخرة تمنح العين عمقاً وتألقاً في لقطات الفيديو 4K","جلسة ترطيب عميقة قبل المكياج مع فيكس بلس لتثبيت فائق","خدمة الحضور للجناح الفندقي أو منزل العروس داخل الرياض"]'::jsonb
  ),
  (
    'evening-vip',
    'مكياج السهرات والمناسبات VIP',
    'Evening VIP Glam',
    850,
    30,
    'ساعة ونصف',
    'evening',
    false,
    true,
    'لسيدات النخبة',
    'مكياج سهرة كامل مع كونتورينغ سينمائي يبرز الملامح وألوان ناعمة متناسقة مع فستان السهرة، يشمل رموش طبيعية متعددة الطبقات.',
    '["نحت ونضارة كونتور الوجه بأحدث تقنيات Dior Backstage","ظلال عيون برونزية أو سموكي ناعم بحسب اختياركِ","تثبيت حراري متقدم يدوم طوال سهرة الحفل","مستحضرات أصلية ١٠٠٪ لطيفة على البشرة الحساسة"]'::jsonb
  ),
  (
    'soft-glam',
    'مكياج ناعم وطبيعي (Soft Glam)',
    'Soft Glam & Natural Glow',
    650,
    30,
    'ساعة وربع',
    'evening',
    false,
    true,
    null,
    'إطلالة ناعمة بأسلوب اللامكياج الفاخر تبرز نضارة البشرة مع لمسات إضاءة خافتة وأحمر شفاه طبيعي يدوم طويلاً.',
    '["توحيد خفيف ومشرق للون البشرة","إبراز طبيعي لملامح العين والحواجب شعرة بشعرة","جلوس وأحمر شفاه نيود بألوان تتماشى مع لون البشرة"]'::jsonb
  ),
  (
    'bridal-trial',
    'جلسة التجربة والاستشارة (Bridal Trial)',
    'Bridal Trial & Consultation',
    550,
    30,
    'ساعتان كاملتان',
    'trial',
    false,
    true,
    null,
    'جلسة خاصة بالأكاديمية لتجربة رسمة العين ودرجات الفاونديشن وتنسيق الإطلالة المكتملة مع فستان الزفاف وتفاصيل الطرحة.',
    '["تجربة درجات الشفاه والفاونديشن تحت درجات إضاءة مختلفة","تدوين ملف الجمال الخاص بكِ لتوثيق المستحضرات المختارة حرفياً","استشارة متخصصة لمواءمة الإطلالة مع تسريحة الشعر وتصميم الفستان"]'::jsonb
  ),
  (
    'companions-group',
    'باقة المرافقات وأهل العروس',
    'Bridal Companions & Family',
    500,
    30,
    'ساعة لكل مرافقة',
    'group',
    false,
    true,
    null,
    'مكياج سهرة راقٍ لأهل العروس ومرافقاتها بنفس معايير الفخامة والتعقيم مع خصم إضافي للمجموعات.',
    '["تنسيق إطلالات متناغمة ومتميزة لكل مرافقة","خصم إضافي ١٠٪ عند حجز ٣ مرافقات فأكثر مع العروس","مستحضرات عالمية فاخرة ومقاومة للتعرق"]'::jsonb
  )
on conflict (id) do update set
  title = excluded.title,
  title_en = excluded.title_en,
  price = excluded.price,
  deposit_percentage = excluded.deposit_percentage,
  duration = excluded.duration,
  category = excluded.category,
  popular = excluded.popular,
  active = excluded.active,
  badge = excluded.badge,
  description = excluded.description,
  features = excluded.features;

insert into public.addons (id, title, price, description, popular)
values
  ('addon_hair', 'مصففة شعر ملكية مرافقة من الفريق', 500, 'تسريحة شعر متكاملة للعروس من خبيرة متخصصة ومصاحبة لجلسة المكياج.', true),
  ('addon_facial', 'جلسة ترطيب كوري مكثفة (Glass Skin Facial)', 250, 'تهيئة عميقة للبشرة بالكولاجين وحمض الهيالورونيك والمساج اللمفاوي.', false),
  ('addon_hall_escort', 'مرافقة القاعة ورتوش الزفة حتى خروج العروس', 800, 'تواجد شخصي في جناح قاعة الفرح للرتوش، تعديل أحمر الشفاه وتثبيت الطرحة قبل الزفة.', false),
  ('addon_body_glow', 'تغطية ونضارة الرقبة والديكولتيه (Body Glow)', 300, 'توحيد لون البشرة وإضاءة مخملية ناعمة مقاومة لانتقال اللون على قماش الفستان.', false),
  ('addon_escort', 'مكياج مرافقة إضافية (أخت العروس / الوالدة)', 450, 'مكياج سهرة متكامل لمرافقة واحدة أثناء جلسة تجهيز العروس.', false)
on conflict (id) do update set
  title = excluded.title,
  price = excluded.price,
  description = excluded.description,
  popular = excluded.popular;

insert into public.riyadh_areas (id, name_ar, name_en, zone, travel_fee)
values
  ('area_hitin', 'حطين والملقا والنرجس', 'Hittin, Malqa, Narjis', 'شمال الرياض', 0),
  ('area_yasmin', 'الياسمين والصحافة والعقيق', 'Alyasmin, Sahafa, Aqeeq', 'شمال الرياض', 0),
  ('area_nakheel', 'النخيل والرحمانية والمعذر', 'Nakheel, Rahmaniyah, Maather', 'شمال الرياض', 0),
  ('area_hotels_vip', 'فنادق الرياض الكبرى (الريتز، فورسيزونز، الفيصلية)', 'Luxury Hotels (Ritz, Four Seasons, Faisaliah)', 'وسط الرياض', 0),
  ('area_east', 'اليرموك وقرطبة والحمراء والروضة', 'East Riyadh (Qurtubah, Hamra)', 'شرق الرياض', 150),
  ('area_west', 'لبن وعرقة والسفارات والدرعية', 'West Riyadh (Irqah, Diplomatic Quarter, Diriyah)', 'غرب الرياض', 150),
  ('area_south', 'جنوب الرياض والأحياء البعيدة', 'South Riyadh', 'وسط الرياض', 250)
on conflict (id) do update set
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  zone = excluded.zone,
  travel_fee = excluded.travel_fee;

insert into public.blocked_dates (date, reason)
values
  ('2025-10-14', 'محجوز بالكامل لعروس VIP'),
  ('2025-10-21', 'إجازة الأتيليه الرسمية')
on conflict (date) do nothing;

insert into public.bookings (id, ref, client_name, phone, package_id, package_name, date, time_slot, location_type, venue, area_id, total_amount, deposit_amount, remaining_amount, status, addon_ids, notes, created_at)
values
  (
    'b-01',
    'AK-2025-5038',
    'سارة الفهيد',
    '0551234567',
    'vip-bridal',
    'باقة العروس الملكية VIP',
    '2025-10-09',
    'عصراً (02:30 م)',
    'HOTEL_HALL',
    'فندق الريتز-كارلتون، الرياض — الجناح الملكي 412',
    'area_hotels_vip',
    3550,
    1065,
    2485,
    'CONFIRMED',
    '["addon_hair","addon_facial"]'::jsonb,
    'بشرة جافة، تفضل كونتور ناعم وألوان نيود روز مع رموش طبيعية.',
    '2025-10-01T10:00:00Z'
  ),
  (
    'b-02',
    'AK-2025-4819',
    'نورة بنت مساعد آل سعود',
    '0509876543',
    'bridal-trial',
    'جلسة الاستشارة وتجربة المكياج',
    '2025-10-09',
    'صباحاً (11:00 ص)',
    'STUDIO',
    'أتيليه أماني خليل الخاص — جناح الاستشارات رقم 1',
    'area_hitin',
    550,
    165,
    385,
    'COMPLETED',
    '[]'::jsonb,
    'تم الاتفاق على لوك العرس النهائي وتوثيق المنتجات.',
    '2025-10-02T14:30:00Z'
  ),
  (
    'b-03',
    'AK-2025-3921',
    'سمو الأميرة ريم بن فهد',
    '0543219876',
    'evening-vip',
    'مكياج سهرة VIP ملكي',
    '2025-10-09',
    'مساءً (06:45 م)',
    'HOTEL_HALL',
    'فندق فورسيزونز، برج المملكة — قاعة كبار الشخصيات',
    'area_hotels_vip',
    1150,
    345,
    805,
    'CONFIRMED',
    '["addon_body_glow"]'::jsonb,
    'فستان كحلي داكن، تفضل سموكي برونزي ولمسة ذهبية.',
    '2025-10-04T09:15:00Z'
  ),
  (
    'b-04',
    'AK-2025-2814',
    'العنود الشمري',
    '0561122334',
    'vip-bridal',
    'باقة العروس الملكية VIP',
    '2025-11-28',
    'عصراً (02:00 م)',
    'HOTEL_HALL',
    'قصر الثقافة، حي السفارات',
    'area_west',
    3600,
    1080,
    2520,
    'PENDING_PAYMENT',
    '["addon_hall_escort"]'::jsonb,
    'بانتظار سداد العربون المتبقي.',
    '2025-10-08T18:00:00Z'
  ),
  (
    'b-05',
    'AK-2025-1992',
    'د. رزان المقرن',
    '0559988776',
    'milkah-engagement',
    'باقة الملكة والخطوبة الفاخرة',
    '2025-12-12',
    'مساءً (04:30 م)',
    'CLIENT_HOME',
    'فيلا خاصة، حي النخيل الغربي',
    'area_nakheel',
    1400,
    420,
    980,
    'PENDING_PAYMENT',
    '[]'::jsonb,
    null,
    '2025-10-09T08:00:00Z'
  )
on conflict (ref) do nothing;

insert into public.invoices (id, invoice_number, booking_ref, client_name, package_name, issue_date, total_amount, deposit_paid, remaining_balance, payment_method, status)
values
  ('inv-01', 'INV-2025-0891', 'AK-2025-5038', 'سارة الفهيد', 'باقة العروس الملكية VIP', '2025-10-01', 3550, 1065, 2485, 'Apple Pay', 'مدفوع العربون (30%)'),
  ('inv-02', 'INV-2025-0890', 'AK-2025-4819', 'نورة بنت مساعد آل سعود', 'جلسة الاستشارة وتجربة المكياج', '2025-10-02', 550, 550, 0, 'mada', 'مسدد بالكامل'),
  ('inv-03', 'INV-2025-0889', 'AK-2025-3921', 'سمو الأميرة ريم بن فهد', 'مكياج سهرة VIP ملكي', '2025-10-04', 1150, 345, 805, 'تحويل بنكي', 'مدفوع العربون (30%)')
on conflict (invoice_number) do nothing;

insert into public.customers (id, name, phone, tier, skin_type, undertone, allergies, favorite_palette, total_bookings, last_visit, notes)
values
  ('c-01', 'سارة الفهيد', '0551234567', 'VIP Royal', 'جافة وحساسة', 'دافئ (Warm Golden)', 'حساسية من الزيوت العطرية الثقيلة', 'Tom Ford Nude Dip & Charlotte Tilbury Pillow Talk', 2, '2025-10-09', 'عروس راقية، تم تخصيص فاونديشن Dior Backstage مع مرطب كوري مضاعف.'),
  ('c-02', 'نورة بنت مساعد آل سعود', '0509876543', 'Diamond', 'مختلطة نضرة', 'محايد (Neutral)', null, 'Dior Warm Neutrals & NARS Orgasm', 3, '2025-10-09', 'تفضل الآيلاينر المجنح الناعم جداً والشفاه اللامعة مع كونتورينغ خفيف.'),
  ('c-03', 'سمو الأميرة ريم بن فهد', '0543219876', 'VIP Royal', 'عادية', 'دافئ زيتوني (Warm Olive)', null, 'Hourglass Ambient Lighting & Huda Beauty Rose Quartz', 5, '2025-10-09', 'عميلة دائمة لمناسبات القصور؛ تعتمد على ذوق أماني الكامل في اختيار الإطلالة.')
on conflict (id) do nothing;

insert into public.reviews (id, client_name, package_title, rating, date, venue, comment, approved, featured)
values
  ('rev-01', 'العروس حصة السبيعي', 'باقة العروس الملكية VIP', 5, 'أكتوبر 2025', 'فندق الفورسيزونز، الرياض', 'أماني إنسانة وفنانة قبل كل شيء. تعامل راقٍ وهدوء أعصاب بث فيني الطمأنينة بيوم زفافي. المكياج استمر ثابت من الظهر لين الساعة ٤ الصباح وما تحرك ولا تأكسد، والكل انبهر بنضارة البشرة!', true, true),
  ('rev-02', 'ديمة آل الشيخ', 'مكياج السهرات والمناسبات VIP', 5, 'سبتمبر 2025', 'قاعة نيارة الملكية', 'أفضل ميكب أرتست بالرياض بدون منازع. دقة المواعيد، نظافة وتعقيم الفرش أمام عيني، وفهمها لملامح الوجه بدون أي تغيير شاذ للمظهر. شكرًا أماني من كل قلبي.', true, true),
  ('rev-03', 'العروس شهد التميمي', 'باقة العروس الملكية VIP', 5, 'سبتمبر 2025', 'فندق الريتز-كارلتون', 'تفرغ أماني لعروس واحدة باليوم كان السبب الرئيسي لاختياري لها. حسيت باهتمام استثنائي وحقيبة الرتوش الفاخرة أنقذتني بالقاعة. فخورة جدًا بالنتيجة.', true, true),
  ('rev-04', 'منى القحطاني', 'باقة الملكة والخطوبة الفاخرة', 5, 'أغسطس 2025', 'منزل العروس — حي حطين', 'شغل نظيف وفخم ويواجه! الصور والفيديو طلعت خيالية وكأنها غلاف مجلة. الكل سألني عن سر لمعان البشرة.', true, false)
on conflict (id) do nothing;

insert into public.gallery_looks (id, title, category, category_ar, image, client_type, style_tags)
values
  ('look-01', 'مكياج العروس الملكي (Royal Glow)', 'bridal', 'عرائس ملكي', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBsAGcs_awev92ZT2Mi6dY05VdBYQcCp-1Rf3SyuGFcSlRMD7Xu1bQ5ToymWmKy55wAfmdv17GExTP1qCaSNdhNMgrLkhBmHJy-SroDXt_nljfrgMWsxhW9j7CFapkyPhw28yOSjKJ0PHJLUgdTk6jfXXyqoHiejneKWotopn52bA_7X0IogtOStcGbYH21Zq6aQ5pNHJc5rHDn73aDMKCXwbsiDDqYfAsfHcRxLQ', 'عروس فندق الريتز-كارلتون', '["بشرة زجاجية","آيلاينر كلاسيكي","أحمر شفاه نيود روز"]'::jsonb),
  ('look-02', 'مكياج سهرة مخملي (Velvet Bronze Glam)', 'evening', 'سهرة فخم', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXp0r6-80w5LhQcR3i-GfUf09Z7k08zI8Gj9g0Y6mI4xN8-L5h0J0y8k2a0oM6p3u4w8t1y0e9r8t7y6u5i4o3p2a1s0d9f8g7h6j5k4l3z2x1c0v9b8n7m6', 'حفل قاعة نيارة', '["سموكي برونزي","كونتورينغ سينمائي","رموش ثلاثية الأبعاد"]'::jsonb),
  ('look-03', 'إطلالة ملكة ناعمة (Soft Pearl Bridal)', 'engagement', 'خطوبة وملكة', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCH1N1YF4z175y2VjU2vC9J7gq4m6m8z110b2h1g6y8x2k1l0p9o8i7u6y5t4r3e2w1q0p9o8i7u6y5t4r3e2w1q0p9o8i7u6y5t4r3e2w1', 'حفل عقد قران خاص', '["تغطية ناعمة","إشراقة وردية","حواجب شعرة بشعرة"]'::jsonb),
  ('look-04', 'لوك اللامكياج الفاخر (Dewy Clean Glam)', 'soft', 'ناعم وطبيعي', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-61K56j0s7Q8-F9w0Z8k3-4m8v7y1X9j2K0l4p8o1i6u0y4t8r2e6w0q4p8o2i6u0y4t8r2e6w0q4p8o2i6u0y4t8r2e6w0q4', 'جلسة تصوير خاصة', '["بشرة نضرة","شفاه جلوس كرزي","إضاءة خافتة"]'::jsonb)
on conflict (id) do nothing;

insert into public.faqs (id, category, category_ar, question, answer, keywords)
values
  ('faq-01', 'bridal', 'حجوزات العرائس وتأكيد الموعد', 'متى يُفضل حجز موعد الزفاف لضمان توفر التاريخ؟', 'نوصي بحجز الموعد قبل موعد زفافكِ بمدة تتراوح بين ٣ إلى ٦ أشهر، لا سيما في موسم الأعراس الرئيسي بالرياض (أكتوبر حتى مايو). نظراً لالتزامنا بتقديم أعلى درجات الفخامة فإننا نستقبل عروساً واحدة فقط يومياً لضمان التفرغ الكامل لإطلالتكِ الملكية.', '["تاريخ","توفر","حجز","موعد","زفاف","عروس","قبل"]'::jsonb),
  ('faq-02', 'bridal', 'حجوزات العرائس وتأكيد الموعد', 'هل يشمل حجز العروس مرافقة خبيرة التجميل للقاعة للرتوش؟', 'تشمل باقة العروس الملكية VIP التواجد الكامل بالجناح الفندقي حتى إنهاء كافة التفاصيل وخروج العروس باتجاه القاعة أو جلسة التصوير. كما تتوفر خدمة مرافقة القاعة قبل الزفة كإضافة خاصة (Add-on) بقيمة ٨٠٠ ر.س تشمل ضبط الروج، وتثبيت البودرة، وتأمين الطرحة والرموش حتى الزفة.', '["مرافقة","رتوش","قاعة","فندق","باقة","زفة"]'::jsonb),
  ('faq-03', 'bridal', 'حجوزات العرائس وتأكيد الموعد', 'كم تستغرق جلسة مكياج العروس يوم الزفاف؟', 'نخصص ما بين ساعتين ونصف إلى ٣ ساعات كاملة مكرسة لإطلالة العروس، مقسمة بين: تهيئة البشرة والترطيب العميق بالكولاجين (30 دقيقة)، نحت وتغطية الملامح ومكياج العيون والرموش (90 دقيقة)، وتثبيت الطرحة ومراجعة الإضاءة والتصوير والرتوش (45 دقيقة).', '["كم","مدة","وقت","تستغرق","جلسة","تجهيز","ترطيب"]'::jsonb),
  ('faq-04', 'bridal', 'حجوزات العرائس وتأكيد الموعد', 'كيف يتم تثبيت الموعد النهائي وما هو العربون المطلوب؟', 'يتم تأكيد وتثبيت الحجز النهائي فور سداد عربون ٣٠٪ من إجمالي قيمة الباقة المختارة عن طريق قنوات الدفع الرسمية المعتمدة (مدى، Apple Pay، أو تحويل بنكي). ويتم إرسال عقد حجز إلكتروني رسمي وموثق فورياً عبر الواتساب لضمان حقوقكِ كاملة.', '["عربون","دفع","سداد","تثبيت","موعد","عقد","واتساب","تحويل"]'::jsonb),
  ('faq-05', 'products', 'المستحضرات وثبات المكياج', 'ما هي الماركات العالمية المستخدمة في جلسات المكياج؟', 'نعتمد حصرياً على مستحضرات أصلية ١٠٠٪ مستوردة من أرقى دور التجميل العالمية الرائدة: Dior Backstage, Charlotte Tilbury, Tom Ford Beauty, NARS Cosmetics, Laura Mercier, Huda Beauty, Hourglass.', '["ماركات","مستحضرات","ديور","توم فورد","شارلوت","نارس","براندات"]'::jsonb),
  ('faq-06', 'products', 'المستحضرات وثبات المكياج', 'هل تدوم إطلالة المكياج تحت حرارة وإضاءة قاعات الأفراح بالرياض؟', 'نعم بكل تأكيد. نعتمد تقنية التثبيت الهيدروليكي المزدوج Hydra-Lock™ المدعمة ببودرة التثبيت المجهرية المقاومة للرطوبة وحرارة الأضواء وتصوير الـ 4K، مما يضمن ثباتاً ونضارة تتجاوز ١٨ ساعة دون أكسدة أو تكتل أو لمعان دهني.', '["ثبات","حرارة","قاعات","إضاءة","تصوير","تعرق","18 ساعة"]'::jsonb),
  ('faq-07', 'products', 'المستحضرات وثبات المكياج', 'بشرتي حساسة ومعرضة للحبوب، هل المستحضرات آمنة تماماً؟', 'سلامة بشرتكِ أولويتنا المطلقة. كافة المستحضرات المختارة غير مسدة للمسام إطلاقاً (Non-comedogenic) وخالية من العطور المهيجة. كما نتبع بروتوكول تعقيم طبي يشمل تعقيم الفرش بمحاليل طبية متخصصة وأشعة UV واستخدام أدوات تطبيق أحادية الاستخدام.', '["بشرة","حساسة","حبوب","مسام","تعقيم","فرش","طبية"]'::jsonb),
  ('faq-08', 'location', 'الزيارات الخارجية والفنادق', 'هل تقدمين خدمة المكياج في الفنادق والقاعات والمنازل؟', 'نعم، خدمة الزيارة الخارجية الفاخرة مشمولة كخيار رئيسي. نسعد بالحضور إلى كافة أجنحة الفنادق والقصور والقاعات الفخمة في مدينة الرياض (فورسيزونز، الريتز، نيارة، برج الفيصلية)، كما نغطي الفلل والمنازل الخاصة بشمال وشرق وغرب الرياض مع حقيبة إضاءة احترافية متنقلة.', '["فندق","فورسيزونز","ريتز","قاعة","نيارة","قصور","منازل","تغطية"]'::jsonb),
  ('faq-09', 'location', 'الزيارات الخارجية والفنادق', 'هل هناك رسوم تنقل إضافية داخل مدينة الرياض؟', 'خدمة التنقل والوصول إلى موقعكِ مشمولة ومجانية بالكامل ضمن باقة العروس الملكية VIP لكافة أحياء الرياض. أما حجوزات السهرة والمرافقات المنفصلة، فيتم احتساب بدل تنقل رمزي (١٥٠ إلى ٢٥٠ ر.س) بناءً على الحي الجغرافي داخل الرياض.', '["رسوم","تنقل","مواصلات","تكلفة","توصيل","بدل"]'::jsonb),
  ('faq-10', 'trial', 'جلسات التجربة Trial والاستشارة', 'هل جلسة تجربة المكياج (Trial) إلزامية؟', 'جلسة التجربة ليست إلزامية، لكننا نوصي بها بشدة لكل عروس ترغب في طمأنينة تامة قبل ليلة العمر. تتضمن تجربة تدرجات الشفاه والظلال والفاونديشن وتدوين ملف جمالي خاص بكِ لتطبيقه حرفياً بيوم الزفاف.', '["بروفة","تجربة","ترايل","trial","إلزامي","ضروري","استشارة"]'::jsonb),
  ('faq-11', 'trial', 'جلسات التجربة Trial والاستشارة', 'متى يُفضل إجراء جلسة تجربة المكياج؟', 'أفضل توقيت لحجز جلسة التجربة هو قبل أسبوعين إلى ٤ أسابيع من موعد الزفاف في الأتيليه الخاص بنا بشمال الرياض، بعد الانتهاء من اختيار فستان الزفاف وتسريحة الشعر التقديرية.', '["موعد","البروفة","التجربة","متى","قبل","أسبوعين"]'::jsonb),
  ('faq-12', 'policies', 'التعديل والإلغاء والسياسات', 'ماذا يحدث في حال اضطررتِ لتغيير تاريخ المناسبة؟', 'نقدّر تماماً الظروف المفاجئة؛ يُمكنكِ تأجيل الموعد لمرة واحدة دون أي رسوم إضافية، بشرط تقديم إشعار مسبق قبل ٢١ يوماً على الأقل من التاريخ المحدد وتوفر التاريخ البديل في جدول حجوزاتنا المعتمد.', '["تغيير","تاريخ","تأجيل","موعد","مناسبة","ظروف","نقل"]'::jsonb),
  ('faq-13', 'policies', 'التعديل والإلغاء والسياسات', 'ما هي سياسة استرجاع العربون في حال الإلغاء؟', 'يُعتبر العربون غير مسترد بعد تأكيد الحجز نظراً لإغلاق التاريخ والاعتذار عن قبول كافة طلبات العرائس الأخريات لنفس اليوم. وتسهيلاً لعميلاتنا، يمكن تحويل العربون بالكامل كرصيد دائن يُستخدم لأي خدمة أخرى خلال مدة تصل إلى ٦ أشهر.', '["استرجاع","عربون","إلغاء","فلوس","رصيد","استرداد"]'::jsonb)
on conflict (id) do nothing;

insert into public.blog_posts (id, slug, title, excerpt, content, category, category_ar, author, author_role, read_time, published_at, cover_image, featured, published, tags)
values
  (
    'post-1',
    'riyadh-bride-skincare-timeline',
    'جدول العناية بالبشرة قبل الزفاف بـ 3 أشهر: أسرار نضارة عروس الرياض',
    'دليلكِ الاحترافي المتكامل لتهيئة بشرتكِ قبل ليلة الزفاف، لضمان مظهر مكياج مخملي مشرق يدوم لأكثر من 18 ساعة في أجواء الرياض.',
    '### مرحلة الأشهر الثلاثة قبل ليلة العمر
الاستعداد لليلة الزفاف لا يبدأ في يوم الحفل، بل يتطلب تخطيطاً دقيقاً لتهيئة حاجز البشرة الطبيعي. كخبيرة تجميل معتمدة من CIDESCO، ألاحظ دائماً أن المكياج الأجمل هو الذي يستند إلى بشرة صحية ومرطبة بعمق.

#### 1. الشهر الثالث: بناء الأساس وترميم الحاجز الجلدي
* **الترطيب المضاعف:** إدخال حمض الهيالورونيك والسيراميد صباحاً ومساءً لتعزيز مرونة البشرة.
* **التقشير المدروس:** الابتعاد عن المقشرات القاسية واختيار حمض اللاكتيك أو المندليك اللطيف مرتين أسبوعياً.
* **شرب الماء والأملاح المعدنية:** شرب 3 لترات من الماء يومياً للتغلب على جفاف طقس الرياض.',
    'bridal-tips',
    'نصائح العرائس',
    'أماني خليل',
    'خبيرة تجميل معتمدة دولياً دبلوم CIDESCO',
    '4 دقائق',
    '2025-10-10',
    '/gallery/IMG_5729.webp',
    true,
    true,
    '["عروس الرياض","عناية بالبشرة","تجهيز العروس","مكياج زفاف"]'::jsonb
  ),
  (
    'post-2',
    'makeup-longevity-riyadh-wedding-halls',
    'أسرار ثبات مكياج السهرات والعرائس تحت إضاءة القاعات وحرارة الرياض',
    'كيف تضمنين بقاء مكياجك ثابتاً من العصر وحتى ساعات الفجر دون أكسدة أو لمعان دهني؟ تقنيات حصرية معتمدة عالمياً.',
    '### تحدي إضاءة الـ 4K وحرارة القاعات
تتميز قاعات الأفراح في الرياض بإضاءات تصوير مسرحية شديدة القوة، إضافة إلى تقلبات درجات الحرارة بين التكييف الداخلي والرطوبة الخارجية.',
    'tutorials',
    'دروس وتقنيات',
    'أماني خليل',
    'خبيرة تجميل معتمدة دولياً دبلوم CIDESCO',
    '5 دقائق',
    '2025-10-02',
    '/gallery/IMG_5730.webp',
    true,
    true,
    '["ثبات المكياج","إضاءة القاعات","تصوير 4K","بودرة التثبيت"]'::jsonb
  ),
  (
    'post-3',
    'bridal-makeup-trends-2025',
    'أبرز صيحات مكياج العرائس لعام 2025: عودة الفخامة الهادئة والنعومة الملكية',
    'وداعاً للتغطية الثقيلة؛ استكشفي صيحة Soft Glam الملكية، درجات النيود الدافئة، والبشرة الزجاجية المشرقة المناسبة للملكة والزفاف.',
    '### ما هي إطلالة العروس الأكثر طلباً هذا الموسم؟
نشهد هذا العام تحولاً كبيراً في ذوق العرائس نحو الفخامة الهادئة (Quiet Luxury) والمكياج الذي يبرز ملامح الوجه الطبيعية دون تغييرها أو طمس تفاصيلها.',
    'trends',
    'صيحات الموضة',
    'أماني خليل',
    'خبيرة تجميل معتمدة دولياً دبلوم CIDESCO',
    '3 دقائق',
    '2025-09-24',
    '/gallery/IMG_5731.webp',
    false,
    true,
    '["صيحات 2025","سوفت غلام","مكياج ملكي","نيود"]'::jsonb
  ),
  (
    'post-4',
    'dry-vs-oily-skin-foundation-guide',
    'دليل اختيار الفاونديشن المثالي: بين البشرة الجافة والدهنية في الخليج',
    'تجنبي المظهر الباهت أو التكتل؛ تعرفي على التركيبة المناسبة لنوع بشرتكِ من أرقى البراندات العالمية.',
    '### اختيار كريم الأساس الصحيح نصف جمال الإطلالة
كثيراً ما تسألني العميلات: لماذا يبدو الفاونديشن رائعاً في الصباح ويتشقق في المساء؟ السبب هو عدم التوافق بين قاعدة الفاونديشن ونوع البشرة.',
    'skincare',
    'العناية والتأسيس',
    'أماني خليل',
    'خبيرة تجميل معتمدة دولياً دبلوم CIDESCO',
    '4 دقائق',
    '2025-09-15',
    '/gallery/IMG_5733.webp',
    false,
    true,
    '["فاونديشن","بشرة دهنية","بشرة جافة","أساسيات المكياج"]'::jsonb
  )
on conflict (id) do nothing;

-- 7. ENABLE REALTIME SUBSCRIPTIONS
do $$
begin
  alter publication supabase_realtime add table public.bookings;
exception when others then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.invoices;
exception when others then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.customers;
exception when others then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.service_packages;
exception when others then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.reviews;
exception when others then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.blog_posts;
exception when others then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.blocked_dates;
exception when others then null;
end $$;
