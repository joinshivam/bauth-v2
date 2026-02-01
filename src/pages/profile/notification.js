import { useState } from "react";
import {
    Bell,
    RefreshCw,
    CheckCheck,
    Trash2,
    Filter,
    Dot,
    User,
    AlertCircle,
    MessageCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScreenMode } from "../../utils/Functions/resizer";

const MOCK_NOTIFS = [
    {
        id: 1,
        type: "user_query",
        title: "New user query received",
        message: "User Priyanshu asked a support question.",
        time: "2 min ago",
        read: false,
        route: "?query/9281?user=Priyanshu"
    },
    {
        id: 2,
        type: "system",
        title: "New update installed",
        message: "System patch v1.22 successfully applied.",
        time: "1 hour ago",
        read: true,
        route: null
    },
    {
        id: 3,
        type: "activity",
        title: "New employee added",
        message: "HR added a new employee (Amit Sharma).",
        time: "Yesterday",
        read: false,
        route: null
    }
];

export default function Notifications() {
    const [notifs, setNotifs] = useState(MOCK_NOTIFS);
    const [filter, setFilter] = useState("all");
    const navigate = useNavigate();
    const mode = useScreenMode();
    const isMobile = mode === "mobile";

    const filtered = notifs.filter((n) =>
        filter === "all" ? true : n.type === filter
    );

    const markAllRead = () =>
        setNotifs((ps) => ps.map((n) => ({ ...n, read: true })));

    const deleteOne = (id) =>
        setNotifs((ps) => ps.filter((n) => n.id !== id));

    const refreshList = () => {
        alert("Refreshed notifications (mock)");
    };

    const openNotification = (n) => {
        if (n.route) navigate(n.route);
    };

    const FILTERS = [
        { key: "all", label: "All", icon: <Bell size={16} /> },
        { key: "system", label: "System", icon: <AlertCircle size={16} /> },
        { key: "activity", label: "Activity", icon: <User size={16} /> },
        { key: "user_query", label: "User Queries", icon: <MessageCircle size={16} /> },
    ];
    const isAllMarked = () => {
        return notifs.every(n => n.read === true);
    }

    return (
        <div className="bg-[var(--gray-50)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-6">
                <h1 className="text-2xl font-bold text-[var(--gray-800)] flex items-center gap-2">
                    <Bell size={22} /> Notifications
                </h1>

                <div className="flex gap-2">
                    <button
                        onClick={refreshList}
                        className="flex items-center gap-2 bg-[var(--gray-100)] text-[var(--gray-400)] hover:bg-[var(--gray-200)] px-3 py-2 rounded-lg"
                    >
                        <RefreshCw size={16} /> Refresh
                    </button>
                    <button
                        onClick={markAllRead}
                        className={`flex items-center relative gap-2 bg-[var(--blue-600)] text-[var(--theme)] hover:bg-[var(--blue-700)] px-3 py-2 rounded-lg ${isAllMarked() ? "bg-[var(--blue-700)] text-[var(--gray-300)]" : ""}`}
                    >
                        {!isAllMarked() && (
                            <Dot className="absolute  rounded-full -top-0 shadow-sm -right-0 " />
                        )}
                        <CheckCheck size={16} /> Mark All Read
                    </button>
                </div>
            </div>

            {/* FILTERS */}
            <div className={`bg-[--(theme)] shadow shadow-[var(--border)] rounded-xl mb-4 flex overflow-x-auto ${isMobile ? "gap-2 p-3" : "gap-3"}`}>
                <Filter size={16} className="text-[var(--gray-600)] mt-3" />
                <div className={`flex flex-wrap ${isMobile ? "p-1 gap-2 flex-wrap" : "p-4 gap-3"}`}>
                    {FILTERS.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`flex items-center gap-2 ${isMobile ? "px-2 py-1" : "px-3 py-1.5"} rounded-lg text-sm border border-[var(--border)]
                        ${filter === f.key
                                    ? "bg-[var(--blue-600)] text-[var(--theme)] border-[var(--blue-600)]"
                                    : "bg-[var(--gray-100)] border-[var(--border)] text-[var(--gray-700)] hover:bg-[var(--gray-200)]"
                                }`}
                        >
                            {f.icon} {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* NOTIFICATION LIST */}
            <div className="bg-[var(--theme)] overflow-y-scroll scrollbar-hide shadow shadow-[var(--border)] rounded-xl p-4">
                {filtered.length === 0 && (
                    <p className="text-center text-[var(--gray-500)] py-6">No notifications found.</p>
                )}

                <div className="space-y-4">
                    {filtered.map((n) => (
                        <div
                            key={n.id}
                            onClick={() => {
                                openNotification(n);
                            }}
                            className={`p-4 border border-[var(--border)] rounded-lg flex justify-between items-start cursor-pointer 
                            ${!n.read ? "bg-[var(--gray-50)]" : "bg-[var(--theme)] hover:bg-[var(--gray-50)]"}`}
                        >
                            <div>
                                <h3 className="font-semibold text-[var(--gray-800)]">{n.title}</h3>
                                <p className="text-[var(--gray-600)] text-sm">{n.message}</p>
                                <span className="text-xs text-[var(--gray-500)]">{n.time}</span>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteOne(n.id);
                                }}
                                className="p-2 rounded hover:bg-red-50 text-[var(--brand-pinkorange)]"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
