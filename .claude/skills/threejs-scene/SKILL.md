---
name: threejs-scene
description: Create and configure Three.js 3D scenes with proper setup, lighting, camera, and controls. Use whenever the user asks to create a 3D scene, add 3D objects, set up WebGL rendering, or work with Three.js — even if they just say "add something 3D" or "make it interactive."
---

# Three.js Scene Skill

## Scene Setup
- Scene + PerspectiveCamera (FOV 75, near 0.1, far 1000) + WebGLRenderer
- Renderer: antialias, alpha, powerPreference: high-performance
- Pixel ratio: Math.min(devicePixelRatio, 2)
- Color space: SRGBColorSpace, tone mapping: ACESFilmicToneMapping
- Shadow maps: PCFSoftShadowMap (enable only if needed)
- Fog: FogExp2 matching CSS background

## Camera
- Default position: (0, 0, 5)
- OrbitControls with enableDamping for interactive scenes
- Disable OrbitControls on mobile (conflicts with scroll)

## Lighting Presets
- Minimal: AmbientLight(0xffffff, 0.5) + DirectionalLight(0xffffff, 1)
- Dramatic: Low ambient(0.2) + colored point lights + spot lights
- Studio: 3-point lighting (key, fill, rim)
- Always include at least ambient + one directional

## Animation Loop
- renderer.setAnimationLoop(animate) — NEVER requestAnimationFrame
- Use THREE.Clock for time + deltaTime

## Performance
- BufferGeometry only
- Reuse materials across similar objects
- InstancedMesh for 10+ identical meshes
- Texture dimensions: power of 2 (512, 1024, 2048)

## Cleanup
- Traverse scene: dispose all geometry + material + textures
- Remove event listeners
- Stop loop: renderer.setAnimationLoop(null)
