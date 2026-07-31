# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An interactive 3D portfolio built with Three.js and SvelteKit 2. Users explore a 3D room and click objects (laptop, bookshelf, frame, character) to view resume sections.

## Common Commands

```bash
# Development
npm run dev          # Start Vite dev server (http://localhost:5173)

# Production
npm run build        # Build for production
npm run preview      # Preview production build locally

# Type Checking
npm run check        # Run svelte-check with TypeScript
npm run check:watch  # Type checking in watch mode
```

## Architecture

### Tech Stack
- **SvelteKit 2** + **Svelte 5** (runes-based reactivity)
- **Three.js** — 3D scene, raycasting, procedural geometry
- **GSAP** — Camera fly-to animations
- **TypeScript** — End-to-end type safety

### Key Patterns

**Three.js is client-only and lazy-loaded.** The Scene.svelte component is dynamically imported in `+page.svelte` inside `onMount()` to exclude Three.js from the SSR bundle (saves ~600kb).

**State management uses Svelte 5 rune modules.** Stores are in `src/lib/stores/*.svelte.ts` files and use `$state()` for reactive state shared between UI and scene:
- `scene.svelte.ts` — Loading progress, focus target, lamp toggle, clock/time
- `ui.svelte.ts` — Panel content, help modal visibility

**Single source of truth for content.** All resume data lives in `src/lib/data/resume.ts`. The 3D scene labels, panel content, and SEO fallback pages all read from this file.

**Scene architecture (Scene.svelte).** All Three.js code is in one large component (~1100 lines) with imperative object creation:
- Room geometry is procedural (walls, furniture, decor)
- Interactive objects are grouped and tagged with metadata
- Raycasting handles hover/click; clicks fly camera via GSAP
- Day/night cycle updates lighting and the wall painting (sun/moon/stars)
- Character has a sleep/wake state machine (goes to bed at 23:00, wakes at 07:00)

### Project Structure

```
src/
├── lib/
│   ├── data/resume.ts          # All portfolio content (edit this to customize)
│   ├── scene/                  # Pure TS modules for Three.js
│   │   ├── setup.ts            # Renderer, camera, controls init
│   │   ├── lighting.ts         # Day/night lighting system
│   │   ├── interactions.ts     # Raycasting setup
│   │   └── camera-anim.ts      # GSAP camera animations
│   ├── stores/                 # Svelte 5 rune-based state
│   │   ├── scene.svelte.ts     # Scene state (loading, focus, lamp)
│   │   └── ui.svelte.ts        # Panel content, UI state
│   └── components/
│       ├── Scene.svelte        # Three.js canvas (lazy-loaded)
│       └── UI/                 # Panel, NavDots, LoadingScreen, etc.
└── routes/
    ├── +page.svelte            # Main 3D experience
    ├── about/+page.svelte      # Static fallback (SEO)
    ├── projects/+page.svelte   # Static fallback (SEO)
    └── contact/+page.svelte    # Static fallback (SEO)
```

### Interactive Objects Map

| Object Key | 3D Group | Camera Position | Opens Panel |
|------------|----------|-----------------|-------------|
| `laptop` | Desk laptop | Close-up on desk | Projects |
| `bookshelf` | Bookshelf with books | Medium shot | Skills |
| `frame` | Wall painting | Close-up on wall | About Me |
| `character` | Character at desk / sleeping body | Dynamic based on state | Contact |

### Time Simulation

The scene has a real-time day/night cycle based on the user's local time:
- Lighting colors shift (cool blue at night, warm orange at dawn/dusk)
- Wall painting shows moon/stars at night, sun during day
- Character sleeps in bed from 23:00–07:00, sits at desk otherwise
- Laptop screen dims when "off" (23:00–07:00)
- Window pane glow changes color/intensity

### Vite Configuration Notes

Three.js and GSAP are split into separate chunks via a custom plugin in `vite.config.ts`:
```js
manualChunks(id) {
  if (id.includes('node_modules/three')) return 'three';
  if (id.includes('node_modules/gsap')) return 'gsap';
}
```

### SEO & Accessibility

- Prerendered fallback pages at `/about`, `/projects`, `/contact` for no-WebGL scenarios
- JSON-LD structured data in `+layout.svelte` (Person + CreativeWork schemas)
- Semantic canvas label for screen readers
