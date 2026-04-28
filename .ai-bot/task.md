# Task: Fix Bug MGMT-21857 — [UI] - Missing "No Matching Clusters" Message

## Jira Ticket

MGMT-21857

## Repository

liatb-rh/assisted-installer-ui

## UI Flow Context

This is an **OCM (cloud installer)** issue. Focus your search in `libs/ui-lib/lib/ocm/`. The affected component is most likely in `libs/ui-lib/lib/ocm/components/`.

## Issue Description

*Description of the problem:*

UI 2.46.0 - When applying a filter in the *Assisted Clusters* list, if no clusters match the selected criteria, the UI leaves the results table empty without any explanatory message.

create an empty state message

*How reproducible:*

 

*Steps to reproduce:*

1.

2.

3.

*Actual results:*

 

*Expected results:*

## Universal Instructions

# Universal Instructions for assisted-installer-ui

These instructions apply to every task — bug fixes and CVE remediations alike.
Read this file fully before touching any code.

---

## Repository Overview

Yarn workspaces monorepo. One shared library (`ui-lib`) consumed by three deployment targets:

| App | Directory | Description |
|---|---|---|
| OCM (cloud) | `apps/assisted-ui/` | Main OpenShift Console flow |
| Disconnected/ABI | `apps/assisted-disconnected-ui/` | Air-gapped / Agent-Based Installer UI |
| Chatbot | `apps/assisted-chatbot/` | AI-assisted installer chatbot |

**Rule:** A bug in the OCM wizard may not exist in the disconnected flow — always check which deployment target the issue describes before editing.

---

## Directory Map

```
libs/
  ui-lib/lib/
    common/           ← shared across ALL deployment targets
      api/            ← axios clients for assisted-service, AMS, auth
      components/     ← base components (hosts table, wizard shell, forms)
        clusterConfiguration/   ← forms: discovery image, SSH, proxy, certs, disk encryption
        clusterWizard/          ← wizard step shell, validations, step navigation logic
        hosts/                  ← host table, hostname, roles, disk, NTP components
        featureSupportLevels/   ← old FSL badge/context
        newFeatureSupportLevels/ ← new FSL badge/context (prefer this one)
      hooks/          ← shared hooks (useStateSafely, useDeepCompareMemoize, etc.)
      reducers/       ← shared Redux reducers
      selectors/      ← shared selectors
      types/          ← TypeScript interfaces (Cluster, Host, Validation, etc.)
      validationSchemas/ ← Yup schemas shared across flows

    ocm/              ← OCM-specific (cloud installer wizard)
      components/
        clusterConfiguration/
          operators/          ← OperatorCheckbox, bundleSpecs, utils
          networkConfiguration/ ← NetworkConfiguration, NetworkConfigurationForm
          platformIntegration/  ← ExternalPlatformDropdown, PlatformIntegrationNote
          staticIp/           ← static IP YAML and host-specific configuration
          review/             ← ReviewStep, cluster summary before install
        clusterDetail/        ← ClusterDetail, ClusterProgress, event feed
        clusterWizard/        ← ClusterWizard, step transitions, wizard navigation
          wizardTransition.ts ← WIZARD STEP ORDER — edit with care
        clusters/             ← cluster list page, cluster card
        featureSupportLevels/ ← OCM FSL provider, ReviewClusterFeatureSupportLevels
        fetching/             ← polling, background data fetching
        hosts/                ← OCM-specific host table wrappers
        AddHosts/             ← Day 2 add-hosts wizard
      store/slices/
        current-cluster/      ← slice + selectors for the active cluster object
        clusters/             ← slice for the cluster list
        current-user/         ← slice for user permissions
        feature-flags/        ← slice for Unleash feature flags
        infra-envs/           ← slice for infrastructure environments

    cim/              ← ACM/CIM flow (cluster-image-management, on-premise MCE)
      components/     ← CIM-specific components
      hooks/          ← CIM-specific hooks
      types/          ← CIM type extensions

  ui-lib-tests/
    cypress/
      integration/    ← E2E specs grouped by feature:
        create-multinode/ create-sno/ day-2/ static-ip/ storage/
        dualstack/ custom-manifests/ features/ ui-behaviour/ use-cases/

  sdks/lib/          ← auto-generated OpenAPI clients (do NOT edit by hand)
    assisted-service/ ← models + API from assisted-service OpenAPI spec
    accounts-management-service/

  locales/           ← i18n translation files (en.json + others)
  types/             ← @openshift-assisted/types package (shared type definitions)
```

