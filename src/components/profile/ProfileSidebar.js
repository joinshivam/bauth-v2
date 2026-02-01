import {
    User,
    Settings,
    Shield,
    Bell,
    Monitor,
    Lock,
    FanIcon,
    LogOut,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import SidebarUtility from "./utilMenu";
import { useAuth } from "../../context/auth.context";
import { useSidebar } from "../../context/sidebar.context";
import { useScreenMode } from "../../utils/Functions/resizer";
import ConformModal from "../elements/conformModal";

export default function ProfileSidebar({ activePage }) {
    const mode = useScreenMode();
    const isMobile = mode === "mobile";
    const { open, toggle, closeSidebar } = useSidebar();
    const [spin, setSpin] = useState(true);
    const [modal, setModal] = useState(false);
    const { USERNAME, logout } = useAuth();

    const handleToggle = (e) => {
        setSpin(true);
        toggle();
        setTimeout(() => setSpin(false), 150);
    };
    const handleContainerClose = () => {
        if (isMobile) closeSidebar();
    };

    return (
        <aside className={`h-[100dvh] pt-5 ${!isMobile ? "relative bg-[var(--theme))] border-r border-[var(--border)] z-50" : "fixed overflow-hidden bg-[var(--theme)]"} transition-all duration-300 ease-in-out
         ${isMobile && (open ? "text-[var(--blue-600)] w-64 z-50" : "text-none w-0 p-0 z-50 -translate-x-20")}
         ${open && !isMobile ? "text-[var(--blue-600)] shadow-xl shadow-[var(--border)] w-64" : "text-[var(--gray-800)] w-20"}
         
         `}>
            <div>
                {!isMobile && (
                    <div className=" z-10 absolute -right-5 bottom-10 cursor-pointer" onClick={handleToggle}>
                        <div className="bg-[var(--theme)] border rounded-full p-2 shadow">
                            <div className={`transition-transform duration-300 ${spin ? (open ? "-rotate-180" : "rotate-180") : ""}`}>
                                <FanIcon />
                            </div>
                        </div>
                    </div>
                )}
                <ul className={`space-y-2 min-h-full ${isMobile && (open ? "" : "absolute -z-50 -translate-x-20")}`}>
                    <div className={`${open && "px-6"}`}>
                        <SidebarItem
                            logo={"/favicon.png"}
                            nav={"/" + USERNAME}
                            collapsed={!open}
                        />
                    </div>
                    <div className={`${open ? "px-4" : "px-2"} overflow-y-auto overflow-x-hidden max-h-[70dvh]`} onClick={(e) => handleContainerClose(e)}>
                        <SidebarItem
                            icon={User}
                            label="Profile"
                            active={activePage === "profile"}
                            collapsed={!open}
                            nav="profile"
                        />
                        <SidebarItem
                            icon={Lock}
                            label="Privacy"
                            active={activePage === "privacy"}
                            collapsed={!open}
                            nav="privacy"
                        />
                        <SidebarItem
                            icon={Settings}
                            label="Account Settings"
                            active={activePage === "settings"}
                            collapsed={!open}
                            nav="settings"
                        />
                        <SidebarItem
                            icon={Shield}
                            label="Security"
                            active={activePage === "security"}
                            collapsed={!open}
                            nav="security"
                        />
                        <SidebarItem
                            icon={Bell}
                            label="Notifications"
                            active={activePage === "notifications"}
                            collapsed={!open}
                            nav="notifications"
                        />
                        <SidebarItem
                            icon={Monitor}
                            label="Devices & Sessions"
                            active={activePage === "sessions"}
                            collapsed={!open}
                            nav="sessions"
                        />


                    </div>
                </ul>

            </div>

            <div className={`text-red-600 sm-util mt-auto p-4 absolute text-[var(--gray-900)] bottom-8 cursor-pointer transition-all duration-300 ease-in-out z-40`}>
                <div onClick={() => {
                    setModal(p => !p)
                }}>
                    <LogOut />
                </div>
            </div>
            {modal && (
                <ConformModal Title="Conform Logout?" onClose={() => setModal(false)} onConform={logout} fixer={(<div className="text-[var(--gray-600)]">after logout you are redirected to Login page</div>)} />
            )}
            <div className={`sm-util mt-auto p-4 absolute text-[var(--gray-900)] ${open ? "bottom-6" : "bottom-0"} transition-all duration-300 ease-in-out`}>
                <SidebarUtility collapsed={open} />
            </div>

        </aside>
    );
}

function SidebarItem({ icon: Icon, label, logo, active, collapsed, nav }) {
    return (
        <li
            className={`
                cursor-pointer rounded-lg
                transition-all duration-300
                ${active && Icon ? "bg-[var(--blue-50)] text-[var(--blue-600)]" : "text-[var(--gray-700)] hover:bg-[var(--gray-100)]"}
            `}
        >
            <NavLink
                to={nav}
                className={`
                    flex items-center gap-3 ${Icon && "p-3"}
                    ${collapsed ? "flex-col justify-center" : "flex-row"}
                `}
            >
                {Icon && !logo && (<Icon className="w-5 h-5 shrink-0" />)}
                {logo && (<div className="rounded shadow-[var(--slate-300)] flex items-baseline"><img src={logo} alt="side-image" className={`w-7 h-8 mb-5 relative`} />{!collapsed && (<div className="sm-util text-2xl"><span className="font-extrabold bg-gradient-to-r from-[var(--brand)] via-[var(--accent)] to-cyan-400 bg-clip-text text-transparent">Auth</span>Account</div>)}</div>)}

                {!collapsed && (
                    <span className="whitespace-nowrap text-sm font-medium">
                        {label}
                    </span>
                )}
            </NavLink>
        </li>
    );
}

