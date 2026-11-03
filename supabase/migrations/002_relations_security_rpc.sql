-- 002: relations, admin authorization, atomic booking RPC, safe public reads

-- ---------- ADMIN AUTHORIZATION ----------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admin_users where user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

insert into public.admin_users(user_id)
select id from auth.users where email = 'admin@amanikhalil.sa'
on conflict do nothing;

drop policy if exists "Admins read admin_users" on public.admin_users;
create policy "Admins read admin_users" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));
grant select on public.admin_users to authenticated;

-- ---------- RELATIONS ----------
alter table public.customers drop constraint if exists customers_phone_key;
alter table public.customers add constraint customers_phone_key unique (phone);

alter table public.bookings add column if not exists customer_id text;
update public.bookings b set customer_id = c.id from public.customers c
  where c.phone = b.phone and b.customer_id is null;

alter table public.bookings drop constraint if exists bookings_package_fk;
alter table public.bookings add constraint bookings_package_fk
  foreign key (package_id) references public.service_packages(id) on update cascade on delete restrict;
alter table public.bookings drop constraint if exists bookings_area_fk;
alter table public.bookings add constraint bookings_area_fk
  foreign key (area_id) references public.riyadh_areas(id) on update cascade on delete restrict;
alter table public.bookings drop constraint if exists bookings_customer_fk;
alter table public.bookings add constraint bookings_customer_fk
  foreign key (customer_id) references public.customers(id) on update cascade on delete set null;
alter table public.invoices drop constraint if exists invoices_booking_ref_fk;
alter table public.invoices add constraint invoices_booking_ref_fk
  foreign key (booking_ref) references public.bookings(ref) on update cascade on delete cascade;

alter table public.bookings drop constraint if exists bookings_amounts_chk;
alter table public.bookings add constraint bookings_amounts_chk
  check (total_amount >= 0 and deposit_amount >= 0 and remaining_amount >= 0
         and deposit_amount + remaining_amount = total_amount);
create unique index if not exists uq_bookings_active_slot
  on public.bookings (date, time_slot) where status <> 'CANCELLED';
create index if not exists idx_bookings_package on public.bookings (package_id);
create index if not exists idx_bookings_area on public.bookings (area_id);
create index if not exists idx_bookings_customer on public.bookings (customer_id);
create index if not exists idx_bookings_phone on public.bookings (phone);

