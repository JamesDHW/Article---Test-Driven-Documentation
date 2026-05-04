# Test-Driven Documentation Demo

This is an example implementation for the concept of Test-Driven Documentation. You can learn more [here](https://jdhw.notion.site/Test-Driven-Documentation-Developing-with-Systems-Thinking-2e1eb97878ef808a8b5be4d774326d7d?pvs=74).

## Quick Start

**Commands**

- `pnpm --filter web dev` - run the website in dev mode (`localhost:3000`)
- `pnpm --filter docs dev` - run the documentation in dev mode (`localhost:3001`)

- `pnpm --filter web test:e2e` - run the E2E tests on the website
- `pnpm --filter web test: docs` - run the E2E tests on the website to record documentation videos
- `pnpm --filter web pw: publish` - copy recorded assets into the documentation static assets
- `pnpm --filter docs build` - build the documentation website

## Mobile E2E (Maestro)

Maestro runs against the **native dev build** of this app (not Expo Go). The iOS bundle id is `com.testdrivendocumentationdemo.mobile` (see `apps/mobile/app.json`).

**Prerequisites**

- Xcode and an iOS Simulator
- [Maestro](https://maestro.mobile.dev/) installed (`maestro` on your `PATH`)
- A Java runtime (Maestro’s CLI needs it on macOS)

**Run (recommended)**

1. From the repo root, build and launch the app on the simulator (first run may take several minutes while native code compiles):
   - `pnpm --filter mobile ios:dev`
   This runs `expo run:ios`, installs **mobile** with bundle id `com.testdrivendocumentationdemo.mobile`, and opens it directly so your login screen is visible.
2. In another terminal, run the Maestro flow:
   - `pnpm test:mobile:e2e`

Top-level flows live under `apps/mobile/.maestro/flows/**/*.yaml`. The first flow, `create-project-and-task.yaml`, mirrors the web doc scenario (`apps/web/tests/doc/create-project-and-task.spec.ts`): sign in, create project `Website Redesign`, add task `Draft homepage layout`. Sub-flows (referenced via `runFlow`) live in `apps/mobile/.maestro/sub-flows/` so the test runner does not pick them up as standalone tests.

Maestro `text` selectors are **regex-based**; the flow uses `.*….*` where labels are split across views, and the Sign-in tap matches iOS’s combined accessibility string for `SymbolView` + label (e.g. `rectangle.portrait.and.arrow.right, Sign in`).

**Publish mobile doc artifacts (video + screenshots + manifest)**

The recording pipeline auto-discovers every `.yaml` under `apps/mobile/.maestro/flows/`. Adding a new flow is enough to get a new docs page on the next record run — no manifest, registry, or doc-specific YAML edits.

1. Record + publish all flows in one step:
   - `pnpm --filter mobile docs:mobile`
   The recorder emits a short harness YAML per flow under `apps/mobile/.maestro/.generated/` (gitignored) with `startRecording` -> `runFlow` -> `stopRecording` and a concrete `runFlow.file` path — Maestro cannot use `${FLOW_FILE}` in a static wrapper because `file:` is resolved before env substitution. `apps/mobile/.maestro/_record_wrapper.yaml` is an optional fixed-path copy for manual smoke runs. Flow files under `flows/` stay pure.
2. Build docs:
   - `pnpm --filter docs build`

You can run the full mobile docs pipeline from repo root via:
- `pnpm publish:docs:mobile`

**Do not** use `expo start --ios` alone for this E2E path: that opens **Expo Go**, which is a different app (`host.exp.Exponent`). The Maestro flow is configured for the dev build’s bundle id, not Expo Go’s launcher.

**Note:** for now, for simplicity, test assets are committed to the GitRepo to avoid needing GitHub actions and simply deploy with Vercel with default setup, however tests could be run in the CI in a real scenario.
