import { useState, useEffect, useContext, createContext } from "react";
import { postSync, listenSync } from "../utils/crossTab";
import api from "../lib/services/api";
import { clearAccountCenterGrant } from "../utils/accountCenterFlow";
const AuthContext = createContext();


export function usernameTOurl(input) {
    if (!input) return "";
    const username = input
        .split("@")[0]
        .toString()
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
    return username
}
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [activeUser, setActiveUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const isLoggedIn = !!user;
    const USERNAME = "u";

    useEffect(() => {
        const initAuth = async () => {
            setLoading(true);
            try {
                const data = await api.get("/auth");
                if (!data?.user?.username || !data?.success || !data?.sessionId) {
                    setUser(null);
                    setActiveUser(null);
                    return;
                }
                setActiveUser(data?.sessionId);
                setUser(data?.user);
            } catch {
                setUser(null);
                setActiveUser(null);
            } finally {
                setTimeout(() => setLoading(false), 500);
            }
        };
        initAuth();
        const unsubscribe = listenSync(async ({ type }) => {
            if (type === "LOGIN" || type === "LOGOUT" || type === "SWITCH_ACCOUNT" || type === "REMOVE_ACCOUNT") {
                try {
                    if (type === "LOGOUT" || type === "REMOVE_ACCOUNT") {
                        // clearAccountCenterGrant();
                    }
                    const data = await api.get("/auth");
                    const activeUser = data?.user || null;
                    setUser(activeUser || null);
                    setActiveUser(data?.sessionId || null);
                } catch {
                    setUser(null);
                    setActiveUser(null);
                }
            }
        });
        return unsubscribe;
    }, []);

    const login = async ({ username, password }) => {
        try {
            const value = username.trim().toLowerCase();
            const data = await api.post("/auth/signin", {
                username: value.split("@")[0], password
            });

            setUser(data?.user);
            setActiveUser(data?.sessionId || null);
            postSync({ type: "LOGIN" });
            return {
                success: true,
                field: "global",
                msg: "Signin Successful!",
                sessionId: data?.sessionId || null,
                user: data?.user || null
            };
        } catch (err) {
            return {
                success: false,
                field: "global",
                msg: err?.message
            };
        }
    };
    const signup = async ({ name, dob, gender, username, password, aggrement }) => {
        try {
            const data = await api.post("/auth/signup", { name, dob, gender, username, password, aggrement });
            setUser(data?.user);
            setActiveUser(data?.sessionId || null);
            postSync({ type: "LOGIN" });
            return {
                success: true,
                field: "global",
                msg: "Signup Successful!",
                sessionId: data?.sessionId || null,
                user: data?.user || null
            };
        } catch (err) {
            return { success: false, field: "global", msg: err?.message };
        }
    };
    const logout = async () => {
        setLoading(true);
        try {
            await api.post("/user/logout");
            // clearAccountCenterGrant();
            try {
                const data = await api.get("/auth");
                setUser(data?.user || null);
                setActiveUser(data?.sessionId || null);
            } catch {
                setUser(null);
                setActiveUser(null);
            }
            postSync({ type: "LOGOUT" });
        } finally {
            setLoading(false);
        }
    };
    const switchAccount = async (sessionId) => {
        await api.post("/user/switch", { sessionId });
        const data = await api.get("/auth");
        setUser(data?.user || null);
        setActiveUser(data?.sessionId || null);
        postSync({ type: "SWITCH_ACCOUNT" });
    }
    const removeAccount = async (sessionId) => {
        await api.post("/user/remove", { sessionId });
        clearAccountCenterGrant();
        try {
            const data = await api.get("/auth");
            setUser(data?.user || null);
            setActiveUser(data?.sessionId || null);
        } catch {
            setUser(null);
            setActiveUser(null);
        }
        postSync({ type: "REMOVE_ACCOUNT" });
    }

    return (
        <AuthContext.Provider value={{ user, USERNAME, isLoggedIn, loading, activeUser, setLoading, setActiveUser, setUser, login, signup, logout, switchAccount, removeAccount }}>
            {children}
        </AuthContext.Provider>
    );
}
export function useAuth() {
    return useContext(AuthContext);
}
