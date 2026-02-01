import { useState, useEffect, useContext, createContext } from "react";
import { listenSync, postSync } from "../utils/crossTab";

const ThemeContext = createContext();
const STORAGE_KEY = "theme-mode";

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(
        () => localStorage.getItem(STORAGE_KEY) || "system"
    );

    const isDark =
        theme === "dark" ||
        (theme === "system" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);
            
    useEffect(() => {
        const appliedTheme = isDark ? "dark" : "light";

        document.documentElement.setAttribute("data-theme", appliedTheme);

        if (theme !== "system") {
            localStorage.setItem(STORAGE_KEY, theme);
        }
    }, [theme, isDark]);

    useEffect(() => {
        const unsubscribe = listenSync((event) => {
            if (event.type === "THEME") {
                setTheme(event.value);
            }
        });
        return unsubscribe;
    }, []);

    const toggleTheme = () => {
        setTheme(prev => {
            const next = prev === "dark" ? "light" : "dark";
            postSync({ type: "THEME", value: next });
            return next;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
