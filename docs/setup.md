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
- Create a free **Supabase** account. The Data Lead creates one project for the whole
  team and invites the others.

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

## 5. The board

The Phase 1 Lead creates it once: **Projects → New project → Board**.

Four columns: **Todo**, **In progress**, **In review**, **Done**.

Every open story is a card on the board. "The board matches the repository" means a card
sits in the column that matches the real state of its work: In review means a pull request
is open, Done means it is merged.
