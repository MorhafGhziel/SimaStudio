'use client';

import { Component, type ReactNode } from 'react';

/** Keeps a failing 3D scene (missing model, lost WebGL context) from taking the page down. */
export class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
