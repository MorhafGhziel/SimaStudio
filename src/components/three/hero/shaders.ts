/**
 * Hero scene shaders.
 *
 * Ribbon: a long strip whose centreline, twist and width are computed on the
 * GPU, so the whole form flows without touching geometry on the CPU. Shading is
 * done in view space against a small procedural "studio" (key, rim, soft top),
 * giving a dark silk-chrome body with champagne highlights and a faint
 * thin-film sheen at grazing angles.
 */

export const ribbonVertex = /* glsl */ `
uniform float uTime;
uniform float uPhase;
uniform float uWidth;
uniform float uTwist;
uniform float uScroll;
uniform vec2 uPointer;

varying vec3 vPosV;
varying vec3 vNormalV;
varying vec2 vUv;

vec3 centerline(float t) {
  float time = uTime * 0.16 + uPhase;
  float x = mix(-7.5, 7.5, t);
  float y = mix(-3.4, 1.9, smoothstep(0.0, 1.0, t))
          + sin(t * 3.2 + time) * 0.75
          + sin(t * 7.1 - time * 1.3) * 0.12;
  float z = cos(t * 2.4 + time * 0.8) * 1.4 - 0.6;

  // The pointer lifts the part of the ribbon it hovers near.
  float near = exp(-pow((x - uPointer.x * 5.0) / 2.6, 2.0));
  y += uPointer.y * 0.45 * near;
  z += 0.45 * near * length(uPointer);

  // Scrolling unwinds the sweep upward.
  y += uScroll * (t - 0.3) * 1.4;
  return vec3(x, y, z);
}

vec3 surface(float t, float v) {
  float e = 0.002;
  vec3 c = centerline(t);
  vec3 T = normalize(centerline(t + e) - centerline(t - e));
  vec3 B = normalize(cross(T, vec3(0.0, 0.0, 1.0)));
  vec3 N = normalize(cross(B, T));
  float a = t * uTwist + sin(uTime * 0.21 + t * 5.0 + uPhase) * 0.55 + uScroll * 1.8;
  vec3 side = cos(a) * B + sin(a) * N;
  vec3 lift = cross(T, side);
  float w = uWidth * (0.3 + 0.7 * sin(3.14159 * clamp(t, 0.0, 1.0)));
  vec3 p = c + side * v * w;
  // Fine fabric-like ripple across the width.
  p += lift * sin(v * 5.0 + t * 18.0 - uTime * 0.9) * 0.025 * w;
  return p;
}

void main() {
  float t = uv.x;
  float v = uv.y - 0.5;
  vec3 p = surface(t, v);
  vec3 du = surface(t + 0.0025, v) - surface(t - 0.0025, v);
  vec3 dv = surface(t, v + 0.02) - surface(t, v - 0.02);
  vec3 n = normalize(cross(du, dv));

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vPosV = mv.xyz;
  vNormalV = normalize(normalMatrix * n);
  vUv = vec2(t, v);
  gl_Position = projectionMatrix * mv;
}
`;

export const ribbonFragment = /* glsl */ `
uniform float uTime;
uniform float uReveal;
uniform float uOpacity;
uniform vec3 uTint;

varying vec3 vPosV;
varying vec3 vNormalV;
varying vec2 vUv;

void main() {
  vec3 N = normalize(vNormalV);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(-vPosV);
  float ndv = max(dot(N, V), 0.0);
  vec3 R = reflect(-V, N);

  // Procedural studio lighting: a broad key, a sharp rim and a soft top light.
  vec3 L1 = normalize(vec3(0.55, 0.75, 0.45));
  float broad = pow(max(dot(R, L1), 0.0), 4.0);
  float key   = pow(max(dot(R, L1), 0.0), 22.0);
  float rim   = pow(max(dot(R, normalize(vec3(-0.65, 0.15, 0.75))), 0.0), 48.0);
  float top   = smoothstep(0.1, 0.95, R.y) * 0.35;
  float fres  = pow(1.0 - ndv, 2.4);

  // Silk sheen: a soft band of light that wanders across the width as the ribbon folds.
  float bandPos = 0.16 * sin(vUv.x * 6.0 + uTime * 0.3) + 0.1 * sin(vUv.x * 17.0 - uTime * 0.2);
  float sheen = exp(-pow((vUv.y - bandPos) / 0.16, 2.0)) * (0.35 + 0.65 * broad);

  float spec = broad * 0.55 + key * 2.2 + rim * 1.2 + top + sheen * 0.9;

  vec3 film = 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.12, 0.24) + fres * 0.8 + vUv.x * 0.5 + uTime * 0.015));

  vec3 col = uTint * 0.06;
  col += uTint * spec;
  col += mix(uTint, film * uTint * 1.35, 0.3) * fres * 0.9;
  col *= 0.94 + 0.06 * sin(vUv.y * 90.0 + vUv.x * 14.0);

  // Luminous glass edges give the form a crisp silhouette.
  float av = abs(vUv.y);
  float edgeLine = smoothstep(0.36, 0.47, av) * smoothstep(0.5, 0.47, av);
  col += uTint * edgeLine * (0.45 + 0.9 * fres + 0.6 * broad);

  float edge   = smoothstep(0.5, 0.46, av);
  float ends   = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.86, vUv.x);
  float reveal = 1.0 - smoothstep(uReveal * 1.2 - 0.2, uReveal * 1.2, vUv.x);
  float body   = 0.62 + 0.38 * clamp(spec + fres + edgeLine, 0.0, 1.0);

  gl_FragColor = vec4(col, uOpacity * edge * ends * reveal * body);
}
`;

/** Soft volumetric shaft of light: narrow at the source, widening and fading. */
export const beamVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const beamFragment = /* glsl */ `
uniform float uTime;
uniform float uIntensity;
uniform vec3 uColor;
varying vec2 vUv;

void main() {
  float y = vUv.y;
  float spread = mix(0.5, 0.07, y);
  float x = abs(vUv.x - 0.5);
  float core = smoothstep(spread, 0.0, x);
  float fall = smoothstep(0.0, 0.6, y) * (0.3 + 0.7 * y);
  float rays = 0.72 + 0.28 * sin(vUv.x * 38.0 + uTime * 0.25) * sin(vUv.x * 13.0 - uTime * 0.17);
  gl_FragColor = vec4(uColor, core * core * fall * rays * uIntensity);
}
`;

/** Dust drifting up through the light. */
export const dustVertex = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
attribute float aSeed;
varying float vAlpha;

void main() {
  vec3 p = position;
  p.y = mod(p.y + uTime * (0.04 + aSeed * 0.07) + 5.0, 10.0) - 5.0;
  p.x += sin(uTime * 0.3 + aSeed * 20.0) * 0.12;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * (0.35 + aSeed) * uPixelRatio / -mv.z;
  gl_Position = projectionMatrix * mv;
  vAlpha = (0.3 + 0.7 * fract(aSeed * 7.31)) * (0.55 + 0.45 * sin(uTime * (0.7 + aSeed) + aSeed * 31.0));
  vAlpha *= smoothstep(5.0, 3.0, abs(p.y));
}
`;

export const dustFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(uColor, a * a * vAlpha * uOpacity);
}
`;
