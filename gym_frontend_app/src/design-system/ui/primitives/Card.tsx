import React from "react";

/**
 * PUBLIC_INTERFACE
 * DTCard - Design Things Card adapter.
 * Migration note: Consolidates src/components/ui/Card.jsx and src/components/Card.jsx.
 * Prefer importing { Card } from 'src/design-system/ui'.
 */
export type DTCardProps = {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  gradient?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export function DTCard({
  title,
  actions,
  children,
  gradient = false,
  className = "",
  style = {},
}: DTCardProps) {
  return (
    <section
      className={[
        "bg-[var(--dt-surface)] border border-[var(--dt-border)] rounded-[var(--dt-radius)]",
        "shadow-[var(--dt-shadow-sm)] p-5",
        gradient
          ? "bg-[linear-gradient(135deg,_rgba(30,58,138,0.03)_0%,_rgba(245,158,11,0.03)_100%)]"
          : "",
        className,
      ].join(" ")}
      style={style}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--dt-border)]">
          {title ? (
            <h3 className="text-[18px] font-semibold text-[var(--dt-text)] m-0">
              {title}
            </h3>
          ) : (
            <span />
          )}
          {actions ? <div>{actions}</div> : null}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
}

export default DTCard;
