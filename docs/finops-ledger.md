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



## Phase 4

| Story | Assistant used | What it used (tokens, requests, or your own estimate) | What we gave it (files, story, schema) | What we would do differently |
|---|---|---|---|---|
|  |  |  |  |  |

## Phase 5

| Story | Assistant used | What it used (tokens, requests, or your own estimate) | What we gave it (files, story, schema) | What we would do differently |
|---|---|---|---|---|
|  |  |  |  |  |

## Phase 6

| Story | Assistant used | What it used (tokens, requests, or your own estimate) | What we gave it (files, story, schema) | What we would do differently |
|---|---|---|---|---|
|  |  |  |  |  |
