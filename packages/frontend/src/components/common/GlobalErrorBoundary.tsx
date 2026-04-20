import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class GlobalErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[GlobalErrorBoundary]', error, info.componentStack)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[oklch(0.19_0_0)] text-white">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="text-sm text-white/60">
            An unexpected error occurred. Please reload the page.
          </p>
          <Button onClick={this.handleReload}>Reload page</Button>
        </div>
      )
    }

    return this.props.children
  }
}
