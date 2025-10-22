import React from "react";

/**
 * PUBLIC_INTERFACE
 * DTButton - Design Things Button adapter
 * Props similar to our previous Button component to ease migration.
 * Migration note: Replaces previous 'btn' class usage. Prefer importing from 'src/design-system/ui'.
 */
export type DTButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "success" | "error";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: React.CSSProperties;
};

const sizeClass: Record<NonNullable<DTButtonProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-[13px]",
  md: "px-4 py-2 text-[14px]",
  lg: "px-5 py-2.5 text-[16px]",
};

const variantClass: Record<NonNullable<DTButtonProps["variant"]>, string> = {
  primary:
    "bg-[var(--dt-primary)] text-white hover:brightness-95 border border-transparent",
  secondary:
    "bg-[var(--dt-secondary)] text-gray-900 hover:brightness-95 border border-transparent",
  ghost:
    "bg-transparent text-[var(--dt-primary)] border border-[var(--dt-primary)] hover:bg-[color:var(--dt-primary)_/_0.06]",
  success:
    "bg-[var(--dt-success)] text-white hover:brightness-95 border border-transparent",
  error:
    "bg-[var(--dt-error)] text-white hover:brightness-95 border border-transparent",
};

export function DTButton({
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  onClick,
  children,
  type = "button",
  className = "",
  style = {},
}: DTButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-[var(--dt-radius)] font-medium",
        "shadow-[var(--dt-shadow-sm)] transition-all",
        sizeClass[size],
        variantClass[variant],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      style={style}
    >
      {children}
    </button>
  );
}

export default DTButton;
