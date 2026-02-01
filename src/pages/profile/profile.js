import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import ProfileSidebar from "../../components/profile/ProfileSidebar";
import ProfileHeader from "../../components/profile/ProfileHeader";
import { useScreenMode } from "../../utils/Functions/resizer";

export function StringToUrls(input) {
    if (!input) return "";

    return input
        .toString()
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
}
export default function ProfileLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const mode = useScreenMode();
    const isMobile = mode === "mobile";

    const page = location.pathname.split("/")[2] || "hmrs";


    return (
        <div className="max-h-[100dvh] bg-[var(--gray-50)] flex">
            <ProfileSidebar activePage={page} />

            <main className="flex-1 ">
                <ProfileHeader user={user} log={logout} page={page} />
                <div className={`${isMobile ? "mt-1 space-y-3 h-[88.3dvh] min-h-[87dvh]" : "mt-10 space-y-6 h-[83dvh]"}  overflow-y-auto`}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
