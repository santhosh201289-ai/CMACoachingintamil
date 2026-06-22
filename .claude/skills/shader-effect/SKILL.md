---
name: shader-effect
description: Create custom GLSL shaders for Three.js including vertex displacement, fragment coloring, noise effects, and post-processing. Use whenever the user mentions shaders, GLSL, visual effects, custom materials, noise, distortion, glow, bloom, or post-processing effects.
---

# Shader Effect Skill

## ShaderMaterial Factory Pattern
Each shader: folder with name.vert + name.frag + index.js exporting material factory

## Default Uniforms (always include)
- uTime: float, uResolution: vec2, uMouse: vec2

## Shared GLSL Functions
Place in shaders/includes/, use #include directive

## Common Patterns
- Noise displacement, gradient mix, fresnel, dissolve

## Post-Processing
- EffectComposer + RenderPass + UnrealBloomPass
- Bloom: strength 0.2-0.5, radius 0.4, threshold 0.8-0.9
- Replace renderer.render() with composer.render()

## Rules
- transparent: true if using alpha
- Update uniforms in animation loop
- Minify in production via vite-plugin-glsl