---

## Wizard Step Order (OCM)

Defined in `libs/ui-lib/lib/ocm/components/clusterWizard/wizardTransition.ts`:

```
cluster-details → [static-ip steps] → operators → host-discovery →
storage → networking → custom-manifests → review → credentials-download
```

Disconnected flow uses `disconnected-basic` and `disconnected-review` instead.
Do not reorder steps without checking `wizardStepsValidationsMap` in the same file.

---

## Jira Issue Key → UI Flow

The Jira project prefix tells you which UI flow is affected:

| Key prefix | Flow | Primary directory |
|---|---|---|
| `MGMT-` | OCM (cloud installer) | `libs/ui-lib/lib/ocm/` |
| `ACM-` | ACM / CIM (on-premise MCE) | `libs/ui-lib/lib/cim/` |

Use this to immediately narrow your search to the right directory before reading any code.

---

## Stack

- **TypeScript strict** — no `any`, prefer `interface` over `type`
- **React** — functional components only, no class components
- **PatternFly 6** — `@patternfly/react-core@6.x`; **always prefer PF components over raw HTML**
- **Formik** — all form state; access via `useFormikContext<T>()`
- **Redux Toolkit** — state management; read via selectors in `store/slices/*/selectors.ts`
- **Vitest** — unit tests, collocated with source (`*.test.ts` / `*.test.tsx`)
- **Cypress** — integration tests in `libs/ui-lib-tests/cypress/integration/`
- **i18next** — all user-visible strings must use `useTranslation` / `t()`

---

## PatternFly Component Rules

**Always use PatternFly components. Never use raw HTML elements for UI.**

| Instead of | Use |
|---|---|
| `<div>`, `<section>`, `<article>` | `<PageSection>`, `<Stack>`, `<Flex>`, `<Grid>` |
| `<button>` | `<Button variant="primary/secondary/link/plain">` |
| `<input>`, `<textarea>`, `<select>` | `<TextInput>`, `<TextArea>`, `<FormSelect>` |
| `<form>` | `<Form>` with `<FormGroup>` and `<FormHelperText>` |
| `<ul>/<li>` | `<List>` / `<ListItem>` |
| `<table>` | `<Table>` from `@patternfly/react-table` |
| `<span class="error">` | `<HelperText><HelperTextItem variant="error">` |
| `<p>` (body text) | `<TextContent><Text component="p">` |
| `<h1>`–`<h6>` | `<TextContent><Text component="h1">` etc. |
| Custom spinner/loading | `<Spinner>`, `<Bullseye>` |
| Custom empty state | `<EmptyState>` with `<EmptyStateHeader>`, `<EmptyStateBody>` |
| Custom alert/banner | `<Alert variant="info/warning/danger/success">` |
| Custom modal | `<Modal>` or `<ModalBoxBody>` |
| Custom tooltip | `<Tooltip content="...">` |
| Inline icon + text | `<Icon>` wrapper + PF icon component |

**Rules:**
- Import from `@patternfly/react-core` (components) or `@patternfly/react-table` (tables).
- Do not add custom CSS classes for layout — use PF's `Stack`, `Flex`, `Grid` with spacing props.
- Do not write inline `style={{}}` for spacing — use PF's `spacer` props (`spaceItems`, `gapItems`, etc.).
- Check existing components in the same directory first — PF patterns are already established.

