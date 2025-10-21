import React from 'react';

/**
 * PUBLIC_INTERFACE
 * SectionHeader: Consistent section heading with optional description and actions.
 * Props:
 * - title: Section title (string)
 * - description: Optional description text (string)
 * - actions: Optional action buttons (React node)
 */
export default function SectionHeader({ title, description, actions }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '20px',
      }}
    >
      <div>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--text)',
            margin: '0 0 4px 0',
          }}
        >
          {title}
        </h2>
        {description && (
          <p
            style={{
              fontSize: '14px',
              color: 'var(--muted)',
              margin: 0,
            }}
          >
            {description}
          </p>
        )}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}
