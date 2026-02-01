import { useEffect, useState } from "react";

export function useScreenMode() {
    const getMode = () => {
        const w = window.innerWidth;
        if (w < 600) return "mobile";
        if (w <= 800) return "tablet";
        return "desktop";
    };

    const [mode, setMode] = useState(getMode());

    useEffect(() => {
        const onResize = () => setMode(getMode());
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    return mode;
}
