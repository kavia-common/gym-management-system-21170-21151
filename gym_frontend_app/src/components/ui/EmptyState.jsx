import React from 'react';

/**
 * PUBLIC_INTERFACE
 * EmptyState: Display when no data is available with optional action button.
 * Props:
 * - icon: Icon or emoji (React node)
 * - title: Main message (string)
 * - description: Additional context (string)
 * - action: Optional action button (React node)
 */
export default function EmptyState({ icon, title, description, action }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '48px 24px',
        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.02) 0%, rgba(245, 158, 11, 0.02) 100%)',
        borderRadius: '12px',
        border: '1px dashed var(--border)',
      }}
    >
      {icon && (
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
          {icon}
        </div>
      )}
      <h3
        style={{
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--text)',
          margin: '0 0 8px 0',
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontSize: '14px',
            color: 'var(--muted)',
            margin: '0 0 20px 0',
          }}
        >
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
