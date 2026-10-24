-- Story #47: New listings are checked against the syllabus edition
-- Verifies course_code and isbn match an active syllabus book before insert.
-- Sets edition_verified and syllabus_book_id on match, or raises EDITION_MISMATCH.
-- Disallows authenticated users from updating edition_verified or syllabus_book_id.

create or replace function public.check_listing_edition()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_syllabus_book_id bigint;
begin
  select syllabus_book_id
  into v_syllabus_book_id
  from public.syllabus_books
  where course_code = new.course_code
    and isbn = new.isbn
    and is_active = true
  order by syllabus_book_id desc
  limit 1;

  if found then
    new.edition_verified := true;
    new.syllabus_book_id := v_syllabus_book_id;
  else
    raise exception 'EDITION_MISMATCH';
  end if;

  return new;
end;
$$;

drop trigger if exists check_listing_edition on public.listings;
create trigger check_listing_edition
  before insert on public.listings
  for each row execute function public.check_listing_edition();

revoke update on public.listings from authenticated;
grant update (condition, trade_type, price_kwd, notes, status) on public.listings to authenticated;
