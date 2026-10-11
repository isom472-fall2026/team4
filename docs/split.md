# The split — who builds which story

**Phase 2 Lead:** Yousef Alfarhan. Each member holds **2 stories per sprint, 8 in total**. Each story's owner is also written in its issue (*Who is building this*) — assign the issue to them too.

Story names below are the issue titles. Once the issues exist, add their numbers.

## Areas

| Member | Role | Area they own |
|---|---|---|
| **Salem Alsabah** | FinOps + Quality Lead | Accounts and sign-in; the listing detail page; requests list and confirming handoffs; statistics |
| **Abdullah Alrashidi** | Client Lead | Admin data (courses, campus locations); catalog filters; upcoming handoffs; moderation dashboard and removals |
| **Abdullah Alhouli** | Build Lead | Approved textbooks and retiring them; the course page; declining and cancelling requests; student reports |
| **Hamad Behbehani** | Data Lead | Listing a book and the edition check; the catalog; incoming and accepted requests; restoring and resolving |
| **Yousef Alfarhan** | Design Lead · Phase 2 Lead | The seller's own listings; search and sort; the request form; the moderation log |

## Stories by phase

### Phase 3 — sprint 1

| Member | Stories |
|---|---|
| Salem Alsabah | Sign up with a university email · Log in and log out |
| Abdullah Alrashidi | Library staff have an admin account · Admin adds a course |
| Abdullah Alhouli | Admin adds the approved textbook for a course · Admin retires a textbook at the end of a semester |
| Hamad Behbehani | Seller lists a used textbook · New listings are checked against the syllabus edition |
| Yousef Alfarhan | Seller sees their own listings · Seller edits or withdraws a listing |

### Phase 4 — sprint 2

| Member | Stories |
|---|---|
| Salem Alsabah | Buyer opens a listing's detail page · Verified-edition badge on listings |
| Abdullah Alrashidi | Buyer filters by department · Buyer filters by sell/swap and condition |
| Abdullah Alhouli | Course page shows required books and copies available · Listings for a retired textbook are hidden |
| Hamad Behbehani | Buyer browses the catalog · Buyer searches by course code |
| Yousef Alfarhan | Buyer searches by title or ISBN · Buyer sorts by price or newest |

### Phase 5 — sprint 3

| Member | Stories |
|---|---|
| Salem Alsabah | Buyer sees their requests · Seller confirms the handoff is done |
| Abdullah Alrashidi | Admin manages campus handoff locations · Upcoming handoffs list |
| Abdullah Alhouli | Seller declines a request · Buyer cancels a request |
| Hamad Behbehani | Seller sees incoming requests · Seller accepts a request |
| Yousef Alfarhan | Buyer requests a book with a time and place · One open request per buyer per book |

### Phase 6 — final sprint

| Member | Stories |
|---|---|
| Salem Alsabah | Admin sees exchange activity numbers · Admin sees estimated student savings |
| Abdullah Alrashidi | Admin moderation dashboard · Admin removes a listing with a reason |
| Abdullah Alhouli | Student reports a listing · Admin sees open reports first |
| Hamad Behbehani | Admin restores a removed listing · Admin resolves a report |
| Yousef Alfarhan | Admin sees the moderation log · Seller sees why a listing was removed |

## Handoffs between members

Where one member's work feeds another's. The full detail is in each issue's *Tables it reads or writes* field.

| From | Story | To | What is handed over |
|---|---|---|---|
| Salem Alsabah | Sign up with a university email | Everyone | `profiles.id` — becomes `seller_id`, `buyer_id`, `reporter_id`, `admin_id` |
| Abdullah Alrashidi | Library staff have an admin account | Everyone building admin pages | `profiles.role = 'admin'` and the `is_admin()` check |
| Abdullah Alrashidi | Admin adds a course | Abdullah Alhouli, Hamad Behbehani | `courses.course_code` |
| Abdullah Alhouli | Admin adds the approved textbook for a course | Hamad Behbehani | `syllabus_books.isbn`, `course_code`, `is_active` for the edition check |
| Hamad Behbehani | Seller lists a used textbook / edition check | Yousef Alfarhan; Hamad Behbehani (catalog) | `listings` rows with `seller_id`, `status = 'available'`, `edition_verified`, `syllabus_book_id` |
| Abdullah Alhouli | Retire a textbook → hide its listings | Hamad Behbehani | `syllabus_books.is_active = false` sets `listings.edition_verified = false`, so the catalog hides it |
| Abdullah Alhouli | Admin adds the approved textbook for a course | Salem Alsabah | `syllabus_books.list_price_kwd` for the savings figure |
| Abdullah Alrashidi | Admin manages campus handoff locations | Yousef Alfarhan | `campus_locations.location_id` where `is_active = true` |
| Yousef Alfarhan | Buyer requests a book with a time and place | Hamad Behbehani, Abdullah Alhouli, Salem Alsabah | `exchange_requests` rows with `status = 'requested'` |
| Hamad Behbehani | Seller accepts a request | Salem Alsabah, Abdullah Alrashidi | `exchange_requests.status = 'accepted'`, `listings.status = 'reserved'` |
| Salem Alsabah | Seller confirms the handoff is done | Salem Alsabah | `status = 'completed'`, `completed_at`; `listings.status = 'exchanged'` for the statistics |
| Abdullah Alhouli | Student reports a listing | Abdullah Alhouli, Hamad Behbehani | `reports` rows with `resolved_at` empty |
| Abdullah Alrashidi | Admin removes a listing with a reason | Hamad Behbehani, Yousef Alfarhan | `moderation_log` row with `action = 'removed'` and `reason`; `listings.status = 'removed'` |

## Load check

| Member | Phase 3 | Phase 4 | Phase 5 | Phase 6 | Total |
|---|:-:|:-:|:-:|:-:|:-:|
| Salem Alsabah | 2 | 2 | 2 | 2 | 8 |
| Abdullah Alrashidi | 2 | 2 | 2 | 2 | 8 |
| Abdullah Alhouli | 2 | 2 | 2 | 2 | 8 |
| Hamad Behbehani | 2 | 2 | 2 | 2 | 8 |
| Yousef Alfarhan | 2 | 2 | 2 | 2 | 8 |
| **Team** | 10 | 10 | 10 | 10 | **40** |
