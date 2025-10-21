import React from 'react';

/**
 * PUBLIC_INTERFACE
 * StatWidget: Display a key metric with optional icon, label, value, and change indicator.
 * Props:
 * - label: Metric label (string)
 * - value: Main value to display (string | number)
 * - icon: Icon element or emoji (React node)
 * - delta: Change value (string, e.g., "+12%" or "-5%")
 * - deltaType: 'positive' | 'negative' | 'neutral'
 * - bgColor: Background color for icon area
 */
export default function StatWidget({
  label,
  value,
  icon,
  delta,
  deltaType = 'neutral',
  bgColor = 'rgba(30, 58, 138, 0.08)',
}) {
  const deltaColor =
    deltaType === 'positive' ? 'var(--success)' :
    deltaType === 'negative' ? 'var(--error)' :
    'var(--muted)';

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 500 }}>
          {label}
        </div>
        {icon && (
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}
          >
            {icon}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text)' }}>
          {value}
        </div>
        {delta && (
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: deltaColor,
            }}
          >
            {delta}
          </div>
        )}
      </div>
    </div>
  );
}
