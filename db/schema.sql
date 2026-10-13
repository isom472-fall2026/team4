-- =====================================================================
-- Campus Textbook Exchange System — database schema (Supabase / Postgres)
-- Column names match the acceptance criteria in the story issues. Change both together,
-- and only through a pull request the Data Lead and the story owners read.
--
-- Run once in Supabase: SQL Editor → New query → paste → Run.
-- Keys:  PK = primary key, FK = foreign key (marked in comments).
-- Security: row-level security (RLS) is enabled on EVERY table.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. TABLES
-- ---------------------------------------------------------------------

-- profiles: one row per user, created automatically at sign-up (see section 2)
create table public.profiles (
  id          uuid primary key                                  -- PK, FK → auth.users.id
              references auth.users (id) on delete cascade,
  full_name   text not null,
  student_id  text not null unique,
  email       text not null unique,
  role        text not null default 'student'
              check (role in ('student', 'admin')),
  created_at  timestamptz not null default now()
);

-- courses: maintained by library staff
create table public.courses (
  course_code   text primary key,                               -- PK, e.g. 'ACC 101'
  course_title  text not null,
  department    text not null
);

-- syllabus_books: the approved textbook (edition + ISBN) for each course
create table public.syllabus_books (
  syllabus_book_id  bigint generated always as identity primary key,   -- PK
  course_code       text not null
                    references public.courses (course_code) on update cascade,  -- FK → courses
  isbn              text not null check (isbn ~ '^([0-9]{9}[0-9X]|[0-9]{13})$'),
  title             text not null,
  author            text,
  approved_edition  text not null,
  list_price_kwd    numeric(8,3) check (list_price_kwd >= 0),  -- price of a new copy
  semester          text not null,                               -- e.g. 'Fall 2026'
  is_active         boolean not null default true,
  unique (course_code, isbn, semester)
);

-- listings: a student's used textbook offered for sale or swap
create table public.listings (
  listing_id        bigint generated always as identity primary key,   -- PK
  seller_id         uuid not null
                    references public.profiles (id) on delete cascade, -- FK → profiles
  syllabus_book_id  bigint
                    references public.syllabus_books (syllabus_book_id), -- FK → syllabus_books (set by the edition check)
  course_code       text not null
                    references public.courses (course_code) on update cascade, -- FK → courses
  isbn              text not null,
  condition         text not null check (condition in ('like_new', 'good', 'fair')),
  trade_type        text not null check (trade_type in ('sell', 'swap', 'either')),
  price_kwd         numeric(8,3) check (price_kwd >= 0),
  notes             text,
  status            text not null default 'available'
                    check (status in ('available', 'reserved', 'exchanged', 'removed')),
  edition_verified  boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  -- a price is required unless the book is offered as a swap only
  check (trade_type = 'swap' or price_kwd is not null)
);

-- campus_locations: approved on-campus handoff points
create table public.campus_locations (
  location_id  bigint generated always as identity primary key,  -- PK
  name         text not null,
  building     text,
  is_active    boolean not null default true
);

-- exchange_requests: a buyer's request for a listing, and the handoff that follows
create table public.exchange_requests (
  request_id     bigint generated always as identity primary key,  -- PK
  listing_id     bigint not null
                 references public.listings (listing_id) on delete cascade,   -- FK → listings
  buyer_id       uuid not null
                 references public.profiles (id) on delete cascade,          -- FK → profiles
  location_id    bigint not null
                 references public.campus_locations (location_id),            -- FK → campus_locations
  proposed_time  timestamptz not null,
  message        text,
  status         text not null default 'requested'
                 check (status in ('requested', 'accepted', 'declined', 'cancelled', 'completed')),
  created_at     timestamptz not null default now(),
  responded_at   timestamptz,
  completed_at   timestamptz
);

-- reports: a student flags a listing for the library to check
create table public.reports (
  report_id    bigint generated always as identity primary key,  -- PK
  listing_id   bigint not null
               references public.listings (listing_id) on delete cascade,  -- FK → listings
  reporter_id  uuid not null
               references public.profiles (id) on delete cascade,         -- FK → profiles
  reason       text not null,
  created_at   timestamptz not null default now(),
  resolved_at  timestamptz
);

-- moderation_log: every action library staff take on a listing
create table public.moderation_log (
  log_id      bigint generated always as identity primary key,   -- PK
  listing_id  bigint not null
              references public.listings (listing_id) on delete cascade,  -- FK → listings
  admin_id    uuid not null
              references public.profiles (id),                            -- FK → profiles
  action      text not null check (action in ('removed', 'restored', 'report_resolved')),
  reason      text,
  created_at  timestamptz not null default now()
);


-- One open request per buyer per listing (story: One open request per buyer per book)
create unique index one_open_request_per_buyer
  on public.exchange_requests (listing_id, buyer_id)
  where status in ('requested', 'accepted');

-- One unresolved report per student per listing (story: Student reports a listing)
create unique index one_open_report_per_student
  on public.reports (listing_id, reporter_id)
  where resolved_at is null;

-- Indexes on the columns used most for search and joins
create index on public.listings (course_code);
create index on public.listings (isbn);
create index on public.listings (seller_id);
create index on public.listings (status);
create index on public.syllabus_books (course_code);
create index on public.exchange_requests (listing_id);
create index on public.exchange_requests (buyer_id);
create index on public.reports (listing_id);
create index on public.moderation_log (listing_id);


