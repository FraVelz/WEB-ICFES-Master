'use client';

import React, { type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';

type ErrorBoundaryProps = {
  children: ReactNode;
  /** Texto del encabezado cuando falla el árbol hijo */
  title?: string;
  className?: string;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className={cn(
            'border-surface-border bg-surface-elevated/60 mx-auto max-w-lg rounded-2xl border p-8 text-center',
            this.props.className
          )}
          role="alert"
        >
          <Icon name="exclamation-triangle" size="2xl" className="text-red-400 mx-auto mb-4" />
          <h2 className="text-on-surface mb-2 text-lg font-semibold">{this.props.title ?? 'Algo salió mal'}</h2>
          <p className="text-on-surface-muted mb-6 text-sm">
            Ocurrió un error inesperado en esta sección. Puedes reintentar o volver atrás.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className={cn(
              'bg-app-ring text-white cursor-pointer rounded-xl px-5 py-2.5 text-sm font-semibold',
              'hover:bg-hub-orb transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent'
            )}
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
