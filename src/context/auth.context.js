import { useState, useEffect, useRef, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { postSync, listenSync } from "../utils/crossTab";

const AuthContext = createContext();
const API_BASE = process.env.REACT_APP_API_BASE;


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
    const [loading, setLoading] = useState(true);
    const hasHydrated = useRef(false);


    const navigate = useNavigate();

    const isLoggedIn = !!user;
    const USERNAME = user ? usernameTOurl(user.username) : "";

    useEffect(() => {
        const unsubscribe = listenSync(({ type }) => {
            if (type === "LOGOUT") {
                setUser(null);
                navigate("/login");
            }

            if (type === "LOGIN") {
                initAuth();
            }
        });

        return unsubscribe;
    }, [navigate]);

    const initAuth = async () => {
        if (hasHydrated.current) return;
        try {
            const res = await fetch(`${API_BASE}/api/auth/me`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });
            if (!res?.ok) throw new Error("unauthorized");

            const data = await res.json();
            setUser(data.user || null);
            hasHydrated.current = true;
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initAuth();
    }, []);
    const login = async (identifier, password) => {
        try {
            const value = identifier.trim().toLowerCase();

            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: value.split("@")[0],
                    password
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    field: data?.field || "global",
                    message: data?.msg || "Login failed"
                };
            }

            setUser(data.user);
            postSync({ type: "LOGIN" });
            navigate(`/${usernameTOurl(data.user.username)}`);

            return { success: true };
        } catch (err) {
            console.log("error login")
            return {
                success: false,
                field: "global",
                message: err.message
            };
        }
    };
    const isUserExist = async (username) => {
        const res = await fetch(`${API_BASE}/api/auth/username-check`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username })
        });
        const data = await res.json();
        return data;
    }
    const isUser = async (username) => {
        const res = await fetch(`${API_BASE}/api/auth/username`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username })
        });
        const data = await res.json();
        return data;
    }
    const signup = async (name, dob, gender, username, password, aggrement) => {
        try {
            const res = await fetch(`${API_BASE}/api/auth/signup`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ name, dob, gender, username, password, aggrement }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "unable to create new account");
            };
            setUser(data?.user);
            console.log(data?.user.username, data, usernameTOurl(data?.user.username));
            setUser(data.user);
            postSync({ type: "LOGIN" });
            // navigate(`/${usernameTOurl(data.user.username)}`);

            return { success: true };
        } catch (err) {
            return { success: false, feild: "global", message: err.message };
        }
    };
    const logout = async () => {
        setLoading(true);
        try {
            await fetch(`${API_BASE}/api/auth/logout`, {
                method: "POST",
                credentials: "include"
            });
        } finally {
            setUser(null);
            setLoading(false);
            postSync({ type: "LOGOUT" });
        }
    };

    return (
        <AuthContext.Provider
            value={{
                API_BASE,
                user,
                setUser,
                isLoggedIn,
                USERNAME,
                signup,
                loading,
                setLoading,
                isUserExist,
                isUser,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}