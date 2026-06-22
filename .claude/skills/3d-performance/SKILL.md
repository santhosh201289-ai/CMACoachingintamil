---
name: 3d-performance
description: Optimize Three.js scenes for performance. Use whenever the user mentions slow performance, low FPS, lag, jank, optimization, mobile performance, or wants to audit their 3D scene. Also use proactively when creating complex scenes.
---

# 3D Performance Skill

## Quick Audit
- renderer.info.render → drawCalls, triangles
- renderer.info.memory → geometries, textures
- Count unique materials (each = draw call)

## Critical Rules
- pixelRatio: Math.min(dpr, 2)
- Reuse materials, InstancedMesh for 10+ same objects
- BufferGeometry only, power-of-2 textures, frustum culling on

## Mobile Optimizations
- pixelRatio: 1, reduce particles by 60-70%
- Skip post-processing, simpler shaders, fewer shadow lights

## Memory Management
- ALWAYS dispose(): geometry, material, texture
- Remove from scene, nullify references
- Kill GSAP: ScrollTrigger.getAll().forEach(t => t.kill())
