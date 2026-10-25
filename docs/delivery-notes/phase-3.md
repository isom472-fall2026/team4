# Phase 3 delivery note

*The Phase Lead for phase 3 writes this note, during phase 3 — not afterwards, and not by
whoever is free at the end.*

**Phase Lead:** Salem Alsabah

## What was delivered

At the public address (https://isom472-fall2026.github.io/team4/):

- A student can sign up with a Kuwait University email (ku.edu.kw or a college subdomain such as cba.ku.edu.kw). Other emails, a repeated email and a repeated student ID are refused, by the page and by the database.
- A student can log in and log out. Pages that need a login send a signed-out visitor to the login page.
- Library staff have an admin account. Only an admin sees the Admin menu and the admin pages; a student who opens them is refused, and a student cannot make themselves an admin.
- An admin can add a course, and add the approved textbook (ISBN, edition, semester, list price) for a course. Wrong ISBNs and duplicates are refused.
- An admin can retire a textbook at the end of a semester; it disappears from the active list.
- A student can list a used textbook for sale or swap. Every new listing is checked against the course's approved, active edition: a match is published, anything else is refused and the student is shown the approved title and edition. A student cannot mark a listing as verified themselves.
- A student can see all of their own listings with their status, edit the price, condition and notes, or withdraw a listing so it leaves the catalog. Other students' listings never appear there and cannot be changed.

Database changes this phase, each in db/schema.sql and as a separate file run in Supabase by the Data Lead: db/changes/37-university-email.sql and db/changes/47-edition-check.sql.

## Who did what

| Name | Stories |
|---|---|
| Salem Alsabah | #37 and #38 (story owner; built in pairs on Yousef's and Abdullah Alrashidi's laptops because of a problem with Salem's laptop), #50 (pair with Yousef, on Salem's laptop); Phase Lead |
| Abdullah Alrashidi | #39, #40; pair on #38; Client Lead — accepted the stories |
| Abdullah Alhouli | #41 (pair with Hamad, on Hamad's laptop), #42 |
| Hamad Behbehani | #44, #47 (the edition-check trigger); pair on #41; Data Lead — ran the database changes in Supabase |
| Yousef Alfarhan | #50 (story owner), #54; pair on #37 |

## Links to the stories

*The full story list at this tag is saved in ../backlog.md — do not repeat it here.*

- #37 — Sign up with a university email (PR #88, #89)
- #38 — Log in and log out (PR #92)
- #39 — Library staff have an admin account (PR #94)
- #40 — Admin adds a course (PR #96)
- #41 — Admin adds the approved textbook for a course (PR #98)
- #42 — Admin retires a textbook at the end of a semester (PR #104)
- #44 — Seller lists a used textbook (PR #100)
- #47 — New listings are checked against the syllabus edition (PR #102)
- #50 — Seller sees their own listings (PR #106)
- #54 — Seller edits or withdraws a listing (PR #108)

## The tag cut for this phase

`phase-3`

<!-- Created by the Phase Lead — steps in ../how-we-work.md#how-to-create-the-tag. The tag is what gets graded — anything pushed after it does not
     count for this phase. -->

## Anything not finished, and where it went

- All ten Phase 3 stories are merged.
- #42, criterion 3 was changed by the Client Lead before it was built: there is no course page in Phase 3, so "the retired book no longer appears on the course page" became "no longer appears in the admin Textbooks list". The course-page check moves to the phase that builds the course page.
- The listings of a retired textbook that were already published are not hidden yet; that is the story "Listings for a retired textbook are hidden" (see docs/schema.md), planned for a later phase.

## Checklist

- [x] Every story marked done this phase works at the public address: https://isom472-fall2026.github.io/team4/
- [x] Each story was merged through a pull request with `Closes #n` and an AI-Assisted line.
- [x] The Client Lead ticked each story's criteria before the merge, and a written review was approved by a team member who did not build the story; that reviewer merged it (exception: PR #88, see "What went wrong").
- [x] Every Phase 3 story has a missing-value or wrong-value criterion that names the column and the message the user sees.
- [x] The board matches the git log: the ten Phase 3 stories are closed and in Done.
- [x] `docs/finops-ledger.md` has a Phase 3 row for each of the ten stories, dated before the tag.
- [x] `docs/backlog.md` has the Phase 3 table, saved 25 October.
- [x] `README.md` has the system's name, the client, and links to the proposal, the running system and the board.
- [ ] Tag `phase-3` on `main` after the last merge.

## What went wrong, and what we changed

- PR #88 (#37) was merged before acceptance and review, by a team member who had helped write it. The cycle was completed in PR #89 (Supabase URL fix), which was accepted and reviewed before it was merged. From #39 on, every story was accepted by the Client Lead and reviewed by a third person before merging.
- Two commits in #37 ("feat: add Supabase configuration file with project credentials") do not end with [#37].
- The commit for the #38 ledger row was written with the pull-request text instead of "docs(ledger): ... [#38]".
- The ledger rows for #39 and #44 were written by Yousef and Salem from the owners' numbers. From #40 on, each owner wrote their own row.
- Early commits on shared laptops showed another person's name (or a student number). Every member now sets git user.name and user.email before building.
