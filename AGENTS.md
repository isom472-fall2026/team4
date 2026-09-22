# Instructions for AI assistants working in this repository

Read this before doing anything in this repository. It is written for the AI assistant
(Google Antigravity, or any tool that reads `AGENTS.md`). Students do not need to read it.
It must stay in the repository.

It says the same things as `docs/how-we-work.md`, in the form an assistant needs.

## What this repository is

A student team's capstone project for ISOM 472 at Kuwait University College of Business
Administration. Four to six students, six phases, one repository.

**The repository is the evidence.** Every change is traceable to a named student, a story,
and a review. Preserve that trace in everything you do.

## The stack — do not change it

- Plain HTML, CSS and JavaScript. **No framework, no npm, no build step, no bundler.**
- Supabase for data and logins, loaded from a CDN `<script>` tag.
- The running system lives at the repository root: `/index.html`, `/js/`, `/css/`.
- `docs/` is the proposal site, served by GitHub Pages. **Never edit `docs/index.html`
  while building the system** — it is a different thing that happens to be nearby.

If a task seems to need a framework or a build step, say so and stop. Do not scaffold one.

## Keys and data

- The Supabase **project URL and `anon` key are public**. They belong in `js/config.js`,
  committed to the repository. That is correct and safe.
- The **`service_role` key is never used in this course.** If a task appears to need it,
  the design is wrong — say so and stop.
- Row Level Security is on for every table. Never suggest turning it off to make something
  work.
- Never commit real client data, real names or real phone numbers. Seed data is invented.

## Before writing any code

1. Find the issue this work belongs to. Read its acceptance criteria and build to them,
   not past them.
2. If there is no issue, or the criteria are unclear, **stop and say so.** Do not guess.
3. **Exception:** the proposal, the prototype, personas, the team agreement and delivery
   notes do not need an issue.

## Scope

Do what the story asks and stop. Do not refactor neighbouring code, rename things that
work, add dependencies, or improve files the story did not name. If you see a real problem
outside the story, say it in one sentence and leave it alone — it becomes its own issue.

Prefer the smallest change that satisfies the acceptance criteria.

## What you may and may not do with git

- **You may:** create a branch, edit files, commit.
- **You may not:** push, merge, open a pull request, approve one, create a tag, force push,
  amend a pull request that is already open, or change history.

Those are the student's acts, and the record of who did them is what gets graded.

Commit messages use Conventional Commits with the story number at the end. The story
number is the issue number:

```
feat(orders): add duplicate-order check  [#14]
fix(login): reject an empty password  [#9]
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

One branch per story, named after it: `14-duplicate-orders`.

Never add `Co-authored-by` or any tool trailer to a commit. The AI-Assisted line in the
pull request is the declaration, and it is written by the student.

## Comments

- A comment says **why**, never what. The code already says what.
- Never add a comment that restates the line below it.
- Never add a docstring to an obvious function to look thorough.
- Do add a comment where a reader would reasonably ask "why is it done this way?" — a
  workaround, a client rule, a non-obvious order of operations.
- Never leave commented-out code. Delete it; the history keeps it.
- Never address the student in a code comment ("TODO: you may want to…").

## User stories

When asked to write stories, produce this shape and nothing else:

```
As a <role>
I want <capability>
So that <reason>
```

followed by acceptance criteria as a checklist, each one something a teammate can check by
doing it. No criterion may contain "properly", "correctly", "well" or "user-friendly".

One story is one thing a user can do. If a story needs the word "and" twice, it is two
stories.

You may draft stories. A named student edits and owns them.

## Pull requests

The student opens it. You may draft the description, following
`.github/pull_request_template.md`:

- what changes, in plain language;
- `Closes #<issue number>`;
- the **AI-Assisted** line — the tool, what it produced, what the student changed. If you
  wrote code in this pull request, that line is not optional.

Never write in the reviewer's section. Review is a human act in this course.

## Before you say a task is done

Open the page in a browser, use the feature, and state how each acceptance criterion was
checked. "It should work" is not a check.

## Never

- Never edit `docs/finops-ledger.md`. The team writes that from what they observed.
- Never edit `docs/team-agreement.md`.
- Never push to `main`.
- Never commit `.env`, a `service_role` key, a password, or client personal data.
- Never add a framework, bundler or package the team did not ask for.

## If the client's users read Arabic

Set `lang="ar"` and `dir="rtl"` on the page, and say so in the story. Do not mix an
English layout with Arabic text and hope it reads.

## When you are unsure

Say what you do not know and stop. A question costs a minute. A wrong assumption merged
into `main` costs the team a sprint.
