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

**Note:** for now, for simplicity, test assets are committed to the GitRepo to avoid needing GitHub actions and simply deploy with Vercel with default setup, however tests could be run in the CI in a real scenario.
