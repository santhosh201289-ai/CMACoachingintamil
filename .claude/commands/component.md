Create a new 3D component called $ARGUMENTS:

1. Create src/components/$ARGUMENTS.js with this structure:
   - import * as THREE from 'three'
   - Export default class $ARGUMENTS
   - constructor(engine) → store engine ref, create this.group = new THREE.Group(), this.isReady = false
   - async init(assets) → build 3D objects, add to this.group, set isReady = true
   - update(time, deltaTime, scrollProgress) → animation (guard with if !isReady return)
   - onResize(width, height, isMobile) → responsive adjustments
   - onMouseMove(nx, ny) → mouse interaction (optional)
   - dispose() → traverse this.group, dispose all geometry + material + textures

2. Register in src/scripts/world.js:
   - Import the component
   - Create instance, call init(), add group to scene
   - Add to components array
