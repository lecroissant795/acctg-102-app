import { useTheme } from "../contexts/ThemeContext.jsx";

export function ThemeToggleSwitch() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <label className="theme-switch">
      <span className="theme-switch__label">Dark mode</span>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className="theme-switch__track"
        onClick={toggleTheme}
      >
        <span className="theme-switch__icon theme-switch__icon--light" aria-hidden="true">
          ☀️
        </span>
        <span className="theme-switch__thumb" aria-hidden="true" />
        <span className="theme-switch__icon theme-switch__icon--dark" aria-hidden="true">
          🌙
        </span>
      </button>
    </label>
  );
}
