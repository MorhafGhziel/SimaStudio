/**
 * SIMA liquid — one raymarched metaball shader shared by every 3D placement.
 *
 * Bodies are signed-distance spheres joined with a smooth minimum, so they
 * merge, stretch and separate like real liquid. A slow domain warp keeps the
 * surface organic. Shading is a dark glossy body lit by a small procedural
 * studio (violet, blue and a little coral), with ambient occlusion in the
 * creases and an analytic edge coverage for clean silhouettes.
 *
 * Each placement compiles the same code with a different MODE composition.
 */

export type LiquidMode = 'hero' | 'drop' | 'cta' | 'footer' | 'card' | 'pricing';

const MODE_ID: Record<LiquidMode, number> = { hero: 0, drop: 1, cta: 2, footer: 3, card: 4, pricing: 5 };

/** Radius (in composition units) that safely contains each composition. */
const BOUND: Record<LiquidMode, number> = { hero: 3.0, drop: 1.9, cta: 2.7, footer: 5.4, card: 2.3, pricing: 3.3 };

export const liquidVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
}
`;

const body = /* glsl */ `
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uPointer;
uniform float uScroll;
uniform float uIntro;
uniform vec3 uFrame;
uniform float uMirror;
uniform float uSpin;
uniform float uOpacity;

varying vec2 vUv;

const vec3 VIOLET = vec3(0.486, 0.227, 0.929);
const vec3 BLUE   = vec3(0.145, 0.388, 0.922);
const vec3 CORAL  = vec3(1.000, 0.420, 0.290);
const float FOCAL = 3.2;

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

vec3 warp(vec3 p, float t, float amount) {
  p += amount * sin(p.yzx * 1.7 + t * 0.6);
  p += amount * 0.5 * sin(p.zxy * 3.3 - t * 0.8);
  return p;
}

float composition(vec3 p) {
  float t = uTime;
  float g = uIntro;
  float d = 1e5;

#if MODE == 0
  // Hero: a heavy central body; satellites drift in, merge and pull away.
  p.xz *= rot(t * 0.05 + uPointer.x * 0.35);
  p.yz *= rot(-uPointer.y * 0.22 + uScroll * 0.45);
  vec3 q = warp(p, t * 0.5, 0.11);
  q += 0.025 * sin(q.yzx * 7.0 + t * 1.1);
  d = length(q * vec3(0.95, 1.1, 1.0)) - 0.9 * g;
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    float a = t * (0.16 + fi * 0.035) + fi * 1.05;
    vec3 c = vec3(cos(a) * (1.55 + 0.3 * sin(t * 0.2 + fi)), sin(a * 1.3 + fi) * 1.05, sin(a) * 1.1);
    float r = (0.2 + 0.2 * fract(fi * 0.618 + 0.3)) * g;
    d = smin(d, length(q - c * mix(0.35, 1.0, g)) - r, 0.62);
  }
#elif MODE == 1
  // Divider: two droplets that reach for each other, join and part.
  p.xy *= rot(uPointer.x * 0.12);
  vec3 q = warp(p, t * 0.6, 0.05);
  float s = sin(t * 0.45);
  d = length(q - vec3(-0.42 - 0.22 * s, 0.0, 0.0)) - 0.44 * g;
  d = smin(d, length(q - vec3(0.44 + 0.22 * s, 0.06 * cos(t * 0.5), 0.0)) - 0.34 * g, 0.6);
  d = smin(d, length(q - vec3(0.05 * s, -0.3 * cos(t * 0.37), 0.2)) - 0.16 * g, 0.45);
#elif MODE == 2
  // CTA: a loose liquid halo orbiting around the call to action.
  p.xy *= rot(uPointer.x * 0.1);
  p.yz *= rot(0.62 + uPointer.y * 0.08 + uScroll * 0.2);
  p.xz *= rot(t * 0.05);
  vec3 q = warp(p, t * 0.5, 0.06);
  for (int i = 0; i < 9; i++) {
    float fi = float(i);
    float a = fi / 9.0 * 6.2832 + t * 0.1 + 0.3 * sin(t * 0.3 + fi * 1.7);
    vec3 c = vec3(cos(a) * 2.0, 0.12 * sin(t * 0.5 + fi * 2.3), sin(a) * 2.0);
    float r = (0.11 + 0.11 * (0.5 + 0.5 * sin(fi * 2.1 + t * 0.4))) * g;
    d = smin(d, length(q - c) - r, 0.42);
  }
