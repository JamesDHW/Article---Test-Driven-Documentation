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

The flow lives at `apps/mobile/.maestro/create-project-and-task.yaml` and mirrors the web doc scenario (`apps/web/tests/doc/create-project-and-task.spec.ts`): sign in, create project `Website Redesign`, add task `Draft homepage layout`.

Maestro `text` selectors are **regex-based**; the flow uses `.*….*` where labels are split across views, and the Sign-in tap matches iOS’s combined accessibility string for `SymbolView` + label (e.g. `rectangle.portrait.and.arrow.right, Sign in`).

**Do not** use `expo start --ios` alone for this E2E path: that opens **Expo Go**, which is a different app (`host.exp.Exponent`). The Maestro flow is configured for the dev build’s bundle id, not Expo Go’s launcher.

**Note:** for now, for simplicity, test assets are committed to the GitRepo to avoid needing GitHub actions and simply deploy with Vercel with default setup, however tests could be run in the CI in a real scenario.
