const STORAGE_KEY = "theme-mode";

export function getThemeMode() {
    const storedTheme = localStorage.getItem(STORAGE_KEY) || "system";
    console.log("storedTheme = "+storedTheme);
    return storedTheme;
}

export function getSystemTheme() {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    // console.log("storedTheme = "+systemTheme);
    return systemTheme;
}

export function resolveTheme(mode) {
    const themeMode = mode === "system" ? getSystemTheme() : mode;
    console.log("finalTheme = "+themeMode);
    return themeMode;
}

export function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    // localStorage.setItem(STORAGE_KEY , theme);
    // console.log("appliedTheme = "+theme);
}

export function setThemeMode(mode) {
    localStorage.setItem(STORAGE_KEY, mode);
    applyTheme(resolveTheme(mode));
    console.log("manualThemeSet = "+mode);
}
