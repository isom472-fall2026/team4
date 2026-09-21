# Prompts

Copy one of these into your AI assistant and fill in the parts in `<angle brackets>`.

They are starting points, not magic. A prompt that names the file, the story and the
acceptance criteria will beat any clever wording.

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
Work on story <S-14>: <title>.

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
Review the changes in this pull request against story <S-14> and its acceptance criteria.

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
