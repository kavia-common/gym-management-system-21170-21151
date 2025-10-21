import React from 'react';
import Card from '../../components/Card';

/**
 * PUBLIC_INTERFACE
 * CheckoutResult: Displays a simple message after payment flow (mocked/test mode).
 */
export default function CheckoutResult() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status') || 'success';

  return (
    <div className="grid">
      <Card title="Payment Result">
        <p>Status: <b style={{ color: status === 'success' ? 'var(--success)' : 'var(--error)' }}>{status}</b></p>
        <p className="helper">This page is used in test mode to simulate payment provider redirects.</p>
      </Card>
    </div>
  );
}
