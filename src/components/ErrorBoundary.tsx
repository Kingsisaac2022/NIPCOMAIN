import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import Button from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isOffline: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    isOffline: !navigator.onLine
  };

  private handleOnlineStatus = () => {
    this.setState({ isOffline: !navigator.onLine });
  };

  public componentDidMount() {
    window.addEventListener('online', this.handleOnlineStatus);
    window.addEventListener('offline', this.handleOnlineStatus);
  }

  public componentWillUnmount() {
    window.removeEventListener('online', this.handleOnlineStatus);
    window.removeEventListener('offline', this.handleOnlineStatus);
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, isOffline: !navigator.onLine };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.isOffline) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="bg-card-bg p-8 rounded-xl border-2 border-warning/50 max-w-lg w-full text-center">
            <WifiOff size={48} className="text-warning mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">You're offline</h1>
            <p className="text-text-secondary mb-6">
              Please check your internet connection and try again
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="primary"
              icon={<RefreshCw size={20} />}
            >
              Retry Connection
            </Button>
          </div>
        </div>
      );
    }

    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="bg-card-bg p-8 rounded-xl border-2 border-error/50 max-w-lg w-full text-center">
            <AlertTriangle size={48} className="text-error mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-text-secondary mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="space-x-4">
              <Button
                onClick={() => window.location.reload()}
                variant="primary"
                icon={<RefreshCw size={20} />}
              >
                Reload Page
              </Button>
              <Button
                onClick={this.handleReset}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;