-- ---------------------------------------------------------------------
-- 2. HELPERS
-- ---------------------------------------------------------------------

-- Create a profiles row whenever someone signs up.
-- The sign-up form must send full_name and student_id as user metadata:
--   supabase.auth.signUp({ email, password,
--     options: { data: { full_name, student_id } } })
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, student_id, email)
  values (new.id,
          new.raw_user_meta_data ->> 'full_name',
          new.raw_user_meta_data ->> 'student_id',
          new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep listings.updated_at current
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger listings_touch_updated_at
  before update on public.listings
  for each row execute function public.touch_updated_at();

-- Is the current user library staff?
-- (security definer so policies can call it without RLS recursion)
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles
                 where id = auth.uid() and role = 'admin');
$$;

-- Does the current user own this listing?
create or replace function public.is_listing_seller(p_listing_id bigint)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.listings
                 where listing_id = p_listing_id and seller_id = auth.uid());
$$;

-- Has the current user requested this listing?
create or replace function public.has_requested(p_listing_id bigint)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.exchange_requests
                 where listing_id = p_listing_id and buyer_id = auth.uid());
$$;

-- Public names only: lets students see a seller's or buyer's full_name
-- without exposing their email or student_id.
create view public.profile_names as
  select id, full_name from public.profiles;

grant select on public.profile_names to authenticated;
revoke all on public.profile_names from anon;


-- ---------------------------------------------------------------------
-- 3. ROW-LEVEL SECURITY — enabled on every table
-- ---------------------------------------------------------------------

alter table public.profiles          enable row level security;
alter table public.courses           enable row level security;
alter table public.syllabus_books    enable row level security;
alter table public.listings          enable row level security;
alter table public.campus_locations  enable row level security;
alter table public.exchange_requests enable row level security;
alter table public.reports           enable row level security;
alter table public.moderation_log    enable row level security;

-- No policy is written for the anon role, so visitors who are not
-- logged in can read or change nothing.

-- profiles ------------------------------------------------------------
create policy "profiles: read own row, admin reads all"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "profiles: update own row"
  on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Students may change only their name and student ID — never their role
-- (story: Library staff have an admin account).
revoke update on public.profiles from authenticated;
grant update (full_name, student_id) on public.profiles to authenticated;

-- courses, syllabus_books, campus_locations: everyone reads, admin writes
create policy "courses: logged-in users read"
  on public.courses for select to authenticated using (true);
create policy "courses: admin writes"
  on public.courses for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "syllabus_books: logged-in users read"
  on public.syllabus_books for select to authenticated using (true);
create policy "syllabus_books: admin writes"
  on public.syllabus_books for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "campus_locations: logged-in users read"
  on public.campus_locations for select to authenticated using (true);
create policy "campus_locations: admin writes"
  on public.campus_locations for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- listings ------------------------------------------------------------
create policy "listings: read catalog, own, requested, or admin"
  on public.listings for select to authenticated
  using (
       (status = 'available' and edition_verified)   -- the public catalog
    or seller_id = auth.uid()                         -- my listings
    or public.has_requested(listing_id)               -- books I asked for
    or public.is_admin()
  );

create policy "listings: students create their own"
  on public.listings for insert to authenticated
  with check (seller_id = auth.uid() and status = 'available');

create policy "listings: seller or admin updates"
  on public.listings for update to authenticated
  using (seller_id = auth.uid() or public.is_admin())
  with check (seller_id = auth.uid() or public.is_admin());

-- exchange_requests ---------------------------------------------------
create policy "requests: buyer, seller of the book, or admin reads"
  on public.exchange_requests for select to authenticated
  using (buyer_id = auth.uid()
         or public.is_listing_seller(listing_id)
         or public.is_admin());

create policy "requests: buyer creates, not on own book"
  on public.exchange_requests for insert to authenticated
  with check (buyer_id = auth.uid()
              and status = 'requested'
              and not public.is_listing_seller(listing_id));

create policy "requests: buyer or seller updates"
  on public.exchange_requests for update to authenticated
  using (buyer_id = auth.uid() or public.is_listing_seller(listing_id) or public.is_admin())
  with check (buyer_id = auth.uid() or public.is_listing_seller(listing_id) or public.is_admin());

-- reports -------------------------------------------------------------
create policy "reports: reporter or admin reads"
  on public.reports for select to authenticated
  using (reporter_id = auth.uid() or public.is_admin());

create policy "reports: students file their own"
  on public.reports for insert to authenticated
  with check (reporter_id = auth.uid());

create policy "reports: admin resolves"
  on public.reports for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- moderation_log ------------------------------------------------------
create policy "moderation_log: admin reads all, seller reads own listings"
  on public.moderation_log for select to authenticated
  using (public.is_admin() or public.is_listing_seller(listing_id));

create policy "moderation_log: admin writes as themselves"
  on public.moderation_log for insert to authenticated
  with check (public.is_admin() and admin_id = auth.uid());


-- ---------------------------------------------------------------------
-- 4. MAKING THE FIRST ADMIN
-- After Eng. Mohammed's account (or a test account) signs up, run:
--   update public.profiles set role = 'admin' where email = '<her email>';
-- (The SQL editor runs as the database owner, so RLS does not block it.)
-- ---------------------------------------------------------------------
