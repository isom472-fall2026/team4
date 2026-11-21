# FinOps ledger

What the AI work cost you, and what you changed because of it.

This ledger lives in the repository and is committed. It is never kept in a spreadsheet, a
chat thread, or anywhere else. It is checked as **present and current** — it is not scored
on how accurate the numbers are. An honest rough figure beats a precise invented one.

The FinOps Lead keeps it. Every member supplies their own rows.

## The plan — written in Phase 2

*Which assistant or model you use for which kind of work, and what your limit is. Three or
four lines. Revisit it in Phase 4 and say whether it held.*

| Kind of work | What we use | Why |
|---|---|---|
| Planning: stories, acceptance criteria, schema design, reviewing an approach | a browser AI chat | no repository is loaded, so thinking it through is cheap |
| Building a story with clear acceptance criteria | Antigravity, **Gemini Flash** | edits the files directly; Flash is enough when the story already says exactly what to build |
| Row-level security, triggers, logic across several tables — or Flash failed twice | Antigravity, **Gemini Pro** | a mistake here is a security hole, so the stronger model is worth it |
| One-line fixes, labels, typos | by hand | not worth an agent run |

Our limit: each member's Antigravity quota. We keep each run narrow: one story per run, name the files it may touch, paste the story's acceptance criteria and the schema table it needs, and start a new conversation per story.

What we can see: which model each run used, how many runs a story took, and when we hit a quota message. What we cannot see: exact tokens per run or how much quota is left — so we record runs, not tokens.

If the quota runs out: switch Pro → Flash with a narrower prompt; then a teammate with quota runs it and the story's owner reviews and commits it from their own account; then build it by hand. A story blocked for more than a day goes to the Phase Lead.

## Phase 2

| Story | Assistant used | What it used (tokens, requests, or your own estimate) | What we gave it (files, story, schema) | What we would do differently |
|---|---|---|---|---|
| Phase 2 planning: the 40 stories, the schema, the split and this plan (Salem Alsabah) | Claude, browser chat | about 4 hours over two days; dozens of requests (own estimate) | the proposal, the course deliverables page, the repository's templates | give it the repository templates first — the first drafts used our own layout and had to be redone |

## Phase 3

| Story | Assistant used | What it used (tokens, requests, or your own estimate) | What we gave it (files, story, schema) | What we would do differently |
|---|---|---|---|---|
| #37 Sign up with a university email | Antigravity (Gemini Pro) | 1 conversation, about 3 requests, 22 Oct | the story's criteria, AGENTS.md, docs/schema.md, db/schema.sql | check config.js before pushing — the URL had /rest/v1/ and the keys were not committed at first |  
| #38 Log in and log out | Antigravity (Gemini Flash) | 1 conversation, about 2 requests, 22 Oct | the story's criteria, AGENTS.md, docs/schema.md, js/config.js, js/client.js, js/signup.js | tell it the name of the existing client (window.supabaseClient) so it reuses it instead of making a new one |
| #39 Library staff have an admin account | Antigravity (Gemini Pro) | 1 conversation, about 1 request, 23 Oct | the story's criteria, AGENTS.md, docs/schema.md, db/schema.sql, home.html, js/auth.js, js/home.js, js/client.js | saying "do not reformat existing code" and naming window.supabaseClient kept the change small — 7 lines in home.js |
| #40 Admin adds a course | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 23 Oct | the story's criteria, AGENTS.md, docs/schema.md, db/schema.sql, admin.html, js/admin.js, js/auth.js, js/client.js | Flash was enough because the database already enforced the duplicate and student rules — only a page was needed |
| #41 Admin adds the approved textbook for a course | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 23 Oct | the story's criteria, AGENTS.md, docs/schema.md, db/schema.sql, admin.html, courses.html, js/courses.js, js/auth.js, js/client.js | giving it the exact error codes (23505, 23514) produced a clear message for each refusal |
| #44 Seller lists a used textbook | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 23 Oct | the story's criteria, AGENTS.md, docs/schema.md, db/schema.sql, home.html, js/home.js, textbooks.html, js/textbooks.js, js/auth.js, js/client.js | telling it which columns NOT to send (status, edition_verified, syllabus_book_id) kept the edition check free for #47 |
| #47 New listings are checked against the syllabus edition | Antigravity (Gemini Pro) | 1 conversation, about 1 request, 24 Oct | the story's criteria, AGENTS.md, docs/schema.md, db/schema.sql, db/changes/37-university-email.sql, sell.html, js/sell.js, js/client.js | pointing it to how profiles.role is protected made it lock edition_verified on UPDATE too, not only on INSERT |
| #42 Admin retires a textbook at the end of a semester | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 24 Oct | the story's criteria, AGENTS.md, docs/schema.md, db/schema.sql, db/changes/47-edition-check.sql, textbooks.html, js/textbooks.js, js/auth.js, js/client.js | building #47 first meant criterion 2 already worked — only the Retire button and the active list were needed |
| #50 Seller sees their own listings | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 24 Oct | the story's criteria, AGENTS.md, docs/schema.md, db/schema.sql, home.html, js/home.js, sell.html, js/sell.js, js/auth.js, js/client.js | warning it that RLS also shows the public catalog made it filter by seller_id explicitly; built as a pair with Salem on Salem's laptop |
| #54 Seller edits or withdraws a listing | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 24 Oct | the story's criteria, AGENTS.md, docs/schema.md, db/schema.sql, db/changes/47-edition-check.sql, my-listings.html, js/my-listings.js, js/auth.js, js/client.js | Supabase returns no error when RLS blocks an update, so asking it to check for zero updated rows was what made criterion 3 visible |




