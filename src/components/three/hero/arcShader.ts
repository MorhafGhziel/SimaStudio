/**
 * Hero "horizon" shader.
 *
 * One full-screen pass renders the lit edge of a vast sphere that fills the
 * lower part of the frame. The surface is treated as real 3D: each pixel gets a
 * sphere normal which is rotated over time and by the pointer, so the streams
 * of light wrap around the curvature and shift in depth instead of sliding flat.
 * Colour cycles continuously through a looping cyan → blue → violet → magenta →
 * orange spectrum, and a soft hotspot of light follows the cursor.
 */

export const arcVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const arcFragment = /* glsl */ `
uniform float uTime;
uniform float uReveal;
uniform float uMirror;
uniform vec2 uRes;
uniform vec2 uPointer;
varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// Looping spectrum so colour can cycle forever without a seam.
vec3 spectrum(float t) {
  vec3 c1 = vec3(0.24, 0.78, 1.00); // cyan
  vec3 c2 = vec3(0.33, 0.38, 1.00); // blue
  vec3 c3 = vec3(0.64, 0.34, 1.00); // violet
  vec3 c4 = vec3(1.00, 0.30, 0.66); // magenta
  vec3 c5 = vec3(1.00, 0.52, 0.30); // orange
  t = fract(t) * 5.0;
  if (t < 1.0) return mix(c1, c2, t);
  if (t < 2.0) return mix(c2, c3, t - 1.0);
  if (t < 3.0) return mix(c3, c4, t - 2.0);
  if (t < 4.0) return mix(c4, c5, t - 3.0);
  return mix(c5, c1, t - 4.0);
}

mat3 rotY(float a) { float s = sin(a), c = cos(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotX(float a) { float s = sin(a), c = cos(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }

void main() {
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  if (uMirror > 0.5) p.x = -p.x;

  // A vast sphere low in the frame: its lit edge sweeps from the bottom up to the far side.
  bool portrait = aspect < 1.0;
  vec2 center = portrait ? vec2(1.0, -1.15) : vec2(1.0, -1.3);
  float R = portrait ? 1.3 : 1.42;
  center += uPointer * vec2(0.045, 0.03);
  R += sin(uTime * 0.3) * 0.008;

  vec2 d = p - center;
  float r = length(d);
  float rim = r - R;
  float ang = atan(d.y, d.x);

  // Real sphere normal, rotated by time and pointer — gives the light its depth.
  float rr = min(r / R, 1.0);
  float z = sqrt(max(1.0 - rr * rr, 0.0));
  vec3 n = rotX(uPointer.y * 0.35 + sin(uTime * 0.13) * 0.06) * rotY(uTime * 0.07 + uPointer.x * 0.45) * vec3(d / R, z);
  float lon = atan(n.x, n.z);
  float lat = asin(clamp(n.y, -1.0, 1.0));

  // Streams of light wrapping the curvature.
  float warp = noise(vec2(lon * 2.2, lat * 2.2) + uTime * 0.06);
  float s1 = pow(noise(vec2(ang * 6.0 + warp * 3.0 - uTime * 0.5, rim * 140.0 + warp * 6.0)), 3.0);
  float s2 = pow(noise(vec2(ang * 16.0 + warp * 5.0 + uTime * 0.32, rim * 420.0 + lat * 8.0)), 5.0);
  float s3 = noise(vec2(ang * 2.5 - uTime * 0.22, rim * 40.0 + lat * 3.0));

  float band   = smoothstep(-0.55, -0.01, rim) * smoothstep(0.03, -0.004, rim);
  float core   = exp(-abs(rim) * 120.0);
  float halo   = exp(-max(rim, 0.0) * 7.0) * step(0.0, rim);
  float inner  = exp(rim * 3.5) * step(rim, 0.0);
  float trails = pow(noise(vec2(ang * 9.0 - uTime * 0.6, rim * 260.0 + 11.0)), 6.0) * smoothstep(0.2, 0.0, rim) * step(0.0, rim);

  // The cursor pools extra light where it hovers.
  vec2 pp = uPointer * vec2(aspect * 0.5, 0.5);
  float hot = exp(-pow(length(p - pp) * 2.4, 2.0));

  // Colour varies along the arc and through its depth, and keeps cycling.
  float t = (ang - 1.2) * 0.45 + rim * 1.5 + lat * 0.25 + uTime * 0.035;
  vec3 col = spectrum(t);
  vec3 col2 = spectrum(t + 0.35);

  vec3 c = vec3(0.0);
  c += mix(col, col2, s3) * band * (0.35 + 1.7 * s1 + 1.6 * s2) * (1.0 + hot * 1.4);
  c += mix(col, vec3(1.0), 0.7) * core * (1.3 + hot);
  c += col * halo * 0.45;
  c += col2 * inner * 0.22;
  c += mix(col2, vec3(1.0), 0.4) * trails * 1.2;

  // Intro: the light races along the edge.
  float front = mix(0.6, 3.8, uReveal);
  c *= smoothstep(ang - 0.35, ang, front);

  c = 1.0 - exp(-c * 1.35);
  c += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(c, 1.0);
}
`;
