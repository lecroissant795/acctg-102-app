import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { NAV_CLICK_SOUND_PROPS } from "../constants/clickSound.js";
import { AppFooter } from "./AppFooter.jsx";
import { theme } from "../styles/theme.js";

const SidebarContext = createContext(null);

const STORAGE_KEY = "acctg-sidebar-width";
const COLLAPSED_STORAGE_KEY = "acctg-sidebar-collapsed";
const { width: DEFAULT_WIDTH, minWidth: MIN_WIDTH, maxWidth: MAX_WIDTH } = theme.sidebar;

function readCollapsed() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(COLLAPSED_STORAGE_KEY) === "true";
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function readStoredWidth() {
  if (typeof window === "undefined") return DEFAULT_WIDTH;
  const stored = Number(localStorage.getItem(STORAGE_KEY));
  return Number.isFinite(stored) ? clamp(stored, MIN_WIDTH, MAX_WIDTH) : DEFAULT_WIDTH;
}

function useSidebarWidth() {
  const [width, setWidth] = useState(readStoredWidth);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (!isResizing) return undefined;

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  const persistWidth = useCallback((nextWidth) => {
    const clamped = clamp(nextWidth, MIN_WIDTH, MAX_WIDTH);
    setWidth(clamped);
    localStorage.setItem(STORAGE_KEY, String(clamped));
    return clamped;
  }, []);

  const startResize = useCallback((event) => {
    event.preventDefault();
    setIsResizing(true);

    const startX = event.clientX;
    const startWidth = width;

    const handleMove = (moveEvent) => {
      setWidth(clamp(startWidth + (moveEvent.clientX - startX), MIN_WIDTH, MAX_WIDTH));
    };

    const handleUp = () => {
      setIsResizing(false);
      setWidth((current) => {
        localStorage.setItem(STORAGE_KEY, String(current));
        return current;
      });
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  }, [width]);

  const resetWidth = useCallback(() => {
    persistWidth(DEFAULT_WIDTH);
  }, [persistWidth]);

  return { width, isResizing, startResize, resetWidth };
}

function SidebarToggleButton({ expanded, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={expanded}
      className="sidebar-toggle-btn"
      title={label}
    >
      {expanded ? "‹" : "›"}
    </button>
  );
}

export function SidebarCollapseButton() {
  const context = useContext(SidebarContext);
  if (!context) return null;

  return (
    <SidebarToggleButton
      expanded
      onClick={context.toggleCollapsed}
      label="Collapse sidebar"
    />
  );
}

export function AppShell({ sidebar, children, footerAttribution = false }) {
  const { width, isResizing, startResize, resetWidth } = useSidebarWidth();
  const [collapsed, setCollapsed] = useState(readCollapsed);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem(COLLAPSED_STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  const sidebarWidth = collapsed ? 0 : width;
  const sidebarContext = { collapsed, toggleCollapsed };

  return (
    <SidebarContext.Provider value={sidebarContext}>
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: theme.colors.bg,
        fontFamily: theme.fonts.sans,
        color: theme.colors.text,
      }}
    >
      <aside
        data-app-sidebar
        data-collapsed={collapsed ? "true" : "false"}
        style={{
          width: sidebarWidth,
          flexShrink: 0,
          background: theme.colors.bgSecondary,
          borderRight: collapsed ? "none" : `1px solid ${theme.colors.border}`,
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          transition: isResizing ? "none" : "width 0.2s ease, border 0.2s ease",
        }}
      >
        <div
          className="sidebar-inner"
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minWidth: width,
            opacity: collapsed ? 0 : 1,
            transition: "opacity 0.15s ease",
            pointerEvents: collapsed ? "none" : "auto",
          }}
        >
          {sidebar}
        </div>
      </aside>

      {!collapsed && (
        <div
          data-sidebar-resize
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize sidebar"
          aria-valuemin={MIN_WIDTH}
          aria-valuemax={MAX_WIDTH}
          aria-valuenow={width}
          onMouseDown={startResize}
          onDoubleClick={resetWidth}
          className={`sidebar-resize-handle${isResizing ? " is-resizing" : ""}`}
          title="Drag to resize sidebar · Double-click to reset"
        />
      )}

      <main
        data-app-main
        style={{
          flex: 1,
          minWidth: 0,
          overflowY: "auto",
          padding: "32px 24px 64px",
          position: "relative",
        }}
      >
        {collapsed && (
          <div className="sidebar-expand-bar">
            <SidebarToggleButton
              expanded={false}
              onClick={toggleCollapsed}
              label="Expand sidebar"
            />
          </div>
        )}
        <div style={{ maxWidth: theme.content.maxWidth, margin: "0 auto" }}>
          {children}
          <AppFooter showAttribution={footerAttribution} />
        </div>
      </main>
    </div>
    </SidebarContext.Provider>
  );
}

export function SidebarSection({ label, children }) {
  return (
    <div style={{ marginBottom: 8 }}>
      {label && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: theme.colors.textTertiary,
            padding: "4px 12px 6px",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

export function SidebarItem({
  icon,
  label,
  badge,
  active = false,
  disabled = false,
  onClick,
  indent = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...NAV_CLICK_SOUND_PROPS}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: indent ? "4px 12px 4px 28px" : "4px 12px",
        background: active ? theme.colors.bgActive : "transparent",
        border: "none",
        borderRadius: theme.radius.md,
        color: disabled ? theme.colors.textTertiary : theme.colors.text,
        fontSize: 14,
        fontWeight: active ? 500 : 400,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        textAlign: "left",
        transition: "background 0.1s",
        margin: "1px 8px",
        width: "calc(100% - 16px)",
      }}
      onMouseEnter={(e) => {
        if (!disabled && !active) e.currentTarget.style.background = theme.colors.bgHover;
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = active ? theme.colors.bgActive : "transparent";
      }}
    >
      {icon && (
        <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0, width: 20, textAlign: "center" }}>
          {icon}
        </span>
      )}
      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {label}
      </span>
      {badge != null && (
        <span
          style={{
            fontSize: 11,
            color: theme.colors.textTertiary,
            flexShrink: 0,
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export function SidebarDivider() {
  return (
    <div
      style={{
        height: 1,
        background: theme.colors.border,
        margin: "8px 12px",
      }}
    />
  );
}
