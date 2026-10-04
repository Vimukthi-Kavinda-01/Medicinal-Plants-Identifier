import React from 'react';
import { WarningCircle, ArrowClockwise } from '@phosphor-icons/react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[HerbSense ErrorBoundary caught error]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 text-center">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-card border border-red-100">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <WarningCircle size={32} weight="fill" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Something went wrong</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              {this.state.error?.message || 'An unexpected display error occurred while rendering.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-herb-700 hover:bg-herb-800 text-white font-semibold text-xs transition-colors"
            >
              <ArrowClockwise size={15} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
