-- Story #45 (with #46, #48, #51): who may change a request's status, and keeping the listing in step.
-- Run once in Supabase (SQL Editor) by the Data Lead, after it was tested. Safe to run twice.

-- 1. BEFORE UPDATE: only allowed status changes, by the right person; stamps the times.
create or replace function public.check_request_status_change()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  is_buyer  boolean := (old.buyer_id = auth.uid());
  is_seller boolean := public.is_listing_seller(old.listing_id);
begin
  if new.listing_id <> old.listing_id or new.buyer_id <> old.buyer_id then
    raise exception 'REQUEST_FIELDS_LOCKED: the listing and the buyer of a request cannot change';
  end if;

  if new.status = old.status then
    return new;
  end if;

  if not (
       public.is_admin()
    or (is_seller and old.status = 'requested' and new.status in ('accepted', 'declined'))
    or (is_seller and old.status = 'accepted'  and new.status = 'completed')
    or (is_buyer  and old.status in ('requested', 'accepted') and new.status = 'cancelled')
  ) then
    raise exception 'REQUEST_STATUS_NOT_ALLOWED: % -> %', old.status, new.status;
  end if;

  if new.status in ('accepted', 'declined') then
    new.responded_at := now();
  elsif new.status = 'completed' then
    new.completed_at := now();
  end if;

  return new;
end;
$$;

drop trigger if exists check_request_status_change on public.exchange_requests;
create trigger check_request_status_change
  before update on public.exchange_requests
  for each row
  execute function public.check_request_status_change();

-- 2. AFTER UPDATE: keep listings.status in step with the request.
create or replace function public.sync_listing_with_request()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if new.status = old.status then
    return null;
  end if;

  if new.status = 'accepted' then
    update public.listings set status = 'reserved'
      where listing_id = new.listing_id and status = 'available';
    update public.exchange_requests set status = 'declined'
      where listing_id = new.listing_id and request_id <> new.request_id and status = 'requested';
  elsif new.status = 'cancelled' and old.status = 'accepted' then
    update public.listings set status = 'available'
      where listing_id = new.listing_id and status = 'reserved';
  elsif new.status = 'completed' then
    update public.listings set status = 'exchanged'
      where listing_id = new.listing_id;
  end if;

  return null;
end;
$$;

drop trigger if exists sync_listing_with_request on public.exchange_requests;
create trigger sync_listing_with_request
  after update of status on public.exchange_requests
  for each row
  execute function public.sync_listing_with_request();