#elif MODE == 3
  // Footer: a slow liquid horizon, with drops lifting off and falling back.
  vec3 q = warp(p, t * 0.4, 0.08);
  for (int i = 0; i < 9; i++) {
    float fi = float(i);
    float x = -4.0 + fi + 0.3 * sin(t * 0.2 + fi);
    vec3 c = vec3(x, 0.35 * sin(fi * 1.3 + t * 0.35) - 0.2, 0.4 * cos(fi * 0.9 + t * 0.25));
    float r = (0.45 + 0.2 * sin(fi * 2.7)) * g;
    d = smin(d, length(q - c) - r, 0.8);
  }
  for (int j = 0; j < 2; j++) {
    float fj = float(j);
    float ph = fract(t * 0.05 + fj * 0.5);
    vec3 c = vec3(-1.8 + fj * 3.4 + uPointer.x * 0.3, -0.1 + sin(ph * 3.1416) * 1.25, 0.2);
    d = smin(d, length(q - c) - 0.2 * g, 0.5);
  }
#elif MODE == 4
  // Package preview: a compact version of the hero body, turned by dragging.
  p.xz *= rot(t * 0.12 + uSpin + uPointer.x * 0.2);
  p.yz *= rot(-uPointer.y * 0.15);
  vec3 q = warp(p, t * 0.55, 0.08);
  d = length(q) - 0.85 * g;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float a = t * (0.35 + fi * 0.06) + fi * 2.09;
    vec3 c = vec3(cos(a) * 1.2, sin(a * 1.4 + fi) * 0.7, sin(a) * 0.9);
    d = smin(d, length(q - c) - (0.24 + 0.06 * fi) * g, 0.55);
  }
#else
  // Pricing: two large masses joined by a slow bridge, seen through glass cards.
  p.xz *= rot(t * 0.03 + uPointer.x * 0.2);
  p.yz *= rot(uScroll * 0.35);
  vec3 q = warp(p, t * 0.45, 0.12);
  d = length(q - vec3(-0.9, 0.2, 0.0)) - 1.15 * g;
  d = smin(d, length(q - vec3(1.0 + 0.2 * sin(t * 0.3), -0.3, -0.3)) - 0.85 * g, 0.9);
  d = smin(d, length(q - vec3(0.1, -1.0 + 0.2 * cos(t * 0.25), 0.6)) - 0.4 * g, 0.6);
#endif

  return d;
}

float map(vec3 p) {
  p.x *= uMirror;
  p.xy -= uFrame.xy;
  return composition(p / uFrame.z) * uFrame.z;
}

vec3 calcNormal(vec3 p) {
  const vec2 e = vec2(1.0, -1.0) * 0.0015;
  return normalize(e.xyy * map(p + e.xyy) + e.yyx * map(p + e.yyx) + e.yxy * map(p + e.yxy) + e.xxx * map(p + e.xxx));
}

float calcAO(vec3 p, vec3 n) {
  float occ = 0.0;
  float w = 1.0;
  for (int i = 1; i <= 4; i++) {
    float h = 0.07 * float(i);
    occ += (h - map(p + n * h)) * w;
    w *= 0.6;
  }
  return clamp(1.0 - 2.0 * occ, 0.0, 1.0);
}

// Dark studio with coloured soft boxes and one thin white strip light.
vec3 env(vec3 r) {
  vec3 c = vec3(0.014, 0.012, 0.024);
  c += VIOLET * 2.3 * pow(max(dot(r, normalize(vec3(-0.7, 0.55, 0.45))), 0.0), 2.5);
  c += BLUE * 2.1 * pow(max(dot(r, normalize(vec3(0.85, 0.1, 0.45))), 0.0), 3.0);
  c += CORAL * 1.1 * pow(max(dot(r, normalize(vec3(0.2, -0.85, -0.15))), 0.0), 16.0);
  c += vec3(1.0, 0.98, 1.0) * smoothstep(0.94, 0.99, dot(r, normalize(vec3(-0.35, 0.85, 0.5)))) * 2.2;
  return c;
}

