# Phase 5 delivery note

*The Phase Lead for phase 5 writes this note, during phase 5 — not afterwards, and not by
whoever is free at the end.*

**Phase Lead:** Abdullah Alrashidi

## What was delivered

At the public address (https://isom472-fall2026.github.io/team4/), a buyer and a seller can now agree on a handoff on campus:

- The library admin keeps a list of campus handoff locations, and can add a location or make one inactive.
- From a listing's detail page, a buyer requests the book and chooses a time and one of the active campus locations. A buyer can have only one open request for the same listing; a second one is refused with a message.
- The buyer sees all of their requests on "My requests", with the book, the time, the place and the status. If the seller withdraws the listing, the request shows "Listing removed".
- The seller sees the requests on their own listings on "Incoming requests", with the buyer's name only (no email or student ID).
- The seller can accept or decline a request. Accepting reserves the listing and declines the other pending requests for the same listing.
- The buyer can cancel a request that is still requested or accepted. Cancelling an accepted request makes the listing available again.
- After the handoff, the seller marks the request as done. The request becomes completed and the listing becomes exchanged.
- Buyer and seller both see an "Upcoming handoffs" list of their accepted requests whose time has not passed yet.
- The database itself allows only these status changes, and only by the right person; anything else is refused, even if someone skips the page.
- Each error message now appears once on the listing and course pages (bug #162, from the instructor's Phase 4 feedback).

Database change this phase, in db/schema.sql and as a separate file run in Supabase by the Data Lead after it was tested: db/changes/45-request-status-rules.sql.

## Who did what

| Name | Stories |
|---|---|
| Abdullah Alrashidi | #74, #52; Phase Lead; Client Lead — accepted #77, #49, #75, #76, #45, #46, #48 and #51; README update (PR #166) |
| Hamad Behbehani | #77, #45; Data Lead — ran db/changes/45-request-status-rules.sql in Supabase and cleaned the test data before the README update; accepted #74; reviewed and merged #150, #156, #163 |
| Salem Alsabah | #49, #51 (both built on Hamad's laptop under Salem's own name, because Antigravity fails on Salem's laptop); accepted #52; reviewed and merged #144, #152, #154, #158 |
| Abdullah Alhouli | #46, #48; reviewed and merged #146, #148, #165 |
| Yousef Alfarhan | #75, #76; fixed bug #162; reviewed and merged #160, #166 |

## Links to the stories

*The full story list at this tag is saved in ../backlog.md — do not repeat it here.*

- #74 — Admin manages campus handoff locations (PR #144)
- #77 — Seller sees incoming requests (PR #146)
- #49 — Buyer sees their requests (PR #148)
- #75 — Buyer requests a book with a time and place (PR #150)
- #76 — One open request per buyer per book (PR #152)
- #45 — Seller accepts a request (PR #154)
- #46 — Seller declines a request (PR #156)
- #48 — Buyer cancels a request (PR #158)
- #51 — Seller confirms the handoff is done (PR #160)
- #52 — Upcoming handoffs list (PR #163)
- #162 — Bug: error message shown twice (PR #165)

## The tag cut for this phase

`phase-5`

<!-- Created by the Phase Lead — steps in ../how-we-work.md#how-to-create-the-tag. The tag is what gets graded — anything pushed after it does not
     count for this phase. -->

## Anything not finished, and where it went

- All ten Phase 5 stories are merged, each with its ledger row.
- Not done and not planned: a location the admin made inactive cannot be added again under the same name (#74); the page offers only active locations, but the database does not refuse a request for an inactive one (#75). Neither is in a story's criteria.
- Not done: the two links named "Courses" (the students' course page and the admin's add-a-course page), from the instructor's Phase 4 feedback, were not renamed this phase.
- The moderation and reporting stories stay planned for Phase 6, as in ../backlog.md.

## Checklist

- [ ] Every story marked done this phase works at the public address: https://isom472-fall2026.github.io/team4/
- [x] Each story was merged through a pull request with `Closes #n` and an AI-Assisted line.
- [x] The Client Lead accepted each story in its issue before the merge, from his own account; for #74 and #52, which the Client Lead built himself, Hamad and Salem accepted instead. A written review was approved by a team member who did not build the story, and that reviewer merged it.
- [x] `docs/finops-ledger.md` has a Phase 5 row for each of the ten stories, dated before the tag.
- [ ] `docs/backlog.md` has the Phase 5 table.
- [x] `README.md` shows Phase 5 as next due, and the test-account data matches what is in Supabase (PR #166).
- [ ] The board matches the git log: the ten Phase 5 stories are closed and in Done.
- [ ] Tag `phase-5` on `main` after the last merge.

## What went wrong, and what we changed

- **No story was sent back.** The instructor asked in Phase 4 that the Client Lead send back at least one story with a failing criterion. In Phase 5 the Client Lead accepted all eight stories he tested without sending any back.
- **Acceptance before or without a full test.** On #49 the acceptance comment was posted before the test and confirmed in a second comment after it. On #51 the Client Lead ran only part of the acceptance test because of time, but the acceptance comment does not say so. Several acceptances were posted a few minutes after the story was ready.
- **Commit messages outside the team format, now in main:** #143 ("Update sprint 3 date in README", made in the GitHub web editor), and the ledger-row pull requests #145, #147, #149, #151, #153, #155, #157 and #161, which were committed with the editor's button or the web editor. #163 was squashed with the title "eat(requests): upcoming handoffs list" instead of "feat(…)", and the review says it was corrected when it was not.
- **Commit messages corrected before the push** with `git commit --amend`: #77 (first named "update story"), #46 (Gemini made the commit by itself with its own message) and #48 (Gemini again wrote its own message). After #46, every Gemini prompt says "Do not run any git command and do not commit".
- **Wrong author on #45.** Hamad's laptop has Salem's name and email set as the global git identity. The #45 commit was first recorded under Salem and was corrected with `--amend --reset-author`. Salem now sets his own identity in the repository when he builds on that laptop and sets Hamad's back afterwards. Where the global setting came from is not known yet.
- **Push refused (403) on #48** until the GitHub sign-in saved on Abdullah Alhouli's laptop was renewed.
- **Pull-request descriptions left as the empty template:** #143 and #155 were completed after the merge; #144 was completed before it.
- **Test data.** Before the README update, the test rows in Supabase (QA and HACK courses, listings and requests made while testing) were deleted, and the three demo profiles were given their persona names, so the README now describes the real data.
