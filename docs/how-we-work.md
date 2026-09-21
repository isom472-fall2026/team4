# How we work

Read this once. Come back to it when you are stuck.

Everything your team is graded on is in this repository. Work that is not here did not
happen. That is not a threat — it is how six people can see what the other five did.

New laptop, or week 1? Start with [setup.md](setup.md) first.

## Five words

You will read these words all semester. They mean one thing each.

| Word | What it means |
|---|---|
| **repository** | This folder, plus its whole history. People say "repo". |
| **branch** | A line of work that does not disturb anyone else's. |
| **commit** | A saved point, with your name and a message. |
| **review** | A teammate reads your work and says what they checked. |
| **merge** | Your work becomes part of the real thing. |

Two more you will meet:

| Word | What it means |
|---|---|
| **issue** | One item of work on GitHub. A story or a bug. |
| **pull request** | Your branch, offered for review before it merges. People say "PR". |

## Story numbers

GitHub numbers every issue for you. **The story number is `S-` plus that number.** Issue #14
is story S-14, its branch is `s-14-duplicate-orders`, and its commits end in `[S-14]`.

Do not invent your own numbering. Two people will pick the same one.

## The loop

Every piece of work goes around this loop. Every time. It takes a few minutes once you
have done it twice.

1. **Pick a story** from the board. Assign the issue to yourself, so nobody picks it twice.
2. **Read its acceptance criteria.** If you cannot tell when it is finished, it is not
   ready to build. Ask the Client Lead before you write anything.
3. **Make a branch** named after the story: `s-14-duplicate-orders`.
4. **Build it.** Use your AI assistant as much as you like. You still own what it writes.
5. **Commit as you go**, with the issue number in the message:
   `feat(orders): add duplicate-order check  [S-14]`
6. **Open a pull request.** The template appears by itself. Fill in all of it, including
   the AI-Assisted line.
7. **Ask a teammate to review it.** They open **Files changed → Review changes**, write
   what they ran, read and clicked, and choose **Approve**. That comment is the review.
   Nobody reviews their own work, and nobody writes the review in the description.
8. **Merge it.** The issue closes by itself if you wrote `Closes #14` in the pull request.

If the loop feels slow in week 5, it will feel fast in week 10. Teams that skip it spend
week 10 finding out who broke what.

## Writing a story

A story is one thing a user can do. Not a task list, not a feature area.

```
As a shop supervisor
I want to see orders that look like duplicates
So that I do not ship the same box twice
```

Then the acceptance criteria — how anyone can tell it is done:

- [ ] Orders with the same customer and the same day are flagged.
- [ ] The flag is visible on the order list without opening the order.
- [ ] A flagged order can still be shipped, with one extra click.

**A criterion a teammate cannot check is not a criterion.** "Works well" is not one.
"Loads in under two seconds" is.

Stories live in the **Issues** tab. Use the *User story* template. At the end of each
phase the Client Lead saves a copy of the list into [backlog.md](backlog.md), so the
backlog has a history.

## Working on two sides of the same thing

Two people will build two halves of one feature — one saves an order, the other shows it.
With an AI assistant both halves appear in an afternoon, and if they disagree about the
shape of the data, both halves are wrong.

You already have the two places where that shape is written down. Use them.

**The schema is the agreement.** The table, its columns, which ones cannot be empty — that
is what passes between you. The Data Lead writes it in Supabase and in the repository, and
it changes only in a pull request that both of you read. Nobody changes a column quietly
because their half was easier that way.

**The acceptance criteria are the rest of the agreement.** What the other half is handed,
and what it does when something is missing, belongs in the story before anyone builds.

Ten minutes on those two, before you start, saves a day. It is also the best prompt either
of you can give an assistant: it knows exactly what to produce.

## Publishing your proposal page

Your repository already publishes a page. It is switched on for you — you do not need to
change any setting.

1. Edit `docs/index.html`. Replace every placeholder with your proposal content. Keep the
   eight headings exactly as they are.
2. Merge it to `main` the normal way, through a pull request.
3. Wait about a minute, then open `https://<owner>.github.io/<repository-name>/docs/` and
   check that it loads.
