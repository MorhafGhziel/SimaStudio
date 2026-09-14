/**
 * Hero "liquid horizon" shader.
 *
 * One full-screen pass renders the edge of a vast sphere low in the frame,
 * wrapped in a sheet of liquid light. A domain-warped flow field bends smooth
 * ribbons of colour along the curve; the ribbons are treated as a height field
 * and lit like a glossy fluid (normals, specular glints, fresnel), so the light
 * reads as poured liquid rather than streaks. The sphere rotates in 3D with
 * time and the pointer, colour cycles through a looping spectrum, and the
 * cursor sends soft ripples through the surface.
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

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

// Looping spectrum so colour can cycle forever without a seam.
vec3 spectrum(float t) {
  vec3 c1 = vec3(0.10, 0.85, 1.00); // cyan
  vec3 c2 = vec3(0.25, 0.35, 1.00); // blue
  vec3 c3 = vec3(0.70, 0.25, 1.00); // violet
  vec3 c4 = vec3(1.00, 0.18, 0.62); // magenta
  vec3 c5 = vec3(1.00, 0.45, 0.22); // orange
  t = fract(t) * 5.0;
  if (t < 1.0) return mix(c1, c2, t);
  if (t < 2.0) return mix(c2, c3, t - 1.0);
  if (t < 3.0) return mix(c3, c4, t - 2.0);
  if (t < 4.0) return mix(c4, c5, t - 3.0);
  return mix(c5, c1, t - 4.0);
}

mat3 rotY(float a) { float s = sin(a), c = cos(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotX(float a) { float s = sin(a), c = cos(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }

vec2 gCenter;
float gR;
vec2 gPointer;

// Liquid surface height at a screen point; also returns the flow value used for colour.
float liquid(vec2 p, out float flow) {
  vec2 d = p - gCenter;
  float r = length(d);
  float rim = r - gR;
  float ang = atan(d.y, d.x);

  // Sphere normal rotated in 3D: gives the flow depth as the planet turns.
  float rr = min(r / gR, 1.0);
  vec3 n = rotX(uPointer.y * 0.35 + sin(uTime * 0.13) * 0.06) * rotY(uTime * 0.07 + uPointer.x * 0.45) * vec3(d / gR, sqrt(max(1.0 - rr * rr, 0.0)));
  float lon = atan(n.x, n.z);
  float lat = asin(clamp(n.y, -1.0, 1.0));

  // Domain-warped flow field in arc coordinates.
  vec2 q = vec2(ang * 2.4 - uTime * 0.09 + lon * 0.6, rim * 7.0 + lat * 0.8);
  vec2 w = vec2(fbm(q + vec2(0.0, uTime * 0.12)), fbm(q + vec2(5.2, 1.3) - uTime * 0.1));
  flow = fbm(q + 2.2 * w);

  // Smooth ribbons following the curve, bent by the flow.
  float ribbons = 0.5 + 0.5 * sin(rim * 38.0 + flow * 9.0 - uTime * 0.45);
  float h = flow * 0.55 + ribbons * 0.45;

  // Cursor ripples.
  float dist = length(p - gPointer);
  h += exp(-dist * dist * 9.0) * 0.12 * sin(dist * 42.0 - uTime * 3.2);
  return h;
}

void main() {
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  if (uMirror > 0.5) p.x = -p.x;

  bool portrait = aspect < 1.0;
  gCenter = (portrait ? vec2(1.0, -1.15) : vec2(1.0, -1.3)) + uPointer * vec2(0.045, 0.03);
  gR = (portrait ? 1.3 : 1.42) + sin(uTime * 0.3) * 0.008;
  gPointer = uPointer * vec2(aspect * 0.5, 0.5);

  vec2 d = p - gCenter;
  float rim = length(d) - gR;
  float ang = atan(d.y, d.x);

  vec3 c = vec3(0.0);

  // Only shade the liquid where it can be seen.
  if (rim > -0.75 && rim < 0.3) {
    float flow;
    float e = 0.0025;
    float h = liquid(p, flow);
    float fx;
    float hx = liquid(p + vec2(e, 0.0), fx);
    float hy = liquid(p + vec2(0.0, e), fx);
    vec3 N = normalize(vec3(-(hx - h) / e * 0.018, -(hy - h) / e * 0.018, 1.0));
    vec3 V = vec3(0.0, 0.0, 1.0);
    vec3 R = reflect(-V, N);

    float spec  = pow(max(dot(R, normalize(vec3(-0.45, 0.6, 0.66))), 0.0), 70.0);
    float spec2 = pow(max(dot(R, normalize(vec3(0.55, 0.35, 0.76))), 0.0), 24.0);
    float sheen = pow(max(dot(R, normalize(vec3(0.0, 0.8, 0.6))), 0.0), 6.0);
    float fres  = pow(1.0 - N.z, 1.5);

    float band = smoothstep(-0.65, -0.01, rim) * smoothstep(0.03, -0.004, rim);
    band *= 0.3 + 0.7 * exp(rim * 3.2);

    float t = (ang - 1.2) * 0.4 + flow * 0.9 + uTime * 0.035;
    vec3 col = spectrum(t);
    vec3 col2 = spectrum(t + 0.3);
    vec3 fluid = mix(col, col2, smoothstep(0.35, 0.75, h)) * (0.08 + 1.9 * h * h);

    c += fluid * band * 1.9;
    c += (vec3(1.0) * spec * 1.8 + mix(col2, vec3(1.0), 0.35) * spec2 * 0.9 + col * sheen * 0.45) * band;
    c += col * fres * band * 1.6;

    // Glowing lip, halo and soft wisps just outside the edge.
    c += mix(col, vec3(1.0), 0.7) * exp(-abs(rim) * 90.0) * 1.2;
    c += col * exp(-max(rim, 0.0) * 7.0) * step(0.0, rim) * 0.45;
    c += col2 * smoothstep(0.55, 0.8, flow) * smoothstep(0.22, 0.0, rim) * step(0.0, rim) * 0.5;
  }

  // Deep inner glow of the sphere.
  c += spectrum((ang - 1.2) * 0.4 + uTime * 0.035 + 0.3) * exp(rim * 3.0) * step(rim, 0.0) * 0.12;

  // Intro: the liquid pours along the edge.
  float front = mix(0.6, 3.8, uReveal);
  c *= smoothstep(ang - 0.35, ang, front);

  c = 1.0 - exp(-c * 1.55);
  c += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(c, 1.0);
}
`;
