import React from 'react';
import { EmptyState } from './EmptyState.jsx';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8">
          <EmptyState 
            icon="error"
            title="Something went wrong"
            description="We encountered an unexpected error while loading this component."
            action={
              <button 
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="px-4 py-2 bg-surface-container-high border border-outline-variant text-white text-sm font-medium rounded-lg hover:bg-surface transition-colors"
              >
                Reload Page
              </button>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}