---

## Key Patterns to Follow

### Redux state
- Read state via selectors: `selectCurrentCluster`, `selectCurrentClusterPermissionsState`, `selectIsCurrentClusterSNO`, etc.
- Never call `store.getState()` directly in components.
- Add new selectors to `libs/ui-lib/lib/ocm/store/slices/*/selectors.ts`.

### Feature flags
- OCM feature flags live in `store/slices/feature-flags/`.
- Component-level feature gating uses `useNewFeatureSupportLevel()` (not the old `useFeatureSupportLevel`).
- Support level badges: use `NewFeatureSupportLevelBadge`, not the legacy `FeatureSupportLevelBadge`.

### Operators
- Operator specs are defined in `bundleSpecs.tsx` and rendered via `OperatorCheckbox`.
- Operator field values are typed `OperatorsValues` from `libs/ui-lib/lib/common`.
- Do not add operator logic in `apps/assisted-ui/`; it belongs in `libs/ui-lib/lib/ocm/components/clusterConfiguration/operators/`.

### API / types
- API models come from `@openshift-assisted/types/assisted-installer-service` (the `libs/types` package).
- Do NOT edit files in `libs/sdks/lib/` — they are auto-generated from OpenAPI specs.
- Use `libs/ui-lib/lib/common/api/assisted-service/` for API calls; do not call axios directly.

### i18n
- Wrap all new user-visible strings with `t('key', 'English fallback')` from `useTranslation()`.
- After adding new strings run `yarn process_new_strings` to update translation files.
- The locales validation CI step will fail if translation files are out of sync.

### Where fixes belong
- Bug in a shared component → `libs/ui-lib/lib/common/`
- Bug in OCM-specific component → `libs/ui-lib/lib/ocm/`
- Bug in CIM flow → `libs/ui-lib/lib/cim/`
- Bug only in the standalone app shell → `apps/assisted-ui/`
- Never duplicate logic across these layers.

---

## Validation Commands (run in this order)

```bash
yarn build:all               # TypeScript compile + bundle — must be error-free
yarn fix-code-style:all      # auto-fix Prettier + ESLint (run before lint)
yarn lint:all                # ESLint — must report 0 errors
yarn test:unit               # Vitest unit tests — all must pass
# CVE flow only:
yarn audit --level high      # must report 0 high/critical findings
```

---

## Writing Tests

- **Unit tests**: place next to the file under test as `ComponentName.test.tsx`.
  Use Vitest + `@testing-library/react`. Mock Redux store with `renderWithStore()` if available.
- **Integration tests**: add specs under `libs/ui-lib-tests/cypress/integration/`.
  Cypress specs use MSW-backed mock data in `libs/ui-lib-tests/cypress/fixtures/`.
- Write the failing test **before** fixing the bug (TDD).

---

## After Making Changes

1. `yarn build:all` — fix all TypeScript errors first
2. `yarn fix-code-style:all` — auto-fix formatting
3. `yarn lint:all` — fix any remaining ESLint errors
4. `yarn test:unit` — all Vitest tests must pass
5. If new i18n strings were added: `yarn process_new_strings`
6. Write `.ai-bot/pr.md` with a concise PR description


## Workflow

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
> 🤖 This PR was automatically generated by [assisted-installer-ai-bot](https://github.com/openshift-assisted/assisted-installer-ai-bot) in response to Jira issue <issue-key>.
>
> **Reviewer summary:** <1-2 sentences describing the files changed and the approach taken, so the reviewer knows where to focus>

## What

<one sentence describing the fix>

## Why

<root cause explanation>

## How

<brief description of the approach>

Fixes #<issue-number>
```

## Step 6 — Clean up auto-generated files

Delete the auto-generated bot files — they must not be included in the PR:

```bash
rm -f .ai-bot/task.md .ai-bot/pr.md .ai-bot/self-review.md
```

These files are regenerated on every bot run and should never be committed.

