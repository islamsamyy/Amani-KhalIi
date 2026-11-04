-- 005: Add delete RPCs and permissions for admin dashboard
create or replace function public.admin_delete_booking(p_ref text)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  delete from public.invoices where booking_ref = p_ref;
  delete from public.bookings where ref = p_ref or id = p_ref;
  return jsonb_build_object('ok', true, 'ref', p_ref);
end $$;
grant execute on function public.admin_delete_booking(text) to anon, authenticated;

create or replace function public.admin_delete_invoice(p_id text)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  delete from public.invoices where id = p_id or invoice_number = p_id;
  return jsonb_build_object('ok', true, 'id', p_id);
end $$;
grant execute on function public.admin_delete_invoice(text) to anon, authenticated;

create or replace function public.admin_delete_customer(p_id text)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  delete from public.customers where id = p_id;
  return jsonb_build_object('ok', true, 'id', p_id);
end $$;
grant execute on function public.admin_delete_customer(text) to anon, authenticated;

create or replace function public.admin_delete_gallery_look(p_id text)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  delete from public.gallery_looks where id = p_id;
  return jsonb_build_object('ok', true, 'id', p_id);
end $$;
grant execute on function public.admin_delete_gallery_look(text) to anon, authenticated;

grant delete on public.bookings to anon, authenticated;
grant delete on public.invoices to anon, authenticated;
grant delete on public.customers to anon, authenticated;
grant delete on public.gallery_looks to anon, authenticated;
