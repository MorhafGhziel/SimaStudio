'use client';

import { useSyncExternalStore } from 'react';

const noop = () => () => {};

function canUseWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    (gl as WebGLRenderingContext | null)?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

let webgl: boolean | null = null;

/** `null` during SSR/hydration, then whether WebGL is available and worth using. */
export function useWebGL(): boolean | null {
  return useSyncExternalStore(
    noop,
    () => {
      if (webgl === null) {
        const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
        webgl = canUseWebGL() && !nav.connection?.saveData && (nav.deviceMemory ?? 8) > 2;
      }
      return webgl;
    },
    () => null,
  );
}

/** Reactive media query — false on the server and during hydration. */
export function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
