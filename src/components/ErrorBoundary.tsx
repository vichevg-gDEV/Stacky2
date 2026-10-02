import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw, Terminal, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('STACKY Uncaught Application Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore storage access errors
    }
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#E5E9EF] text-slate-800 flex items-center justify-center p-6 font-sans">
          <div className="w-full max-w-xl bg-white border border-slate-300 rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-rose-50 border-b border-rose-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-300 text-rose-700 flex items-center justify-center shrink-0">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 tracking-tight">
                  European Terminal Exception Caught
                </h1>
                <p className="text-xs text-rose-700 font-medium">
                  The logistics application encountered an unexpected runtime error.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-1 font-mono">
                <div className="text-slate-500 text-[11px] font-semibold uppercase">Error Message:</div>
                <div className="text-rose-600 font-bold break-words">
                  {this.state.error?.message || 'Unknown runtime error occurred.'}
                </div>
              </div>

              {this.state.errorInfo?.componentStack && (
                <div className="p-3 bg-slate-900 text-slate-200 rounded-xl max-h-48 overflow-y-auto font-mono text-[11px] leading-relaxed">
                  <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Component Stack Trace:</span>
                  </div>
                  <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={this.handleReload}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reload Terminal</span>
                </button>

                <button
                  onClick={this.handleReset}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg font-semibold flex items-center gap-2 shadow-2xs transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Reset & Clear Local Cache</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
