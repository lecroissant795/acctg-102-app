import { theme } from "../styles/theme.js";

const listStyle = {
  margin: 0,
  paddingLeft: 20,
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const itemStyle = {
  paddingLeft: 4,
};

export function ExplanationList({ items, feedback, label = "Explanation", compact = false }) {
  const bullets = (items ?? []).filter(Boolean);
  if (bullets.length === 0 && !feedback) return null;

  const list = (
    <>
      {feedback && (
        <p style={{ margin: compact ? "0 0 6px" : "0 0 8px", color: theme.colors.warning }}>
          {feedback}
        </p>
      )}
      {bullets.length > 0 && (
        <ul style={{ ...listStyle, fontSize: compact ? 12 : 14, color: compact ? theme.colors.textSecondary : theme.colors.text }}>
          {bullets.map((item, index) => (
            <li key={index} style={itemStyle}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  );

  if (compact) {
    return (
      <div style={{ marginTop: 8 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: theme.colors.textSecondary,
            marginBottom: 4,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {label}
        </div>
        {list}
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: 16,
        padding: "14px 16px",
        background: theme.colors.calloutBlue,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.lg,
        color: theme.colors.text,
        fontSize: 14,
        lineHeight: 1.6,
      }}
    >
      <span
        style={{
          display: "block",
          marginBottom: bullets.length > 0 || feedback ? 8 : 0,
          color: theme.colors.textSecondary,
          fontWeight: 500,
          fontSize: 12,
        }}
      >
        {label}
      </span>
      {list}
    </div>
  );
}
