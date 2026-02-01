import { nanoid } from "nanoid";
import { useState, createContext, useContext } from "react"

const NotifyContext = createContext();
const MAX_NOTIFICATIONS = 5;
const EXIT_ANIMATION_TIME = 300;
const DEFAULTS = {
    duration: 3000,
    progressBar: true,
    type: "info",
    title: ""
}

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const notify = (data) => {
        const id = nanoid();
        const ITEM = {
            ...DEFAULTS,
            ...data,
            id,
            closing: false,
        }
        setNotifications(prev => {
            let updated = [...prev, ITEM];
            if (updated.length > MAX_NOTIFICATIONS) {
                updated[0] = { ...updated[0], closing: true };
                setTimeout(() => {
                    setNotifications(p => p.filter(n => n.id !== updated[0].id));
                }, EXIT_ANIMATION_TIME);

                updated = updated.slice(1);
            }

            return updated;
        });
        if (ITEM.duration > 0) {
            setTimeout(() => remove(id), ITEM.duration);
        }
    };

    const remove = (id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, closing: true } : n)
        );

        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, EXIT_ANIMATION_TIME);
    };
    return (
        <NotifyContext.Provider value={{ notifications, notify, remove }}>
            {children}
        </NotifyContext.Provider>
    );
}

export function useNotify() {
    return useContext(NotifyContext);
}