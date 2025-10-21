import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Card: Reusable card container with optional header, actions, and content area.
 * Props:
 * - title: Card title (string)
 * - actions: React node for action buttons in header
 * - children: Card content
 * - gradient: Apply gradient background (boolean)
 * - className: Additional CSS classes
 * - style: Additional inline styles
 */
export default function Card({ title, actions, children, gradient = false, className = '', style = {} }) {
  return (
    <section
      className={`card ${className}`}
      style={{
        background: gradient ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.03) 0%, rgba(245, 158, 11, 0.03) 100%)' : 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        padding: '20px',
        ...style,
      }}
    >
      {(title || actions) && (
        <div
          className="card-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {title && (
            <h3
              className="card-title"
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text)',
                margin: 0,
              }}
            >
              {title}
            </h3>
          )}
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
}