## Phase 4

| Story | Assistant used | What it used (tokens, requests, or your own estimate) | What we gave it (files, story, schema) | What we would do differently |
|---|---|---|---|---|
| #63 Buyer opens a listing's detail page | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 1 Nov | the story's criteria, AGENTS.md, docs/schema.md, db/schema.sql, my-listings.html, js/my-listings.js, js/auth.js, js/client.js | naming the profile_names view in the prompt kept the seller's email and student ID off the page |
| #71 Course page shows required books and copies available | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 1 Nov | the story's criteria, AGENTS.md, docs/schema.md, db/schema.sql, home.html, my-listings.html, js/my-listings.js, js/auth.js, js/client.js | giving it the exact count query kept the copies number correct; built by Yousef in place of Abdullah Alhouli (swap with #69) |
| #56 Buyer browses the catalog | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 5 Nov | the story's criteria, AGENTS.md, docs/schema.md, db/schema.sql, home.html, my-listings.html, js/my-listings.js, listing.html, js/listing.js, js/auth.js, js/client.js | asking for two functions, loadCatalog(filters) and renderCatalog(rows), leaves room for the five search and filter stories; built by Yousef in place of Hamad (swap with #61) |
| #58 Buyer searches by course code | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 5 Nov | the story's criteria, AGENTS.md, docs/schema.md, catalog.html, js/catalog.js | telling it to change only loadCatalog and leave renderCatalog alone let #64 be built at the same time without a conflict |
| #64 Verified-edition badge on listings | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 5 Nov | the story's criteria, AGENTS.md, docs/schema.md, catalog.html, js/catalog.js, listing.html, js/listing.js | telling it to change only renderCatalog let it be built alongside #58 with no conflict; built on Hamad's laptop under Salem's own name |
| #73 Listings of a retired textbook are hidden | Antigravity (Gemini Pro) | 1 conversation, about 1 request, 5 Nov | the story's criteria, AGENTS.md, docs/schema.md, db/schema.sql, js/my-listings.js | asking for a trigger on syllabus_books instead of changing the catalog query kept the rule in the database, so students cannot undo it; the change file was tested before the Data Lead ran it in Supabase |
| #61 Buyer searches by title or ISBN | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 7 Nov | the story's criteria, AGENTS.md, docs/schema.md, catalog.html, js/catalog.js | asking for one readFilters() that reads every field let the course code and title searches work together, and leaves one place for the next filters; the commit message was the branch name at first and was corrected with --amend before the pull request |
| #60 Buyer filters by department | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 7 Nov | the story's criteria, AGENTS.md, docs/schema.md, catalog.html, js/catalog.js | adding one field to readFilters() was all the new filter needed, because #61 had put every field in one place; built by the Client Lead, so Hamad accepted it |
| #67 Buyer filters by sell/swap and condition | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 7 Nov | the story's criteria, AGENTS.md, docs/schema.md, catalog.html, js/catalog.js | the filter only needed two fields in readFilters() and two lines in loadCatalog; the commit message was written without the team format and was corrected with squash and merge; built by the Client Lead, so Abdullah Alhouli accepted it |
| #69 Buyer sorts by price or newest | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 7 Nov | the story's criteria, AGENTS.md, docs/schema.md, catalog.html, js/catalog.js | giving it the exact order (price ascending with nulls last, then newest) and the fallback for an unknown ?sort= value kept the swap listings last and the page free of errors |

