Audit the 3D scene for performance issues:

1. Count total geometries, unique materials, estimated triangles
2. Check for: materials created inside loops, missing .dispose() calls, non-power-of-2 textures, InstancedMesh opportunities
3. Check mobile handling: detection exists? particles reduced? post-processing skipped?
4. Report with severity (critical/warning/suggestion) and specific fix code
