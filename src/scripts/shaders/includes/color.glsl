// =============================================================================
// color.glsl — Standalone, dependency-free color-space helpers.
//
// HSV components are all in [0, 1] (hue wraps). RGB is assumed linear in [0, 1].
// rgb2hsv / hsv2rgb use the branchless formulations by Sam Hocevar.
// =============================================================================

// Convert RGB (each [0,1]) to HSV (h,s,v each [0,1]).
vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10; // avoid divide-by-zero on greyscale inputs
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// Convert HSV (h,s,v each [0,1]) to RGB (each [0,1]).
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Increase brightness by `amount` (HSV value), clamped to 1.0.
vec3 brighten(vec3 color, float amount) {
  vec3 hsv = rgb2hsv(color);
  hsv.z = clamp(hsv.z + amount, 0.0, 1.0);
  return hsv2rgb(hsv);
}

// Decrease brightness by `amount` (HSV value), clamped to 0.0.
vec3 darken(vec3 color, float amount) {
  vec3 hsv = rgb2hsv(color);
  hsv.z = clamp(hsv.z - amount, 0.0, 1.0);
  return hsv2rgb(hsv);
}
