import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  readonly fallback: ReactNode
  readonly children: ReactNode
  readonly onError?: (error: Error) => void
}

interface ErrorBoundaryState {
  readonly failed: boolean
}

/** Keeps a render failure (typically WebGL) from unmounting the whole game. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true }
  }

  override componentDidCatch(error: Error, _info: ErrorInfo): void {
    this.props.onError?.(error)
  }

  override render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
