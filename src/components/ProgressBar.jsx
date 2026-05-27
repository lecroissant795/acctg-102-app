import { theme } from "../styles/theme.js";

export function ProgressBar({ current, total }) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div
      style={{
        width: "100%",
        height: 4,
        borderRadius: 2,
        background: theme.colors.bgTertiary,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: theme.colors.accent,
          borderRadius: 2,
          transition: "width 0.4s cubic-bezier(.4,0,.2,1)",
        }}
      />
    </div>
  );
}