-- ---------- RLS: replace "any logged-in user" with real admin check ----------
do $$
declare t text; p record;
begin
  foreach t in array array['service_packages','addons','riyadh_areas','bookings','invoices','customers',
                           'reviews','gallery_looks','blog_posts','faqs','blocked_dates'] loop
    for p in select policyname from pg_policies where schemaname='public' and tablename=t loop
      execute format('drop policy %I on public.%I', p.policyname, t);
    end loop;
    execute format('create policy "Admins manage %1$s" on public.%1$I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- public read-only catalog
create policy "Public read packages" on public.service_packages for select to anon, authenticated using (active or public.is_admin());
create policy "Public read addons" on public.addons for select to anon, authenticated using (true);
create policy "Public read areas" on public.riyadh_areas for select to anon, authenticated using (true);
create policy "Public read gallery" on public.gallery_looks for select to anon, authenticated using (true);
create policy "Public read faqs" on public.faqs for select to anon, authenticated using (true);
create policy "Public read blocked_dates" on public.blocked_dates for select to anon, authenticated using (true);
create policy "Public read published posts" on public.blog_posts for select to anon, authenticated using (published or public.is_admin());
create policy "Public read approved reviews" on public.reviews for select to anon, authenticated using (approved or public.is_admin());
create policy "Public submit reviews" on public.reviews for insert to anon, authenticated with check (approved = true and featured = false and rating between 1 and 5);

-- PII tables: no direct anon access
revoke all on public.bookings, public.invoices, public.customers from anon;
revoke all on public.admin_users from anon;
revoke all on all tables in schema public from anon;
grant select on public.service_packages, public.addons, public.riyadh_areas, public.gallery_looks,
  public.faqs, public.blocked_dates, public.blog_posts, public.reviews to anon;
grant insert on public.reviews to anon;

-- ---------- PUBLIC AVAILABILITY (no PII) ----------
create or replace function public.get_booked_slots()
returns table(date text, time_slot text) language sql stable security definer set search_path = '' as $$
  select b.date, b.time_slot from public.bookings b where b.status <> 'CANCELLED';
$$;
revoke all on function public.get_booked_slots() from public;
grant execute on function public.get_booked_slots() to anon, authenticated;

-- ---------- ATOMIC BOOKING ----------
create or replace function public.create_booking(p jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_phone text := btrim(p->>'phone');
  v_name text := btrim(p->>'client_name');
  v_cust text;
  v_pkg public.service_packages%rowtype;
  v_ref text := p->>'ref';
begin
  if v_name = '' or v_phone = '' or v_ref is null then raise exception 'INVALID_INPUT'; end if;

  select * into v_pkg from public.service_packages where id = p->>'package_id' and active;
  if not found then raise exception 'PACKAGE_UNAVAILABLE'; end if;
  if not exists (select 1 from public.riyadh_areas where id = p->>'area_id') then raise exception 'AREA_INVALID'; end if;
  if exists (select 1 from public.blocked_dates where date = p->>'date') then raise exception 'DATE_BLOCKED'; end if;

  insert into public.customers(id, name, phone, tier, skin_type, undertone, favorite_palette, total_bookings, last_visit, notes)
  values ('c-' || extract(epoch from clock_timestamp())::bigint || '-' || substr(md5(random()::text),1,4),
          v_name, v_phone,
          case when (p->>'total_amount')::int >= 2500 then 'VIP Royal' else 'Diamond' end,
          coalesce(nullif(p->>'skin_type',''), 'مختلطة نضرة'), 'دافئ (Warm Golden)',
          'Dior Backstage & Charlotte Tilbury Pillow Talk', 1, p->>'date',
          coalesce(nullif(p->>'notes',''), 'تم إنشاء ملف العميلة تلقائياً مع الحجز #' || v_ref))
  on conflict (phone) do update set
    total_bookings = public.customers.total_bookings + 1,
    last_visit = excluded.last_visit,
    notes = case when nullif(p->>'notes','') is null then public.customers.notes
                 else public.customers.notes || ' | حجز #' || v_ref || ': ' || (p->>'notes') end
  returning id into v_cust;

  begin
    insert into public.bookings(id, ref, client_name, phone, package_id, package_name, date, time_slot, location_type,
      venue, area_id, total_amount, deposit_amount, remaining_amount, status, addon_ids, notes, customer_id)
    values (p->>'id', v_ref, v_name, v_phone, v_pkg.id, v_pkg.title, p->>'date', p->>'time_slot', p->>'location_type',
      p->>'venue', p->>'area_id', (p->>'total_amount')::int, (p->>'deposit_amount')::int, (p->>'remaining_amount')::int,
      coalesce(p->>'status','PENDING_PAYMENT'), coalesce(p->'addon_ids','[]'::jsonb), nullif(p->>'notes',''), v_cust);
  exception when unique_violation then
    raise exception 'SLOT_TAKEN';
  end;

  insert into public.invoices(id, invoice_number, booking_ref, client_name, package_name, issue_date, total_amount,
    deposit_paid, remaining_balance, payment_method, status)
  values (p->'invoice'->>'id', p->'invoice'->>'invoice_number', v_ref, v_name, v_pkg.title,
    p->'invoice'->>'issue_date', (p->>'total_amount')::int, (p->>'deposit_amount')::int, (p->>'remaining_amount')::int,
    coalesce(p->'invoice'->>'payment_method','Apple Pay'), p->'invoice'->>'status');

  return jsonb_build_object('ref', v_ref, 'customer_id', v_cust);
end $$;
revoke all on function public.create_booking(jsonb) from public;
grant execute on function public.create_booking(jsonb) to anon, authenticated;

-- realtime for admin-only tables stays on; RLS filters events per subscriber

