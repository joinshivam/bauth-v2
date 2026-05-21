const STORAGE_KEY = "theme-mode";

export function getThemeMode() {
    const storedTheme = localStorage.getItem(STORAGE_KEY) || "system";
    return storedTheme;
}

export function getSystemTheme() {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    return systemTheme;
}

export function resolveTheme(mode) {
    const themeMode = mode === "system" ? getSystemTheme() : mode;
    return themeMode;
}

export function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
}

export function setThemeMode(mode) {
    localStorage.setItem(STORAGE_KEY, mode);
    applyTheme(resolveTheme(mode));
}
