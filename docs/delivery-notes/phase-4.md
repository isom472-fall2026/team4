# Phase 4 delivery note

*The Phase Lead for phase 4 writes this note, during phase 4 — not afterwards, and not by
whoever is free at the end.*

**Phase Lead:** Abdullah Alhouli

## What was delivered

At the public address (https://isom472-fall2026.github.io/team4/), a student buyer can now find a book:

- Browse a catalog of every available listing whose edition was verified. Each card shows the approved title, course code, condition, trade type and price.
- Search the catalog by course code, by part of the book's title, or by its ISBN (spaces and hyphens are ignored; an ISBN that is not 10 or 13 digits is refused with a message).
- Filter by department, by trade type (sell, swap, either) and by one or more conditions, and sort by newest or lowest price (swap-only books last, shown as "Swap"). All of these work together, and an empty result says why.
- Open a listing's detail page with the book, edition, condition, price, notes, date and the seller's name. The seller's email and student ID are never shown.
- See a green "Verified for <semester>" badge on every verified listing, on the card and the detail page.
- Open a course page that lists the course's approved textbooks, their list price and how many copies are available.
- When the library retires a textbook, its listings leave the catalog automatically and the seller sees "No longer on the syllabus" on My listings. A student cannot undo this.

Database change this phase, in db/schema.sql and as a separate file run in Supabase by the Data Lead after it was tested: db/changes/73-hide-retired-listings.sql.

## Who did what

| Name | Stories |
|---|---|
| Abdullah Alhouli | #73, #69; Phase Lead; accepted #67; reviewed and merged #133, #135 |
| Salem Alsabah | #63, #64 (built on Hamad's laptop under Salem's own name, because Antigravity failed on Salem's laptop); reviewed and merged #123, #125, #131, #139 |
| Yousef Alfarhan | #71 (in place of Abdullah Alhouli, who took #69), #56 (in place of Hamad, who took #61); reviewed and merged #121, #127, #129 |
| Hamad Behbehani | #58, #61; Data Lead — ran db/changes/73-hide-retired-listings.sql in Supabase; accepted #60; reviewed and merged #137 |
| Abdullah Alrashidi | #60, #67; Client Lead — accepted #63, #71, #56, #58, #64, #73, #61 and #69 |

## Links to the stories

*The full story list at this tag is saved in ../backlog.md — do not repeat it here.*

- #63 — Buyer opens a listing's detail page (PR #121)
- #71 — Course page shows required books and copies available (PR #123)
- #56 — Buyer browses the catalog (PR #125)
- #58 — Buyer searches by course code (PR #127)
- #64 — Verified-edition badge on listings (PR #129)
- #73 — Listings for a retired textbook are hidden (PR #131)
- #61 — Buyer searches by title or ISBN (PR #133)
- #60 — Buyer filters by department (PR #135)
- #67 — Buyer filters by sell/swap and condition (PR #137)
- #69 — Buyer sorts by price or newest (PR #139)

## The tag cut for this phase

`phase-4`

<!-- Created by the Phase Lead — steps in ../how-we-work.md#how-to-create-the-tag. The tag is what gets graded — anything pushed after it does not
     count for this phase. -->

## Anything not finished, and where it went

- All ten Phase 4 stories are merged.
- Carried over from Phase 3 and now done: #42's course-page check (a retired book no longer appears on the course page) is covered by the course page from #71, and "Listings for a retired textbook are hidden" was built as #73.
- Not done and not planned: re-activating a retired textbook does not bring its listings back to the catalog; the seller lists the book again. This was noted in the review of #73 and is not in any story's criteria.
- The request and handoff stories (#45, #46, #48, #49, #51, #52, #74, #75, #76, #77) stay planned for Phase 5, and the moderation and reporting stories for Phase 6, as in ../backlog.md.

## Checklist

- [ ] Every story marked done this phase works at the public address: https://isom472-fall2026.github.io/team4/
- [x] Each story was merged through a pull request with `Closes #n` and an AI-Assisted line.
- [x] The Client Lead accepted each story in its issue before the merge, from his own account; for #60 and #67, which the Client Lead built himself, Hamad and Abdullah Alhouli accepted instead. A written review was approved by a team member who did not build the story, and that reviewer merged it.
- [x] Every Phase 4 story has a missing-value and a wrong-value criterion that names the column and the message the user sees.
- [ ] The board matches the git log: the ten Phase 4 stories are closed and in Done.
- [x] `docs/finops-ledger.md` has a Phase 4 row for each of the ten stories, dated before the tag.
- [ ] `docs/backlog.md` has the Phase 4 table.
- [x] `README.md` has the system's name, the client, links to the proposal, the running system and the board, and a test account for each persona.
- [ ] Tag `phase-4` on `main` after the last merge.

## What went wrong, and what we changed

- Two swaps of stories between members (#71 with #69 on 1 November, #56 with #61 on 5 November) so that the stories everyone was waiting on were built first. The first swap is recorded in #71 and #69; the second was not recorded in #56 and #61 at the time.
- #60 and #67 belong to the Client Lead. Because nobody accepts their own story, Hamad accepted #60 and Abdullah Alhouli accepted #67; this is written in each acceptance comment.
- Commit messages: PR #123 has an extra commit called "71" that only adds blank lines; PR #128 has a commit with GitHub's automatic message; the #61 commit was first named after the branch and was corrected with `git commit --amend` before the pull request; the #67 commit had no team format and was corrected by squash and merge. From #69 on, every commit was made from the terminal with the message written out.
- PR #128 (ledger row for #58) was opened with the empty template, so it had no AI-Assisted line and "Closes #__".
- In PR #127 and PR #129 the AI-Assisted line shows as a heading, because there was no blank line before `---`.
- #64 was not closed by its merge and was closed by hand.
- The ledger row for #67 was written by Salem for the Client Lead's story; Hamad reviewed it, not Salem.
- Usability: the home page "Courses" link opens the students' course page, and the admin's "Courses" (add a course) is reached only through Admin. The two links have the same name.
