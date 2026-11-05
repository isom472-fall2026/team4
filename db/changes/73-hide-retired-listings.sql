-- Story #73: Listings for a retired textbook are hidden
-- When a syllabus_books row becomes is_active = false, every available
-- listings row with that syllabus_book_id gets edition_verified = false.

create or replace function public.hide_listings_of_retired_book()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  update public.listings
  set edition_verified = false
  where syllabus_book_id = new.syllabus_book_id
    and status = 'available';

  return new;
end;
$$;

drop trigger if exists hide_listings_of_retired_book on public.syllabus_books;
create trigger hide_listings_of_retired_book
  after update of is_active on public.syllabus_books
  for each row
  when (old.is_active = true and new.is_active = false)
  execute function public.hide_listings_of_retired_book();
