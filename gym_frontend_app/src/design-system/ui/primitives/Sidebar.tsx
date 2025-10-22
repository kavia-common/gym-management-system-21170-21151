import React from "react";
import { NavLink } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * DTSidebar - Design Things Sidebar primitives composed for this app.
 * Usage: import { Sidebar } from 'src/design-system/ui'
 */
export type DTSidebarProps = {
  groups: Array<{
    label?: string;
    items: Array<{ to: string; label: string; end?: boolean }>;
  }>;
  className?: string;
  style?: React.CSSProperties;
};

export function DTSidebar({ groups, className = "", style = {} }: DTSidebarProps) {
  return (
    <aside
      className={[
        "bg-[var(--dt-surface)] border-r border-[var(--dt-border)] h-full p-4",
        className,
      ].join(" ")}
      style={style}
      aria-label="Sidebar Navigation"
    >
      <nav>
        {groups.map((group, gi) => (
          <div key={gi} className="mb-6">
            {group.label ? (
              <div className="text-[12px] text-[var(--dt-muted)] mb-2 uppercase tracking-wide font-semibold">
                {group.label}
              </div>
            ) : null}
            <ul className="m-0 p-0 list-none">
              {group.items.map((item, ii) => (
                <li key={ii}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      [
                        "block px-3 py-2 rounded-[8px] mb-1 transition-colors",
                        isActive
                          ? "bg-[var(--dt-primary)]/10 text-[var(--dt-primary)]"
                          : "hover:bg-[var(--dt-primary)]/5",
                      ].join(" ")
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default DTSidebar;
