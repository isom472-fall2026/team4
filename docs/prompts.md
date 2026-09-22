# Prompts

Copy one of these into your AI assistant and fill in the parts in `<angle brackets>`.

They are starting points, not magic. A prompt that names the file, the story and the
acceptance criteria will beat any clever wording.

---

## Signing the team agreement

Done in class, in week 2. Everyone signs `docs/team-agreement.md` **twice**: once by hand,
once through Antigravity. Both signatures are commits from your own account, and the second
one is the proof that Antigravity works on your laptop.

Everything happens on one branch. The Phase 1 Lead makes it first:
`<issue-number>-sign-the-team-agreement`.

### Way 1 — by hand

1. On the branch, open `docs/team-agreement.md`. On github.com use the pencil icon; on your
   laptop use GitHub Desktop and Antigravity's editor.
2. Fill in your own row — name, standing role, hours, how to reach you — and type your name
   in **Signed — by hand**. Touch nobody else's row.
3. Commit it, on the branch, with your own account:
   `docs(agreement): sign for <your name>  [#<issue-number>]`
4. Push. Your name and avatar appear beside the commit. If the avatar is grey, your git
   identity is wrong — fix it with the two lines in `docs/setup.md` and commit again.

### Way 2 — through Antigravity

**Step 1 — the Phase 1 Lead opens the issue.** One issue per team, and it is what the
signing closes:

```
Open a GitHub issue in this repository titled:
Everyone signs the team agreement, and Antigravity works on every laptop

In the body, put a checklist with one line per team member, naming each member, and a
line saying the issue closes when docs/team-agreement.md has both signature columns
filled for every member on the branch <issue-number>-sign-the-team-agreement.

Do not edit any file and do not open a pull request.
```

**Step 2 — each member signs again, with Antigravity.** Run this on your own laptop, in
your own clone. It is the check: if Antigravity cannot do it, say so in class today.

```
In this repository, on the branch <issue-number>-sign-the-team-agreement, open
docs/team-agreement.md.

Find the row whose name is <your name>. Write my GitHub handle <your-handle> and today's
date in the last column, "Signed again — through Antigravity". Change nothing else, and
do not touch any other row.

Then commit that one file with the message:
docs(agreement): confirm Antigravity for <your name>  [#<issue-number>]

Do not push, and do not open a pull request. I will do both myself.
```

Push it yourself, from GitHub Desktop or Antigravity's source-control panel. The commit
carries your name because it was made in your clone under your git identity — that is what
makes it a signature rather than a line of text.

**Step 3 — the Phase 1 Lead checks the table and closes the issue.**

```
Read docs/team-agreement.md on the branch <issue-number>-sign-the-team-agreement, and
read the commits on that branch.

For every member of the team, say whether both signature columns are filled, and whether
each signature was committed by that member's own GitHub account. Name anyone who is
missing either one.

If every member has both, comment on issue #<issue-number> with what you checked, one
line per member, and close the issue. If anyone is missing, comment with who is missing
what and leave the issue open.
```

The pull request is still yours. The Phase 1 Lead opens it; a teammate who did not open it
reviews it and merges. Antigravity does not push, open, approve or merge anything — that
rule is in `AGENTS.md` and it holds today too.

---

## Turn the proposal into stories

```
Read docs/proposal.md in this repository.

Draft user stories for section 4, "What the system does, in outline". One story is one
thing a user can do. Use exactly this shape:

As a <role>
I want <capability>
So that <reason>

Then give acceptance criteria as a checklist. Every criterion must be something a
teammate can check by doing it. Do not use the words "properly", "correctly", "well" or
"user-friendly".

Stop after ten stories. Do not write any code.
```

---

## Build one story

```
Work on story <14>: <title>.

Read the issue's acceptance criteria and the schema before you start.
Build only what the criteria ask for. Do not change files the story did not name.

When you are done, list what you changed and which criterion each change satisfies.
```

---

## Agree the shape before two of you build

```
<Name> and I are building two halves of <the thing>. My half <does X>. Their half
<does Y>.

List exactly what passes between the two halves: the table and columns it lives in,
which ones cannot be empty, and what my half should do when a value is missing.

Write it as acceptance criteria I can paste into the story. Say nothing about how
either half is built, and do not write code.
```

---

## Review a pull request

```
Review the changes in this pull request against story <14> and its acceptance criteria.

For each criterion, say whether the change satisfies it and how you can tell. List
anything that is in the diff but not in the story. Do not rewrite the code.

I will write the review myself — give me the checks, not the verdict.
```

---

## Write the phase delivery note

```
Read docs/delivery-notes/phase-<N>.md and the merged pull requests in this phase.

Draft the note: what works now that did not work before, in plain language, and one line
per team member with the stories they carried. Leave anything you cannot verify from the
repository blank, and tell me what you left blank.
```

---

## When something will not run

```
I expected <what you expected>. Instead I got:

<the first line of the error, and the file and line it names>

Explain what that error means before changing anything. Then suggest the smallest change
that would fix it.
```
