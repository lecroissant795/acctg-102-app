import { theme } from "../styles/theme.js";
import { AppFooter } from "./AppFooter.jsx";

export function Page({ children, padding = "48px 24px 80px", centered = false }) {
  return (
    <div
      className="page-container"
      style={{
        minHeight: "100vh",
        background: theme.colors.bg,
        color: theme.colors.text,
        fontFamily: theme.fonts.sans,
        padding,
      }}
    >
      <div
        style={{
          maxWidth: centered ? 640 : theme.content.maxWidth,
          margin: "0 auto",
        }}
      >
        {children}
        <AppFooter />
      </div>
    </div>
  );
}