vec3 shade(vec3 p, vec3 rd) {
  vec3 n = calcNormal(p);
  vec3 v = -rd;
  float ndv = clamp(dot(n, v), 0.0, 1.0);
  vec3 r = reflect(rd, n);
  float fres = 0.04 + 0.96 * pow(1.0 - ndv, 5.0);
  float ao = calcAO(p, n);
  float edge = pow(1.0 - ndv, 1.6);

  // Colour travels across the surface with its orientation — violet into blue, with coral only at a few rims.
  float hue = 0.5 + 0.5 * sin(dot(n, vec3(1.3, 2.1, 0.7)) * 1.4 + uTime * 0.08);
  vec3 tint = mix(VIOLET, BLUE, smoothstep(0.2, 0.75, hue));

  vec3 col = tint * (0.05 + 0.6 * edge) * (0.4 + 0.6 * ao);
  col += env(r) * mix(0.32, 1.0, fres) * (0.4 + 0.6 * ao);
  col += CORAL * pow(1.0 - ndv, 3.0) * smoothstep(0.78, 1.0, hue) * 1.1;
  col += vec3(1.0) * pow(max(dot(r, normalize(vec3(-0.35, 0.85, 0.5))), 0.0), 140.0) * 1.3;
  return col;
}

void main() {
  float aspect = uRes.x / uRes.y;
  vec2 uv = (vUv - 0.5) * vec2(aspect, 1.0) * 2.0;
  vec3 ro = vec3(0.0, 0.0, 5.0);
  vec3 rd = normalize(vec3(uv, -FOCAL));

  vec3 centre = vec3(uFrame.x * uMirror, uFrame.y, 0.0);
  float radius = BOUND * uFrame.z;
  vec3 oc = ro - centre;
  float b = dot(oc, rd);
  float disc = b * b - (dot(oc, oc) - radius * radius);

  vec4 outColor = vec4(0.0);
  if (disc > 0.0) {
    disc = sqrt(disc);
    float t = max(-b - disc, 0.0);
    float tEnd = -b + disc;
    float pixel = 2.0 / (uRes.y * FOCAL);
    float minRatio = 1e5;
    float minT = t;
    float glow = 0.0;
    bool hit = false;

    for (int i = 0; i < STEPS; i++) {
      float d = map(ro + rd * t);
      float fw = max(t * pixel, 1e-4);
      float ratio = d / fw;
      if (ratio < minRatio) { minRatio = ratio; minT = t; }
      glow += exp(-max(d, 0.0) * 7.0) * 0.01;
      if (ratio < 0.5) { hit = true; break; }
      t += d * 0.75;
      if (t > tEnd) break;
    }

    float cover = hit ? 1.0 : 1.0 - smoothstep(0.5, 2.0, minRatio);
    vec3 col = vec3(0.0);
    if (cover > 0.0) {
      col = shade(ro + rd * (hit ? t : minT), rd);
      col = col / (1.0 + col * 0.32);
    }
    float haloA = clamp(glow, 0.0, 0.5) * 0.3;
    vec3 halo = mix(VIOLET, BLUE, vUv.x) * haloA;
    outColor = vec4(col * cover + halo * (1.0 - cover), cover + haloA * (1.0 - cover)) * uOpacity;
  }
  gl_FragColor = outColor;
}
`;

export function liquidFragment(mode: LiquidMode, lite: boolean) {
  return `#define MODE ${MODE_ID[mode]}\n#define STEPS ${lite ? 48 : 80}\nconst float BOUND = ${BOUND[mode].toFixed(2)};\n${body}`;
}

/** World half-height visible at z = 0 for the shader camera (distance 5, focal 3.2). */
const H = 5 / 3.2;

/** Where each composition sits inside its view: [x, y, zoom], from the view size and scroll offset. */
export function framing(mode: LiquidMode, width: number, height: number, scroll: number): [number, number, number] {
  const aspect = width / height;
  const halfW = H * aspect;
  const portrait = aspect < 0.9;
  switch (mode) {
    case 'hero':
      return portrait ? [0, H * 0.36 - scroll * 0.6, halfW * 0.62] : [halfW * 0.32, 0.08 - scroll * 0.9, Math.min(0.98, halfW * 0.4)];
    case 'drop':
      return [0, -scroll * 0.2, Math.min((H * 0.85) / 0.6, (halfW * 0.9) / 1.35)];
    case 'cta':
      return [0, -scroll * 0.3, Math.max(0.36, Math.min((halfW * 0.94) / 2.25, (H * 0.92) / 1.45))];
    case 'footer':
      return [0, -H * 0.2 - scroll * 0.2, Math.min(halfW / 4.2, H * 0.8)];
    case 'card':
      return [0, 0, Math.min((H * 0.9) / 1.9, (halfW * 0.9) / 1.9)];
    case 'pricing':
      return [portrait ? 0 : halfW * 0.08, -scroll * 0.4, Math.min((halfW * 0.95) / 2.1, (H * 1.15) / 1.6)];
  }
}
