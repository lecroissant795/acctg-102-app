import { theme } from "../styles/theme.js";
import { SoundSettingsControls } from "./SoundSettingsControls.jsx";
import { ThemeToggleSwitch } from "./ThemeToggle.jsx";

export function AppFooter({ showAttribution = false }) {
  return (
    <footer className="app-footer">
      <div className="app-footer__settings">
        <ThemeToggleSwitch />
        <SoundSettingsControls />
      </div>
      {showAttribution && (
        <span className="app-footer__attribution" style={{ color: theme.colors.textTertiary }}>
          Built by Tom Nguyen 🥐
        </span>
      )}
    </footer>
  );
}
