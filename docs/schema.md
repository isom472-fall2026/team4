# Schema — Campus Textbook Exchange System

The runnable version is [`schema.sql`](schema.sql). Column names match the acceptance criteria in the story issues. **Owner: Hamad Behbehani (Data Lead).** It changes only through a pull request that the Data Lead and the affected story owners read.
**PK** = primary key · **FK** = foreign key · Row-level security is **on for every table**.

```mermaid
erDiagram
    profiles ||--o{ listings : "sells (seller_id)"
    profiles ||--o{ exchange_requests : "requests (buyer_id)"
    profiles ||--o{ reports : "files (reporter_id)"
    profiles ||--o{ moderation_log : "acts (admin_id)"
    courses ||--o{ syllabus_books : "requires"
    courses ||--o{ listings : "listed under"
    syllabus_books ||--o{ listings : "verified against"
    listings ||--o{ exchange_requests : "requested in"
    listings ||--o{ reports : "reported in"
    listings ||--o{ moderation_log : "moderated in"
    campus_locations ||--o{ exchange_requests : "handoff at"

    profiles {
        uuid id PK "FK to auth.users"
        text full_name
        text student_id UK
        text email UK
        text role "student or admin"
        timestamptz created_at
    }
    courses {
        text course_code PK
        text course_title
        text department
    }
    syllabus_books {
        bigint syllabus_book_id PK
        text course_code FK
        text isbn
        text title
        text author
        text approved_edition
        numeric list_price_kwd
        text semester
        boolean is_active
    }
    listings {
        bigint listing_id PK
        uuid seller_id FK
        bigint syllabus_book_id FK
        text course_code FK
        text isbn
        text condition
        text trade_type
        numeric price_kwd
        text notes
        text status
        boolean edition_verified
        timestamptz created_at
        timestamptz updated_at
    }
    campus_locations {
        bigint location_id PK
        text name
        text building
        boolean is_active
    }
    exchange_requests {
        bigint request_id PK
        bigint listing_id FK
        uuid buyer_id FK
        bigint location_id FK
        timestamptz proposed_time
        text message
        text status
        timestamptz created_at
        timestamptz responded_at
        timestamptz completed_at
    }
    reports {
        bigint report_id PK
        bigint listing_id FK
        uuid reporter_id FK
        text reason
        timestamptz created_at
        timestamptz resolved_at
    }
    moderation_log {
        bigint log_id PK
        bigint listing_id FK
        uuid admin_id FK
        text action
        text reason
        timestamptz created_at
    }
```

## Row-level security, table by table

| Table | Who can read | Who can write |
|---|---|---|
| `profiles` | Own row; admin reads all. Other students see only `full_name`, through the `profile_names` view | Own row, and only `full_name` and `student_id` (a student cannot change `role`) |
| `courses` | Any logged-in user | Admin only |
| `syllabus_books` | Any logged-in user | Admin only |
| `campus_locations` | Any logged-in user | Admin only |
| `listings` | Catalog (`status = 'available'` and `edition_verified`), own listings, listings I requested, admin | Insert: own listings only. Update: seller of the listing, or admin |
| `exchange_requests` | The buyer, the seller of the book, admin | Insert: buyer, never on own book. Update: buyer, seller, admin |
| `reports` | The reporter, admin | Insert: any student, as themselves. Update: admin |
| `moderation_log` | Admin; a seller sees rows for their own listings | Admin only, as themselves |

Visitors who are not logged in (`anon`) can read and change nothing.

## Rules built into the schema

- A price is required unless `trade_type = 'swap'`.
- `condition`, `trade_type`, `status`, `role` and `action` accept only the listed values.
- ISBN in `syllabus_books` must be 10 or 13 digits.
- One open request per buyer per listing, and one unresolved report per student per listing.
- A `profiles` row is created automatically when someone signs up.

## Rules each story will add when it is built

The schema gives the tables and permissions. The following logic belongs to the stories and is written by whoever holds them:

| Story | Logic to add |
|---|---|
| Sign up with a university email | Refuse emails outside the university domain |
| New listings are checked against the syllabus edition | Trigger that sets `edition_verified` and `syllabus_book_id`, or rejects the listing |
| Listings for a retired textbook are hidden | When `syllabus_books.is_active` becomes false, set `edition_verified = false` on its available listings |
| Seller accepts a request · Buyer cancels a request · Seller confirms the handoff is done | Keep `listings.status` in step with `exchange_requests.status` (a buyer cancelling an accepted request needs a function, because the buyer cannot update the seller's listing directly) |
| Admin removes a listing with a reason | Cancel open requests when a listing is removed |
