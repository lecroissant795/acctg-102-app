export const theme = {
  colors: {
    bg: "var(--color-bg)",
    bgSecondary: "var(--color-bg-secondary)",
    bgTertiary: "var(--color-bg-tertiary)",
    bgHover: "var(--color-bg-hover)",
    bgActive: "var(--color-bg-active)",
    border: "var(--color-border)",
    borderStrong: "var(--color-border-strong)",
    text: "var(--color-text)",
    textSecondary: "var(--color-text-secondary)",
    textTertiary: "var(--color-text-tertiary)",
    accent: "var(--color-accent)",
    accentBg: "var(--color-accent-bg)",
    accentBorder: "var(--color-accent-border)",
    success: "var(--color-success)",
    successBg: "var(--color-success-bg)",
    successBorder: "var(--color-success-border)",
    error: "var(--color-error)",
    errorBg: "var(--color-error-bg)",
    errorBorder: "var(--color-error-border)",
    warning: "var(--color-warning)",
    warningBg: "var(--color-warning-bg)",
    warningBorder: "var(--color-warning-border)",
    calloutBlue: "var(--color-callout-blue)",
    calloutOrange: "var(--color-callout-orange)",
    calloutGreen: "var(--color-callout-green)",
    buttonPrimaryBg: "var(--color-button-primary-bg)",
    buttonPrimaryText: "var(--color-button-primary-text)",
  },
  fonts: {
    sans: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif',
  },
  radius: {
    sm: 3,
    md: 4,
    lg: 6,
    pill: 999,
  },
  sidebar: {
    width: 240,
    minWidth: 180,
    maxWidth: 420,
  },
  content: {
    maxWidth: 900,
  },
};

export const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  background: theme.colors.bg,
  border: `1px solid ${theme.colors.borderStrong}`,
  borderRadius: theme.radius.md,
  color: theme.colors.text,
  fontSize: 14,
  outline: "none",
  fontFamily: theme.fonts.sans,
  transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s, color 0.15s",
};

export const cardStyle = {
  background: theme.colors.bg,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.lg,
  padding: "12px 14px",
};

export const sectionLabelStyle = {
  fontSize: 12,
  fontWeight: 500,
  color: theme.colors.textSecondary,
  marginBottom: 4,
  paddingLeft: 2,
};

export const pageTitleStyle = {
  fontSize: 40,
  fontWeight: 700,
  margin: 0,
  color: theme.colors.text,
  letterSpacing: "-0.02em",
  lineHeight: 1.2,
};

export const backButtonStyle = {
  background: "none",
  border: "none",
  color: theme.colors.textSecondary,
  cursor: "pointer",
  fontSize: 14,
  padding: "4px 8px",
  borderRadius: theme.radius.md,
  fontFamily: theme.fonts.sans,
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
};
