# Set up your laptop

Do this once, in week 1. It takes about twenty minutes. If you skip it, your work will not
be counted as yours — see step 3.

## 1. A GitHub account

Create one at [github.com](https://github.com). Use a username you are happy for an
employer to read.

Add your KU email address to the account: **Settings → Emails → Add email address**, then
confirm the message GitHub sends you. Your instructor invites you to the team repository
using your username.

## 2. Antigravity, and Supabase

- Install **Google Antigravity** on your laptop. This is where you build.
- Create a free **Supabase** account. Section 6 below has the project setup.

Nobody pays for anything in this course. If a tool asks for a card, stop and ask your
instructor.

## 3. Tell git who you are

This is the step people skip, and it is the one that costs marks.

Every commit carries an email address. If that address is not on your GitHub account,
GitHub cannot tell the commit is yours. It shows a grey icon and no name, and your work
does not appear in your record — so it does not count towards your individual mark.

In Antigravity, open the terminal and run these two lines, with your own name and the
email you added in step 1:

```
git config --global user.name "Your Name"
git config --global user.email "you@ku.edu.kw"
```

## 4. Check it worked

1. Clone the team repository in Antigravity.
2. Add your name to the team table in `README.md`.
3. Commit, on a branch, and open a pull request.
4. Open the pull request on GitHub and look at your commit. **Your photo and username must
   appear next to it.** A grey icon means step 3 did not work — fix it before you write
   any code.

Every member does this in Phase 1. The Phase 1 delivery note records that all of you did.

## 5. Your public page

Your repository already publishes a page. **Pages is switched on for you** — there is no
setting for you to find.

- The address is `https://isom472-fall2026.github.io/<your-repo>/docs/`
- It serves the `docs/` folder on the `main` branch
- **It republishes itself about a minute after anything is merged into `main`.** You never
  press publish. Merge the pull request and refresh the page.

To change what it shows, edit `docs/index.html` on a branch, open a pull request, have it
reviewed, and merge. That is the same loop as everything else.

If the page shows "404" ten minutes after a merge, tell your instructor. It is a setting on
the repository, not something you broke.

## 6. Supabase

Your data and your logins live in Supabase. **The team creates one shared account, not one
each.** The Data Lead sets it up.

1. Agree whose email address the account uses. That inbox receives the sign-in codes, so
   everyone depends on that person being reachable — and every member must be able to sign
   in to it.
2. Create the account at [supabase.com](https://supabase.com). It is free, it works in
   Kuwait, and it does not ask for a card.
3. **New project.** Name it after your team. Choose the region closest to Kuwait that the
   free plan offers, and keep the database password where your team can find it — it is
   shown once and never again.
4. **Settings → API.** You need two values: the **Project URL** and the **anon public key**.

### Where the keys go

```js
// js/config.js — committed to the repository, on purpose
const SUPABASE_URL = "https://abcdefgh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOi...";
```

The **anon key is public by design**. It is safe in a public repository, and the app cannot
run without it being in the page.

Two things that are never safe:

- The **`service_role` key** — it ignores every access rule. This course never uses it. If
  something seems to need it, the design is wrong; ask.
- The **database password** — it goes in no file, ever.

### Turn on row level security

Supabase will warn you about this, and the warning is right. **Every table you create has
row level security turned on**, with a policy that says who may read and who may write.
A table without it is readable by anyone who opens your page and looks.

This is taught properly in week 3. Until then: leave the security warnings visible and do
not switch anything off to make something work.

## 7. The board

The Phase 1 Lead creates it once: **Projects → New project → Board**.

Four columns: **Todo**, **In progress**, **In review**, **Done**.

Every open story is a card on the board. "The board matches the repository" means a card
sits in the column that matches the real state of its work: In review means a pull request
is open, Done means it is merged.
