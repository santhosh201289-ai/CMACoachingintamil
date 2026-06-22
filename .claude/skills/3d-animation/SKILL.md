---
name: 3d-animation
description: Create scroll-triggered and time-based animations for 3D websites using GSAP and Three.js. Use whenever the user wants scroll animations, camera movements, object transitions, parallax effects, entrance animations, or any kind of motion in a Three.js scene.
---

# 3D Animation Skill

## GSAP ScrollTrigger Setup
- Import gsap and ScrollTrigger, register plugin
- Use scrub: 1 for smooth scroll-linked animations
- ease: 'none' for scroll-linked motion (scrub handles easing)

## Object Entrances
- Scale from 0 with back.out(1.7) easing
- Stagger: delay: index * 0.1
- scrollTrigger start: 'top 80%' for viewport trigger

## Time-Based (Render Loop)
- Float: Math.sin(time * speed + offset) * amplitude
- Orbit: cos/sin with time for circular motion

## Parallax
- Track normalized mouse (-1 to 1)
- Multiply by small factor (0.02-0.1)
- Lerp toward target for smoothness

## Rules
- NEVER use CSS scroll-behavior: smooth with ScrollTrigger
- Use scrub: 1 (number) not scrub: true
- Pin sparingly on mobile
- Kill triggers on cleanup: ScrollTrigger.getAll().forEach(t => t.kill())
