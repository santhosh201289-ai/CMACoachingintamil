# 3D Website Base Template

A reusable Three.js + Vite starter for immersive 3D websites.

## Quick Start
1. Clone this template: `cp -r 3d-website-base my-new-project`
2. `cd my-new-project && rm -rf .git && git init`
3. `npm install`
4. Start Claude Code: `claude`
5. Run: `/new-project YourProjectName`
6. Answer the customization questions
7. Start building: `/component YourFirstComponent`

## Dev Commands
- `npm run dev` — Start dev server (localhost:3000)
- `npm run build` — Production build
- `npm run preview` — Preview production build

## Claude Code Commands
- `/new-project [name]` — Customize template for new project
- `/component [Name]` — Create a 3D component
- `/shader [name]` — Create a GLSL shader
- `/perf-check` — Performance audit
- `/build` — Production build with checks
- `/deploy` — Deploy to Vercel/Netlify
- `/theme [description]` — Change visual theme

## Architecture
- `src/scripts/core/` — Reusable engine (DO NOT MODIFY)
- `src/scripts/world.js` — Project-specific scene (CUSTOMIZE)
- `src/scripts/animations.js` — Scroll timeline (CUSTOMIZE)
- `src/components/` — Your 3D components (CREATE NEW)
- `src/styles/main.css` — Design tokens (CUSTOMIZE CSS vars)

## Tech Stack
Three.js · GSAP ScrollTrigger · Vite · vite-plugin-glsl
