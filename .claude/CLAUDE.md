# CMACoachingLandingpage

## What This Is
An immersive Three.js + Vite landing page for a CMA (Cost & Management Accountant)
exam coaching institute. Goal: lead generation — drive students to enroll and
book a demo class. Built from a reusable 3D website base template.

Theme: off-white background with burnt-orange accents (warm, premium, finance-grade).
Sections: Hero → Why CMA → Courses → Faculty → Results → Contact.

## Tech Stack
- Three.js (3D engine)
- GSAP + ScrollTrigger (scroll-driven animations)
- Vite + vite-plugin-glsl (bundler + shader imports)
- Vanilla JS with ES modules
- Vanilla CSS with custom properties

## Architecture Overview

### Entry Flow
src/index.html → src/scripts/main.js → boots everything

### Core Engine (DO NOT MODIFY per-project unless necessary)
- src/scripts/core/Engine.js — Master controller (scene, camera, renderer, loop)
- src/scripts/core/Loader.js — Centralized asset loading with progress
- src/scripts/core/Resizer.js — Responsive handling
- src/scripts/core/Debug.js — Performance monitor (dev only)

### Customizable Per Project
- src/scripts/world.js — Which components to load, project-specific scene setup
- src/scripts/animations.js — GSAP scroll timeline definitions
- src/components/*.js — All 3D components (one file per visual element)
- src/scripts/shaders/ — Custom GLSL shaders
- src/styles/main.css — Design tokens, typography, layout
- src/styles/sections.css — Section-specific styles
- src/index.html — Content, sections, meta tags

### Component Interface (STRICT)
Every component in src/components/ MUST export a class with:
- constructor(engine) → receives engine reference, creates this.group
- async init(assets) → builds 3D objects, adds to this.group
- update(time, deltaTime, scrollProgress) → per-frame + scroll state
- onResize(width, height, isMobile) → responsive adjustments
- onMouseMove(normalizedX, normalizedY) → mouse interaction (optional)
- dispose() → cleanup ALL geometries, materials, textures
- this.group → THREE.Group added to scene by world.js

### Asset Organization
- src/assets/models/ → .glb (Draco-compressed preferred)
- src/assets/textures/ → .jpg/.png (power-of-2, max 2048px)
- src/assets/textures/env/ → .hdr environment maps
- src/assets/fonts/ → .woff2 (CSS) + .json (Three.js TextGeometry)
- src/assets/audio/ → .mp3/.ogg

### Shader Organization
- src/scripts/shaders/includes/ → Reusable GLSL functions (noise, math)
- src/scripts/shaders/background/ → Background effects
- src/scripts/shaders/effects/ → Per-object shader effects
- Each shader folder: name.vert + name.frag + index.js (exports material factory)

## Commands
- npm run dev → Vite dev server (port 3000, LAN accessible)
- npm run build → Production build to dist/
- npm run preview → Preview production build

## Performance Rules (ENFORCED)
- pixelRatio: Math.min(devicePixelRatio, 2)
- renderer.setAnimationLoop() — NOT requestAnimationFrame
- Reuse geometries and materials — NEVER create inside loops
- InstancedMesh for 10+ identical objects
- Textures: power-of-2 dimensions only
- Mobile: reduce particles, simplify shaders, skip post-processing
- Target: 60fps, <100K triangles, <50 draw calls, <20MB assets
- ALWAYS call .dispose() on geometry, material, texture in cleanup

## Project Customization Checklist
When starting a new project from this template:
1. Update this CLAUDE.md with project-specific details
2. Edit CSS variables in src/styles/main.css (colors, fonts)
3. Edit src/index.html (content, sections, meta tags)
4. Edit src/scripts/world.js (which components to create)
5. Edit src/scripts/animations.js (scroll timeline)
6. Create components in src/components/
7. Add assets to src/assets/
