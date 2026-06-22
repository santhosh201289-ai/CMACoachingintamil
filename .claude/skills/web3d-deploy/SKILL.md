---
name: web3d-deploy
description: Deploy 3D websites to production on Vercel, Netlify, or other platforms. Use whenever the user mentions deploy, hosting, publish, go live, put online, or ship the website.
---

# Web 3D Deploy Skill

## Pre-Deploy Checklist
- npm run build — no errors
- Remove console.log and debug UI
- Check dist/ size (<5MB without large models)
- Test: npm run preview

## Vercel (Recommended)
- npx vercel (first time), npx vercel --prod (subsequent)

## Netlify
- npx netlify deploy --prod --dir=dist

## Asset Optimization
- Compress models: npx @gltf-transform/cli optimize
- Compress textures to WebP or KTX2
- manualChunks: separate three.js for caching
