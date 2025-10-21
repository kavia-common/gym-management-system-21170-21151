import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Badge: Small status indicator with color variants.
 * Props:
 * - children: Badge text content
 * - variant: 'primary' | 'secondary' | 'success' | 'error' | 'neutral'
 * - size: 'sm' | 'md' | 'lg'
 */
export default function Badge({ children, variant = 'neutral', size = 'md' }) {
  const variants = {
    primary: { bg: 'rgba(30, 58, 138, 0.1)', color: 'var(--primary)' },
    secondary: { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--secondary)' },
    success: { bg: 'rgba(5, 150, 105, 0.1)', color: 'var(--success)' },
    error: { bg: 'rgba(220, 38, 38, 0.1)', color: 'var(--error)' },
    neutral: { bg: 'rgba(107, 114, 128, 0.1)', color: 'var(--muted)' },
  };

  const sizes = {
    sm: { padding: '2px 6px', fontSize: '11px' },
    md: { padding: '3px 8px', fontSize: '12px' },
    lg: { padding: '4px 10px', fontSize: '13px' },
  };

  const style = variants[variant] || variants.neutral;
  const sizeStyle = sizes[size] || sizes.md;

  return (
    <span
      style={{
        display: 'inline-block',
        ...sizeStyle,
        borderRadius: '9999px',
        background: style.bg,
        color: style.color,
        fontWeight: 600,
        lineHeight: 1.4,
      }}
    >
      {children}
    </span>
  );
}
