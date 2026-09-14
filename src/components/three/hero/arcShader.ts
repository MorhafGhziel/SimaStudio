/**
 * Hero "horizon" shader.
 *
 * A single full-screen pass draws the rim of a vast dark sphere sitting low in
 * the frame. Light streams along the rim as fine concentric streaks, coloured by
 * a cool-to-warm spectrum (cyan → blue → violet → magenta → orange), with a
 * white-hot edge, a soft atmospheric halo and a gentle glow inside the body.
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
uniform float uScroll;
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

vec3 spectrum(float t) {
  vec3 c1 = vec3(0.24, 0.78, 1.00); // cyan
  vec3 c2 = vec3(0.33, 0.38, 1.00); // blue
  vec3 c3 = vec3(0.64, 0.34, 1.00); // violet
  vec3 c4 = vec3(1.00, 0.30, 0.66); // magenta
  vec3 c5 = vec3(1.00, 0.52, 0.30); // orange
  t = clamp(t, 0.0, 1.0) * 4.0;
  if (t < 1.0) return mix(c1, c2, t);
  if (t < 2.0) return mix(c2, c3, t - 1.0);
  if (t < 3.0) return mix(c3, c4, t - 2.0);
  return mix(c4, c5, t - 3.0);
}

void main() {
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  if (uMirror > 0.5) p.x = -p.x;

  // Sphere placement: low and to the side on wide screens, tucked into the corner on tall ones.
  bool portrait = aspect < 1.0;
  vec2 center = portrait ? vec2(0.55, -1.25) : vec2(0.85, -0.95);
  float R = portrait ? 1.0 : 1.08;
  center += uPointer * 0.02;
  center.y -= uScroll * 0.32;
  center.y += sin(uTime * 0.25) * 0.006;

  vec2 d = p - center;
  float r = length(d);
  float ang = atan(d.y, d.x);
  float rim = r - R; // < 0 inside the sphere

  // Light streaming along the rim.
  float s1 = pow(noise(vec2(ang * 5.0 - uTime * 0.32, rim * 150.0)), 3.0);
  float s2 = pow(noise(vec2(ang * 13.0 + uTime * 0.21, rim * 360.0 + 7.0)), 4.0);
  float s3 = pow(noise(vec2(ang * 2.2 - uTime * 0.12, rim * 60.0 + 3.0)), 2.0);
  float band = smoothstep(-0.3, -0.015, rim) * smoothstep(0.05, -0.004, rim);

  float core  = exp(-abs(rim) * 150.0);
  float halo  = exp(-max(rim, 0.0) * 12.0) * step(0.0, rim);
  float inner = exp(rim * 5.0) * step(rim, 0.0);

  // Colour drifts along the arc and across its depth.
  float t = (ang - 1.45) / 1.35 + rim * 1.8 + sin(uTime * 0.09 + ang * 2.0) * 0.08;
  vec3 col = spectrum(t);
  vec3 hot = mix(col, vec3(1.0), 0.65);

  vec3 c = vec3(0.0);
  c += col * band * (0.22 + 1.5 * s1 + 1.3 * s2 + 0.5 * s3);
  c += hot * core * 1.5;
  c += col * halo * 0.32;
  c += col * inner * 0.1;

  // Reveal: the light races along the rim from the right edge on load.
  float front = mix(0.9, 3.7, uReveal);
  c *= smoothstep(ang - 0.3, ang, front);
  c *= 1.0 - uScroll * 0.45;

  c = 1.0 - exp(-c * 1.3);
  c += (hash(gl_FragCoord.xy) - 0.5) / 255.0; // dither against banding
  gl_FragColor = vec4(c, 1.0);
}
`;
