# Bug Fix Workflow — assisted-installer-ui

Follow these steps in order.

## Step 1 — Locate the affected code

- Read the issue description carefully.
- Use `Glob` and `Grep` to find the relevant component or file.
- Check `libs/ui-lib/lib/ocm/` first — most user-facing components live there.
- If the issue mentions a Redux selector or state bug, check `libs/ui-lib/lib/ocm/store/slices/`.

## Step 2 — Write a failing test

Before editing any production code, write a Vitest test that reproduces the bug.
Place the test file next to the component under test (e.g. `OperatorCheckbox.test.tsx`).
Verify it fails before you fix anything.

## Step 3 — Fix the root cause

Make the minimum change needed. Do not refactor surrounding code.
Prefer fixing in `libs/ui-lib/` over duplicating logic in `apps/assisted-ui/`.

## Step 4 — Run validation

```bash
yarn build:all
yarn fix-code-style:all  # auto-fix lint where possible
yarn lint:all
yarn test:unit
```

Fix all errors before continuing.

## Step 5 — Write `.ai-bot/pr.md`

```markdown
## What

<one sentence describing the fix>

## Why

<root cause explanation>

## How

<brief description of the approach>

Fixes #<issue-number>
```
