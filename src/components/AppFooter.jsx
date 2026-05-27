import { theme } from "../styles/theme.js";
import { ThemeToggleSwitch } from "./ThemeToggle.jsx";

export function AppFooter({ showAttribution = false }) {
  return (
    <footer className="app-footer">
      <ThemeToggleSwitch />
      {showAttribution && (
        <span className="app-footer__attribution" style={{ color: theme.colors.textTertiary }}>
          Built by Tom Nguyen
        </span>
      )}
    </footer>
  );
}
