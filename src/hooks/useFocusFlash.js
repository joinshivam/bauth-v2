import { useEffect, useRef, useState } from "react";

export function useFocusFlash(targetId, activeTarget, options = {}) {
  const ref = useRef(null);
  const [flashing, setFlashing] = useState(false);

  const duration = options.duration || 1400;
  const autoFocus = !!options.autoFocus;
  const onDone = options.onDone;

  useEffect(() => {
    if (!targetId || !activeTarget || activeTarget !== targetId || !ref.current) return;

    const el = ref.current;

    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });

      if (autoFocus) {
        const input = el.querySelector("input, select, textarea, button");
        input?.focus?.();
      }

      setFlashing(true);
    });

    const timeout = setTimeout(() => {
      setFlashing(false);
      onDone?.();
    }, duration);

    return () => clearTimeout(timeout);
  }, [activeTarget, autoFocus, duration, onDone, targetId]);

  return {
    ref,
    flashing,
    className: flashing ? "focus-flash" : "",
  };
}