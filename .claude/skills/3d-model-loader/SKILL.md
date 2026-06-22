---
name: 3d-model-loader
description: Load, display, and optimize 3D models in Three.js. Use whenever the user wants to load .glb, .gltf, .obj, .fbx models, add 3D objects from files, or work with imported meshes — even if they just say "add a 3D model" or "import an object."
---

# 3D Model Loader Skill

## Preferred Setup
- GLTFLoader + DRACOLoader for .glb files
- Draco decoder from Google CDN
- Use THREE.LoadingManager for progress tracking

## After Loading
- Traverse model: enable castShadow + receiveShadow on meshes
- Scale and position as needed
- For animations: THREE.AnimationMixer + clipAction

## Optimization
- Prefer .glb over .gltf (single binary file)
- Use Draco compression for large models (60-80% smaller)
- Reduce polygon count in Blender before export

## Cleanup
- Traverse and dispose all geometry + material + textures
- Stop animation mixer
