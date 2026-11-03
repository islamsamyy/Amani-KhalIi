-- 003: server-side pricing + public booking confirmation lookup

create or replace function public.create_booking(p jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_phone text := btrim(p->>'phone');
  v_name text := btrim(p->>'client_name');
  v_ref text := p->>'ref';
  v_loc text := p->>'location_type';
  v_status text := coalesce(p->>'status', 'PENDING_PAYMENT');
  v_pkg public.service_packages%rowtype;
  v_area public.riyadh_areas%rowtype;
  v_addon_ids jsonb;
  v_addons_total int;
  v_travel int;
  v_total int;
  v_deposit int;
  v_cust text;
begin
  if coalesce(v_name,'') = '' or coalesce(v_phone,'') = '' or v_ref is null then raise exception 'INVALID_INPUT'; end if;
  if v_status not in ('CONFIRMED','PENDING_PAYMENT') then raise exception 'INVALID_STATUS'; end if;

  select * into v_pkg from public.service_packages where id = p->>'package_id' and active;
  if not found then raise exception 'PACKAGE_UNAVAILABLE'; end if;
  select * into v_area from public.riyadh_areas where id = p->>'area_id';
  if not found then raise exception 'AREA_INVALID'; end if;
  if exists (select 1 from public.blocked_dates where date = p->>'date') then raise exception 'DATE_BLOCKED'; end if;

  -- Only keep addon ids that actually exist (deduplicated); price comes from the DB, never the client.
  select coalesce(jsonb_agg(a.id), '[]'::jsonb), coalesce(sum(a.price), 0)
    into v_addon_ids, v_addons_total
  from public.addons a
  where a.id in (select distinct jsonb_array_elements_text(coalesce(p->'addon_ids','[]'::jsonb)));

  v_travel := case when v_pkg.id = 'vip-bridal' or v_loc = 'STUDIO' then 0 else v_area.travel_fee end;
  v_total := v_pkg.price + v_addons_total + v_travel;
  v_deposit := round(v_total * coalesce(v_pkg.deposit_percentage, 30) / 100.0);

  insert into public.customers(id, name, phone, tier, skin_type, undertone, favorite_palette, total_bookings, last_visit, notes)
  values ('c-' || extract(epoch from clock_timestamp())::bigint || '-' || substr(md5(random()::text),1,4),
          v_name, v_phone,
          case when v_total >= 2500 then 'VIP Royal' else 'Diamond' end,
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
    values (p->>'id', v_ref, v_name, v_phone, v_pkg.id, v_pkg.title, p->>'date', p->>'time_slot', v_loc,
      p->>'venue', v_area.id, v_total, v_deposit, v_total - v_deposit, v_status, v_addon_ids, nullif(p->>'notes',''), v_cust);
  exception when unique_violation then
    raise exception 'SLOT_TAKEN';
  end;

  insert into public.invoices(id, invoice_number, booking_ref, client_name, package_name, issue_date, total_amount,
    deposit_paid, remaining_balance, payment_method, status)
  values (p->'invoice'->>'id', p->'invoice'->>'invoice_number', v_ref, v_name, v_pkg.title,
    p->'invoice'->>'issue_date', v_total, v_deposit, v_total - v_deposit,
    coalesce(p->'invoice'->>'payment_method','Apple Pay'), p->'invoice'->>'status');

  return jsonb_build_object('ref', v_ref, 'customer_id', v_cust, 'total_amount', v_total,
                            'deposit_amount', v_deposit, 'remaining_amount', v_total - v_deposit);
end $$;
revoke all on function public.create_booking(jsonb) from public;
grant execute on function public.create_booking(jsonb) to anon, authenticated;

-- Visitor can re-load their own confirmation by knowing BOTH the ref and the phone number.
create or replace function public.get_booking_confirmation(p_ref text, p_phone text)
returns table(ref text, client_name text, phone text, package_name text, date text, time_slot text,
              venue text, total_amount int, deposit_amount int, remaining_amount int, status text)
language sql stable security definer set search_path = '' as $$
  select b.ref, b.client_name, b.phone, b.package_name, b.date, b.time_slot, b.venue,
         b.total_amount, b.deposit_amount, b.remaining_amount, b.status
  from public.bookings b
  where b.ref = p_ref and b.phone = btrim(p_phone)
  limit 1;
$$;
revoke all on function public.get_booking_confirmation(text, text) from public;
grant execute on function public.get_booking_confirmation(text, text) to anon, authenticated;