4. Put that link at the top of `README.md`.

The page is checked as **reachable**, not as beautiful. Do not spend time on its design.

If the link still shows "404" ten minutes after your merge, tell your instructor. It is a
setting on the repository, not something you broke.

## Phases

Six phases. Each ends on a Wednesday, with a tag. **The tag is what gets graded** — work
pushed after it does not count for that phase.

### How to create the tag

The Phase Lead does this, once, after the last pull request of the phase is merged.

1. On GitHub: **Releases → Draft a new release**.
2. In "Choose a tag", type `phase-1` (or `phase-2`, and so on) and choose **Create new
   tag**.
3. Target: **main**.
4. **Publish release.**
5. Check it: the **Tags** page lists it. If it is not there, it does not exist.

The tag points at `main` as it was at that moment. Anything merged afterwards is in the
next phase.

### Phase 1 — the proposal
Due Wed 23 Sep. Write `docs/proposal.md` in its eight sections, publish the page, fill in
the team table on the front page, sign [team-agreement.md](team-agreement.md), and make
sure every member has one commit that GitHub shows under their name. Tag `phase-1`.

### Phase 2 — the design sprint
Due Wed 7 Oct. Personas, stories with acceptance criteria, the schema in Supabase with row
level security on, the split of work, and your token plan. First entry in the ledger.
Tag `phase-2`.

### Phases 3, 4 and 5 — the sprints
Due Wed 21 Oct, Wed 4 Nov, Wed 18 Nov. Each one delivers something that works, taken from
the backlog, merged through reviews, with the board matching the repository, the ledger
current, and a tag.

### Phase 6 — the final sprint and the demo
Sprint due Wed 9 Dec, demos Mon 14 and Wed 16 Dec. No new stories are added after that
date. You ship what you have and you demonstrate it. The questions at the demo are asked
of you individually.

Every phase: the Phase Lead writes `docs/delivery-notes/phase-N.md` **during** the phase,
and creates the tag.

## Using AI in this course

You are expected to use it. There is no version of this course where you do not.

Three rules:

1. **Declare it.** Every pull request carries an AI-Assisted line: the tool, what it
   produced, what you changed. `AI-Assisted: none` is equally fine. Leaving the line out
   is what gets penalised.
2. **You own it.** If it is in your pull request, it is yours. At the demo you will be
   asked how your own system works, and "the AI wrote that part" is not an answer.
3. **Read before you merge.** An agent can write more code in a minute than you can read
   in an hour. Merge what you have read.

Ready-made prompts are in [prompts.md](prompts.md).

## When you are stuck

**GitHub refused my push to `main`.**
That is the rule working. Nothing goes to `main` without a pull request and a review. Make
a branch, push that, and open a pull request.

**The AI wrote code and it does not run.**
Do not paste the error back five times. Read the first line of the error — it usually
names the file and the line. Tell the assistant what you expected, what happened, and
that first line.

**My commit shows a grey icon instead of my photo.**
GitHub cannot tell that commit is yours, so it does not count towards your mark. Fix it
now: [setup.md](setup.md), step 3.

**I cannot find my branch.**
You are probably on a different one. In Antigravity, check the branch name shown at the
bottom of the window before you start typing.

**I committed a key or a password.**
Say so immediately, in the team group and to your instructor. Deleting it in the next
commit does **not** remove it from the history. A published key must be replaced, not
hidden. Nobody is in trouble for reporting it fast. (The Supabase `anon` key is public by
design — that one is meant to be committed. See `AGENTS.md`.)

**Two of us edited the same file and it will not merge.**
This is a merge conflict. It is normal. Ask your instructor in the lab — it takes two
minutes with someone next to you, and half an hour alone.

**The board does not match what we actually did.**
Fix the board. Do not explain it away. A board that lies is worth less than no board, and
the two are compared at every phase.

**Nobody reviewed my pull request and the phase ends tomorrow.**
Say so in the team group now, and name the person. Waiting silently is a choice that costs
the whole team.
