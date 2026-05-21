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

function getProfilePage(pathname) {
  const segment = pathname.split("/").filter(Boolean)[1];
  return segment || "home";
}

export default function ProfileLayout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const mode = useScreenMode();
  const isMobile = mode === "mobile";
  const page = getProfilePage(pathname);

  return (
    <div className="gpu-safe h-[100dvh] bg-[var(--gray-50)] flex overflow-hidden">
      <ProfileSidebar activePage={page} />

      <main className="flex-1 min-w-0 flex flex-col">
        <ProfileHeader user={user} log={logout} page={page} />

        <div
          className={`flex-1 overflow-y-auto ${
            isMobile ? "mt-1 space-y-3" : "mt-10 space-y-6"
          }`}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}