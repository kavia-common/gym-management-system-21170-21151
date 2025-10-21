/**
 * PUBLIC_INTERFACE
 * Ocean Professional Theme Tokens
 * Color palette, spacing, and design system values for consistent styling
 */
export const colors = {
  primary: '#1E3A8A',      // blue-900
  secondary: '#F59E0B',    // amber-600
  success: '#059669',      // emerald-600
  error: '#DC2626',        // red-600
  background: '#F3F4F6',   // gray-100
  surface: '#FFFFFF',
  text: '#111827',         // gray-900
  muted: '#6B7280',        // gray-500
  border: '#E5E7EB',       // gray-200
  hover: '#F9FAFB',        // gray-50
};

export const gradients = {
  accent: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
  card: 'linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(249, 250, 251, 1) 100%)',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
};

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0 4px 12px rgba(0, 0, 0, 0.08)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
};

export const radius = {
  sm: '6px',
  md: '8px',
  lg: '12px',
  full: '9999px',
};

export const typography = {
  fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  fontSizeXs: '12px',
  fontSizeSm: '14px',
  fontSizeBase: '16px',
  fontSizeLg: '18px',
  fontSizeXl: '20px',
  fontSize2xl: '24px',
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const theme = {
  colors,
  gradients,
  spacing,
  shadows,
  radius,
  typography,
};

export default theme;
