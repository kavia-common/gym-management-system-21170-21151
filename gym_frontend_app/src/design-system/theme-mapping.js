/**
 * PUBLIC_INTERFACE
 * Design Things Theme Mapping
 * Provides a mapping layer between the existing src/styles/theme.js tokens and
 * Design Things token names/variables. Use this module to read unified tokens.
 */
import baseTheme from "../styles/theme";

export const dtTokens = {
  // Colors
  primary: "var(--dt-primary)",
  secondary: "var(--dt-secondary)",
  success: "var(--dt-success)",
  error: "var(--dt-error)",
  background: "var(--dt-background)",
  surface: "var(--dt-surface)",
  text: "var(--dt-text)",
  muted: "var(--dt-muted)",
  border: "var(--dt-border)",
  // Effects
  radius: "var(--dt-radius)",
  shadowSm: "var(--dt-shadow-sm)",
  shadowMd: "var(--dt-shadow-md)",
  shadowLg: "var(--dt-shadow-lg)",
};

// PUBLIC_INTERFACE
export function getDesignThingsTheme() {
  /** Return a merged theme view combining historical theme tokens with DT tokens. */
  return {
    ...baseTheme,
    dt: dtTokens,
  };
}

export default getDesignThingsTheme;
