import { useCallback, useEffect, useMemo, useState } from "react";
import { parseRoute, ROUTES } from "../routes.js";

export function useAppRouter() {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const route = useMemo(() => parseRoute(pathname), [pathname]);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((path, { replace = false } = {}) => {
    const nextPath = path || ROUTES.home;
    if (nextPath === window.location.pathname) {
      setPathname(nextPath);
      return;
    }

    if (replace) {
      window.history.replaceState(null, "", nextPath);
    } else {
      window.history.pushState(null, "", nextPath);
    }
    setPathname(nextPath);
  }, []);

  return {
    pathname,
    route,
    navigate,
  };
}
