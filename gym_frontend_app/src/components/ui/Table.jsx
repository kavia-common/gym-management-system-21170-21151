import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Table: Styled table component with consistent formatting.
 * Props:
 * - headers: Array of header labels (string[])
 * - rows: Array of row data (any[][])
 * - renderRow: Optional custom row renderer function
 * - striped: Enable alternating row colors (boolean)
 * - hoverable: Enable hover effect (boolean)
 */
export default function Table({
  headers = [],
  rows = [],
  renderRow,
  striped = false,
  hoverable = true,
  children,
}) {
  if (children) {
    return (
      <table
        className="table"
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
        }}
      >
        {children}
      </table>
    );
  }

  return (
    <table
      className="table"
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px',
      }}
    >
      {headers.length > 0 && (
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                style={{
                  textAlign: 'left',
                  padding: '12px',
                  borderBottom: '2px solid var(--border)',
                  color: 'var(--muted)',
                  fontWeight: 600,
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {rows.map((row, rowIdx) => (
          <tr
            key={rowIdx}
            style={{
              background: striped && rowIdx % 2 === 1 ? 'var(--hover)' : 'transparent',
              transition: hoverable ? 'background 0.15s ease' : 'none',
            }}
            onMouseEnter={(e) => {
              if (hoverable) e.currentTarget.style.background = 'var(--hover)';
            }}
            onMouseLeave={(e) => {
              if (hoverable && (!striped || rowIdx % 2 === 0)) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {renderRow ? (
              renderRow(row, rowIdx)
            ) : (
              row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  style={{
                    padding: '12px',
                    borderBottom: '1px solid var(--border)',
                    color: 'var(--text)',
                  }}
                >
                  {cell}
                </td>
              ))
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
