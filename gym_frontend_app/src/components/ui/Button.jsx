import React from 'react';
// Migration note: This legacy Button is deprecated. Use `import { Button } from '../../design-system/ui'`.

/**
 * PUBLIC_INTERFACE
 * Button: Reusable button component with variants and sizes.
 * Props:
 * - variant: 'primary' | 'secondary' | 'ghost' | 'success' | 'error'
 * - size: 'sm' | 'md' | 'lg'
 * - fullWidth: boolean
 * - disabled: boolean
 * - onClick: function
 * - children: button content
 * - type: 'button' | 'submit' | 'reset'
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  children,
  type = 'button',
  className = '',
  style = {},
}) {
  const variants = {
    primary: {
      background: 'var(--primary)',
      color: '#fff',
      border: 'none',
      hover: '#1e40af',
    },
    secondary: {
      background: 'var(--secondary)',
      color: '#1f2937',
      border: 'none',
      hover: '#f59e0b',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--primary)',
      border: '1px solid var(--primary)',
      hover: 'rgba(30, 58, 138, 0.04)',
    },
    success: {
      background: 'var(--success)',
      color: '#fff',
      border: 'none',
      hover: '#047857',
    },
    error: {
      background: 'var(--error)',
      color: '#fff',
      border: 'none',
      hover: '#b91c1c',
    },
  };

  const sizes = {
    sm: { padding: '6px 12px', fontSize: '13px' },
    md: { padding: '8px 16px', fontSize: '14px' },
    lg: { padding: '10px 20px', fontSize: '16px' },
  };

  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...sizeStyle,
        background: variantStyle.background,
        color: variantStyle.color,
        border: variantStyle.border,
        borderRadius: '8px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease',
        width: fullWidth ? '100%' : 'auto',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && variantStyle.hover) {
          if (variant === 'ghost') {
            e.currentTarget.style.background = variantStyle.hover;
          } else {
            e.currentTarget.style.filter = 'brightness(0.95)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = variantStyle.background;
          e.currentTarget.style.filter = 'brightness(1)';
        }
      }}
    >
      {children}
    </button>
  );
}
