import { createContext, useContext, useState } from "react";

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
    const [open, setOpen] = useState(false);

    const toggle = () => setOpen(prev => !prev);
    const openSidebar = () => setOpen(true);
    const closeSidebar = () => setOpen(false);

    return (
        <SidebarContext.Provider
            value={{ open, toggle, openSidebar, closeSidebar }}
        >
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const ctx = useContext(SidebarContext);
    if (!ctx) throw new Error("useSidebar must be used inside SidebarProvider");
    return ctx;
}
