// =============================================================================
// math.glsl — Standalone, dependency-free math constants and helpers.
// =============================================================================

#define PI 3.14159265359
#define TWO_PI 6.28318530718

// Linearly remap `value` from the range [inMin, inMax] to [outMin, outMax].
// Not clamped — values outside the input range extrapolate.
float remap(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin);
}

// 2D rotation matrix for `angle` radians (counter-clockwise).
// Use as: uv = rotate2d(angle) * uv;
mat2 rotate2d(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}
