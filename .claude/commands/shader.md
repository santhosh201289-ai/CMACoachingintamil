Create a new GLSL shader called $ARGUMENTS:

1. Create folder: src/scripts/shaders/$ARGUMENTS/
2. Create $ARGUMENTS.vert (vertex shader)
3. Create $ARGUMENTS.frag (fragment shader)
4. Create index.js that:
   - Imports both shader files
   - Exports create${ARGUMENTS}Material(customUniforms) function
   - Default uniforms: uTime (float), uResolution (vec2), uMouse (vec2)
   - Returns new THREE.ShaderMaterial
5. If the shader uses noise, #include from shaders/includes/noise.glsl
