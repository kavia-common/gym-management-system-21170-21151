import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Card: Generic container with header and actions slot.
 */
export default function Card({ title, children, actions }) {
  return (
    <section className="card">
      {(title || actions) && (
        <div className="card-header">
          <div className="card-title">{title}</div>
          <div>{actions}</div>
        </div>
      )}
      <div>{children}</div>
    </section>
  );
}
