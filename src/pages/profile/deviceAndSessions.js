import { useEffect, useState } from "react";
import { Monitor, Smartphone, ShieldCheck, Clock } from "lucide-react";
import { getSessions } from "../../utils/Functions/getSession"

function formatSessions(apiResponse, historyLimit = 5) {
    if (!apiResponse?.sessions || !Array.isArray(apiResponse.sessions)) {
        return { activeSessions: [], loginHistory: [] };
    }

    const now = Date.now();

    const parseDevice = (ua = "") => {
        const UA = ua.toLowerCase();

        // -------- OS detection --------
        let os = "Unknown OS";
        if (UA.includes("android")) os = "Android";
        else if (UA.includes("iphone") || UA.includes("ipad") || UA.includes("ipod")) os = "iOS";
        else if (UA.includes("windows nt")) os = "Windows";
        else if (UA.includes("mac os x")) os = "macOS";
        else if (UA.includes("linux")) os = "Linux";

        // -------- Browser detection (ORDER MATTERS) --------
        let browser = "Unknown Browser";

        if (UA.includes("edg/")) browser = "Edge";
        else if (UA.includes("firefox/")) browser = "Firefox";
        else if (UA.includes("chrome/") && !UA.includes("edg/")) browser = "Chrome";
        else if (UA.includes("safari/") && !UA.includes("chrome/")) browser = "Safari";

        return `${os} • ${browser}`;
    };


    const timeAgo = (date) => {
        const diff = Math.floor((now - new Date(date).getTime()) / 1000);
        if (diff < 60) return "Just now";
        if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        return new Date(date).toLocaleString();
    };

    const activeSessions = [];
    const loginHistory = [];

    apiResponse.sessions.forEach((s, index) => {
        const base = {
            id: s.id,
            device: parseDevice(s.user_agent),
            ip: s.ip_address,
            location: "Unknown location",
        };

        if (s.revoked === 0) {
            activeSessions.push({
                ...base,
                lastActive: timeAgo(s.sort_time),
                current: index === 0,
            });
        } else {
            loginHistory.push({
                ...base,
                time: new Date(s.sort_time).toLocaleString(),
                status: "Success",
            });
        }
    });

    return {
        activeSessions,
        loginHistory: loginHistory.slice(0, historyLimit),
    };
}

function SessionSkeleton({ rows = 2 }) {
    return (
        <div className="space-y-3 animate-pulse">
            {Array.from({ length: rows }).map((_, i) => (
                <div
                    key={i}
                    className="p-4 border border-[var(--theme)] rounded-lg bg-[var(--gray-50)]"
                >
                    <div className="h-4 w-40 bg-[var(--gray-300)] rounded mb-2" />
                    <div className="h-3 w-64 bg-[var(--gray-200)] rounded mb-1" />
                    <div className="h-3 w-32 bg-[var(--gray-200)] rounded" />
                </div>
            ))}
        </div>
    );
}

export default function DeviceSessions() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeSessions, setActiveSessions] = useState([]);
    const [loginHistory, setLoginHistory] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await getSessions();
                const formatted = formatSessions(res, 5);

                setActiveSessions(formatted.activeSessions);
                setLoginHistory(formatted.loginHistory);
            } catch (err) {
                setError(err.message || "Failed to load sessions");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return (
        <div className="bg-[var(--gray-50)] p-6 space-y-8">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <ShieldCheck size={22} />
                    Device & Login Sessions
                </h1>
                <p className="text-sm text-[var(--gray-600)]">
                    Review where your account is logged in.
                </p>
            </div>

            {/* ACTIVE SESSIONS */}
            <section className="bg-[var(--theme)] rounded-xl shadow p-4">
                <h2 className="text-lg font-semibold mb-4">Active Sessions</h2>

                {loading && <SessionSkeleton rows={2} />}

                {!loading && error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}

                {!loading &&
                    !error &&
                    activeSessions.map((s) => (
                        <div
                            key={s.id}
                            className={`p-4 border rounded-lg flex gap-3 mb-3
              ${s.current
                                    ? "bg-[var(--gray-50)] border-[var(--gray-600)]"
                                    : "bg-[var(--theme)] border-[var(--gray-100)]"
                                }`}
                        >
                            {s.device.includes("Android") ? (
                                <Smartphone size={20} />
                            ) : (
                                <Monitor size={20} />
                            )}

                            <div>
                                <h3 className="font-medium">
                                    {s.device}
                                    {s.current && (
                                        <span className="ml-2 text-xs text-blue-600 font-semibold">
                                            New device login
                                        </span>
                                    )}
                                </h3>
                                <p className="text-sm text-[var(--gray-600)]">
                                    {s.location} • {s.ip}
                                </p>
                                <p className="text-xs text-[var(--gray-500)]">
                                    Last active: {s.lastActive}
                                </p>
                            </div>
                        </div>
                    ))}
            </section>

            {/* LOGIN HISTORY */}
            <section className="bg-[var(--theme)] rounded-xl shadow p-4">
                <h2 className="text-lg font-semibold mb-4">Login History</h2>

                {loading && <SessionSkeleton rows={3} />}

                {!loading &&
                    loginHistory.map((h) => (
                        <div
                            key={h.id}
                            className="p-4 border border-[var(--gray-100)] rounded-lg flex justify-between items-start mb-3"
                        >
                            <div className="flex gap-3">
                                <Clock size={18} />
                                <div>
                                    <h3 className="font-medium">{h.device}</h3>
                                    <p className="text-sm text-[var(--gray-600)]">
                                        {h.location} • {h.ip}
                                    </p>
                                    <p className="text-xs text-[var(--gray-500)]">
                                        {h.time}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold text-green-600">
                                logout {h.status}
                            </span>
                        </div>
                    ))}
            </section>
        </div>
    );
}