## Phase 5

| Story | Assistant used | What it used (tokens, requests, or your own estimate) | What we gave it (files, story, schema) | What we would do differently |
|---|---|---|---|---|
| #74 Admin manages campus handoff locations | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 19 Nov | the story's criteria, AGENTS.md, docs/schema.md, courses.html, js/courses.js, admin.html | asking for "each message once, only in #message" avoided the double message the instructor found in Phase 4; built by the Client Lead, so Hamad accepted it |
| #77 Seller sees incoming requests | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 19 Nov | the story's criteria, AGENTS.md, docs/schema.md, db/schema.sql, my-listings.html, js/my-listings.js, home.html | naming the seller filter (listings.seller_id) and the profile_names view in the prompt kept other sellers' requests and buyers' emails off the page; the first commit message was "update story" and was corrected with --amend before the pull request |
| #49 Buyer sees their requests | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 19 Nov | the story's criteria, AGENTS.md, docs/schema.md, db/schema.sql, my-listings.html, js/my-listings.js, home.html | the listings policy already lets a buyer read a listing they requested after it is withdrawn, so "Listing removed" needed no database change; built on Hamad's laptop under Salem's name; the acceptance comment was posted before the test and confirmed after it |
| #75 Buyer requests a book with a time and place | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 19 Nov | the story's criteria, AGENTS.md, docs/schema.md, db/schema.sql, listing.html, js/listing.js | asking for the request section outside #listing-container kept it from being wiped by the page's error states, and leaving status out of the insert let the database set "requested" |
| #76 One open request per buyer per book | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 19 Nov | the story's criteria, AGENTS.md, db/schema.sql, listing.html, js/listing.js | telling it the unique index already existed kept the change to the page only: a check before the insert, and the 23505 error turned into the story's message |
| #45 Seller accepts a request | Claude (the SQL) and Antigravity (Gemini Flash, the page) | Claude: 1 conversation, the change file written and tested on a local copy of the schema; Gemini: 1 conversation, about 1 request, 19 Nov | the story's criteria, docs/schema.md, db/schema.sql, incoming-requests.html, js/incoming-requests.js, the change file | testing the trigger before running it found that a buyer could set their own request to "accepted"; the commit was first recorded under Salem's name because Salem's identity was set globally on Hamad's laptop, and was corrected with --amend --reset-author |
| #46 Seller declines a request | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 21 Nov | the story's criteria, AGENTS.md, incoming-requests.html, js/incoming-requests.js, db/changes/45-request-status-rules.sql | the trigger from #45 already handled responded_at, so the story was one button; Gemini made a commit on its own with its own message, which was corrected with --amend before the push, so next time the prompt says not to run git commands |
| #48 Buyer cancels a request | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 21 Nov | the story's criteria, AGENTS.md, my-requests.html, js/my-requests.js, db/changes/45-request-status-rules.sql | the trigger from #45 returns the listing to available, so the buyer never needs rights on the seller's listing; Gemini again wrote its own commit message, corrected with --amend, and the first push was refused (403) until the GitHub sign-in on the laptop was renewed |
| #51 Seller confirms the handoff is done | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 21 Nov | the story's criteria, AGENTS.md, incoming-requests.html, js/incoming-requests.js, db/changes/45-request-status-rules.sql | the trigger from #45 already stamps completed_at and sets the listing to exchanged, so the story was one button; built on Hamad's laptop under Salem's name; the acceptance test was only partly run, as the acceptance comment says |
| #52 Upcoming handoffs list | Antigravity (Gemini Flash) | 1 conversation, about 1 request, 21 Nov | the story's criteria, AGENTS.md, docs/schema.md, my-requests.html, js/my-requests.js, home.html | filtering the rows to the user's own handoffs on the page kept an admin, who can read every request, from seeing other people's handoffs; built by the Client Lead, so Salem accepted it |

## Phase 6

| Story | Assistant used | What it used (tokens, requests, or your own estimate) | What we gave it (files, story, schema) | What we would do differently |
|---|---|---|---|---|
|  |  |  |  |  |
