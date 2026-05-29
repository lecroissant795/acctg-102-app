import { useEffect, useState } from "react";
import { NAV_CLICK_SOUND_PROPS } from "../constants/clickSound.js";
import { useNavigation } from "../contexts/NavigationContext.jsx";
import { AppNavMenu } from "./AppNavMenu.jsx";
import { SidebarDivider } from "./AppShell.jsx";

export function MobileMenu() {
  const nav = useNavigation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  const goHome = () => {
    nav.onHome();
    closeMenu();
  };

  return (
    <>
      <button
        type="button"
        className="mobile-menu-btn"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu-drawer"
        onClick={() => setOpen(true)}
      >
        <span className="mobile-menu-btn__bar" />
        <span className="mobile-menu-btn__bar" />
        <span className="mobile-menu-btn__bar" />
      </button>

      {open && (
        <>
          <button
            type="button"
            className="mobile-menu-backdrop"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <aside
            id="mobile-menu-drawer"
            className="mobile-menu-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="mobile-menu-drawer__header">
              <button type="button" className="mobile-menu-home" onClick={goHome} {...NAV_CLICK_SOUND_PROPS}>
                <span aria-hidden="true">📒</span>
                <span>
                  <span className="mobile-menu-home__title">ACCTG 102</span>
                  <span className="mobile-menu-home__subtitle">Exam Prep</span>
                </span>
              </button>
              <button
                type="button"
                className="mobile-menu-close"
                aria-label="Close menu"
                onClick={closeMenu}
              >
                ×
              </button>
            </div>

            <SidebarDivider />

            <div className="mobile-menu-drawer__content">
              <AppNavMenu {...nav} onNavigate={closeMenu} />
            </div>
          </aside>
        </>
      )}
    </>
  );
}
