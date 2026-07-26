# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (hot reload on localhost:3000)
npm run build        # Static export → out/ directory (Next.js output: 'export')
npm run start        # Serve production build
npm run lint         # ESLint (next/core-web-vitals rules)
npm run test         # Vitest (watch mode)
npm run test:run     # Vitest (single run)
npm run test:coverage # Vitest with V8 coverage
npm run test:e2e     # Playwright end-to-end tests
npm run test:all     # Unit + integration + e2e
npx serve out        # Preview the static export locally
```

Running `npm install` triggers `postinstall.cjs`, which copies Pyodide WASM runtime files from `node_modules/pyodide/` into `public/pyodide/`.

## Architecture

This is a **statically exported** Next.js 16 + React 19 interactive Python learning platform. All pages are pre-rendered to static HTML at build time (`next.config.ts: output: 'export'`), deployable to any CDN.

### Data Flow

- `src/types/index.ts` — Core types: `Course`, `SubChapter`, `Lesson`, `Progress`
- `src/lib/content/chapters.ts` — Three courses (Python 开发, 智能体开发, 区块链开发), each with `SubChapter[]` containing `Lesson[]`
- `src/lib/content/lesson-loader.ts` — Server-side `readFileSync` loader; maps lesson ID prefix to subdirectory (`python/`, `agent/`, `blockchain/`)
- `src/lib/content/lessons/` — Markdown files organized by course subdirectory
- `src/lib/content/index.ts` — Re-exports everything from chapters and types

### Routing

- `/` — Homepage (course card grid)
- `/course/{courseId}` — Lesson page with hash-based navigation (`#chapterId-lessonNumber`, e.g. `#1-2`)
- `src/app/learn/` — Legacy route directory (exists but not actively used)

The lesson page uses a **server component** (`page.tsx`) that preloads all lesson markdown content, then passes it to a **client component** (`LessonClient.tsx`) which handles all interactivity.

### Client-Side Architecture (`LessonClient.tsx`)

The main client component orchestrates five concerns via props/state/hooks:

1. **Hash navigation** — `window.location.hash` drives which lesson is displayed; `parseHash()` extracts chapter/lesson from `#1-2` format
2. **Code execution** — `usePyodide()` hook loads Pyodide WASM runtime (global singleton pattern), `handleRunCode()` executes user code via `runPythonAsync()`
3. **Progress tracking** — `useProgress()` hook manages `localStorage`-backed completion state
4. **Layout** — Responsive split: sidebar (left), markdown content (center), code editor + output (right on desktop, stacked on mobile)
5. **Navigation** — Prev/next lesson links within current chapter

### Key Patterns

- **Pyodide global singleton** (`usePyodide.ts`) — Module-level `globalInstance`/`globalLoadPromise` variables prevent duplicate WASM loading across hook instances. Falls back from local `public/pyodide/` to CDN.
- **Static preloading** — `page.tsx` preloads all lesson markdown at build time into a `Record<string, string>` map, so hash navigation never triggers a file read on the client.
- **Inline styles** — All component styling uses inline `style` props (no CSS Modules, no styled-components). Global theme colors defined in `src/app/globals.css` via Tailwind v4 `@theme`.
- **Path alias** — `@/*` maps to `src/*` (configured in both `tsconfig.json` and `vitest.config.ts`).
- **Postinstall hook** — `postinstall.cjs` (CommonJS) copies Pyodide files because `package.json` uses `"type": "module"`.

### Testing

- **Vitest** — Unit and integration tests in `__tests__/unit/` and `__tests__/integration/`. Uses `jsdom` environment with `globals: true`. Setup file mocks `localStorage`, `matchMedia`, and `ResizeObserver`.
- **Playwright** — E2E tests in `__tests__/e2e/`. The web server is built statically then served via `npx serve out -l 3000`. Only Chromium is configured.
- Coverage excludes `src/app/**` (Next.js App Router pages are hard to unit-test).

### Content Authoring

To add a lesson: create a `.md` file in `src/lib/content/lessons/{courseDir}/`, then add a `Lesson` entry in `chapters.ts` via `createLesson()`. The `contentPath` field must match the file location. Missing markdown files trigger `buildFallbackContent()` which auto-generates placeholder content from the lesson metadata.

To add a course: add a new `Course` object to the `courses` array in `chapters.ts`.
