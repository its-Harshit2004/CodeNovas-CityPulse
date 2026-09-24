import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && this.props.resetKeys && prevProps.resetKeys) {
      const keysMatch = this.props.resetKeys.every((key, i) => key === prevProps.resetKeys[i]);
      if (!keysMatch) {
        this.setState({ hasError: false, error: null });
      }
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      
      return (
        <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center min-h-[100px] border border-red-500/30 bg-red-900/10 text-center">
          <div className="text-red-400 font-bold text-sm mb-2">This section failed to load</div>
          <button 
            onClick={this.reset}
            className="text-xs px-3 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
