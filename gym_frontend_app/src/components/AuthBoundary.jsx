import React from 'react';

/**
 * PUBLIC_INTERFACE
 * AuthBoundary: Defensive wrapper displaying a friendly message if children throw
 * due to auth context not being available. Intended as a no-op in normal cases.
 */
export default class AuthBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(err) {
    // Only set error state for known auth hook errors
    const message = typeof err?.message === 'string' ? err.message : '';
    if (message.includes('useSupabaseAuth') || message.includes('useAuth must be used within an AuthProvider')) {
      return { hasError: true, error: err };
    }
    return { hasError: false, error: null };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.warn('AuthBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '40vh' }}>
          <div className="card">
            <h3>Loading…</h3>
            <p>Preparing authentication context. If this persists, please refresh.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
