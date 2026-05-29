import { useEffect } from "react";
import { triggerMobileClickSound } from "../utils/mobileClickSound.js";

export function useMobileClickSound() {
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (event.pointerType === "mouse" && event.buttons !== 1) return;
      void triggerMobileClickSound(event);
    };

    document.addEventListener("pointerdown", handlePointerDown, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, []);
}
