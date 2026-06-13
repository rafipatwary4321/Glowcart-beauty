"use client";

import { Component, type ReactNode } from "react";

type HomeSectionBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type HomeSectionBoundaryState = {
  hasError: boolean;
};

export class HomeSectionBoundary extends Component<
  HomeSectionBoundaryProps,
  HomeSectionBoundaryState
> {
  state: HomeSectionBoundaryState = { hasError: false };

  static getDerivedStateFromError(): HomeSectionBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }

    return this.props.children;
  }
}
