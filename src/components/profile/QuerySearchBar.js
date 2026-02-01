import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";

const DUMMY_RESULTS = [
    { title: "Login history", page: "sessions?qrs=loginHistory&", solution: "Login_history" },
    { title: "View Login history", page: "security?qrs=viewloginHistory&", solution: "View_Login_history" },
    { title: "View Active Sessions", page: "security?qrs=viewActiveSessions&", solution: "View_Active_Sessions" },
    { title: "Active sessions", page: "sessions?qrs=activeSessions&", solution: "Active_Sessions" },
    { title: "Logout All Devices", page: "security?qrs=logoutall&", solution: "Logout_From_Everywhere" },
    { title: "Change profile photo", page: "profile?qrs=updatePhoto&", solution: "Update_Avatar" },
    { title: "Change Name", page: "profile?qrs=updateName&", solution: "Update_Name" },
    { title: "Change Username", page: "profile?qrs=updateUsername&", solution: "Update_Username" },
    { title: "Change Date of Birth", page: "profile?qrs=updateDOB&", solution: "Update_DOB" },
    { title: "Change Gender", page: "profile?qrs=updateGender&", solution: "Update_Gender" },
    { title: "Change Phone number", page: "profile?qrs=updatePhone&", solution: "Update_Phone_Number" },
    { title: "View Email", page: "profile?qrs=viewEmail&", solution: "Contact_Info_Email" },
    { title: "View Account ID", page: "profile?qrs=accountId&", solution: "View_Account_Details" },
    { title: "Join date", page: "profile?qrs=joinDate&", solution: "View_Account_Details" },
    { title: "Home Page", page: "?", solution: "on-logo-click" },
    { title: "main page", page: "exit", solution: "direct" },

];

export default function QuerySearchBar({ h = "h-[37px]" }) {
    const { USERNAME } = useAuth();
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const [active, setActive] = useState(false);
    const [query, setQuery] = useState("");

    const results = DUMMY_RESULTS.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (item) => {
        if (item.page === "exit") {
            navigate("/");
            return;
        }
        navigate(
            `/${USERNAME}/${item.page}q=${encodeURIComponent(query)}&solution=${item.solution}`
        );
        reset();
    };

    const reset = () => {
        setActive(false);
        setExpanded(false);
        setQuery("");
    };

    const handleFocus = () => {
        setExpanded(true);
        requestAnimationFrame(() => setActive(true));
    };

    const handleBlur = () => {
        setTimeout(reset, 150);
    };

    return (
        <div className={`${active && query && "bg-[var(--theme)] rounded-xl"} relative w-full max-w-lg`}>
            <div
                className={`
          border bg-[var(--theme)] shadow-sm shadow-[var(--border)] transition-all duration-300
          ${expanded ? "rounded-xl" : "rounded-full"}
        `}
            >
                <div
                    className={`
            flex items-center gap-2 px-4 ${h}
            ${expanded ? "rounded-t-xl" : "rounded-full"}`}
                >
                    <Search className="w-5 h-5 text-[var(--gray-600)]" />

                    <input
                        type="text"
                        value={query}
                        placeholder="Search settings, security, billing..."
                        className="w-full bg-transparent outline-none text-[var(--gray-700)]"
                        onFocus={handleFocus}
                        onChange={(e) => setQuery(e.target.value)}
                        onBlur={handleBlur}
                    />
                </div>
            </div>
            {active && query && (
                <div
                    className="
            absolute top-full left-0 right-0
            bg-[var(--theme)] border border-border-[var(--border)] shadow-lg shadow-border-[var(--border)] rounded-lg
            z-50 overflow-hidden
          "
                >
                    {results.length ? (
                        results.map((item, index) => (
                            <div
                                key={index}
                                onMouseDown={() => handleSelect(item)}
                                className="
                  px-4 py-3 cursor-pointer
                  hover:bg-[var(--slate-50)] transition-colors
                "
                            >
                                <p className="text-sm font-medium text-[var(--gray-900)]">
                                    {item.title}
                                </p>
                                <p className="text-xs text-[var(--gray-500)]">
                                    Go to {item.page}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-sm text-[var(--gray-500)]">
                            No results found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
