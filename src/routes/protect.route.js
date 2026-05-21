import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import DotBounce from "../components/loader/dotBounce";

function legacyUToMyAccount(pathname, search) {
    if (pathname === "/u") return `/myaccount${search || ""}`;
    if (pathname.startsWith("/u/")) return `/myaccount${pathname.slice(2)}${search || ""}`;
    return "/myaccount";
}

export default function Protect() {
    const { user, loading } = useAuth();
    const location = useLocation();

    const from =
        (location.state?.from ||
            location.pathname + location.search) ||
        `/myaccount`;

    if (loading && !user) {
        return (
            <div className="flex justify-center bg-[var(--gray-50)] h-screen items-center">
                <div className='flex items-end'>
                    <h1 className='text-blue-600 text-4xl font-bold font-mono'>
                        Loading
                    </h1>
                    <DotBounce size={12} />
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" state={{ from }} replace />;
    }

    if (location.pathname === "/u" || location.pathname.startsWith("/u/")) {
        return <Navigate to={legacyUToMyAccount(location.pathname, location.search)} replace />;
    }

    return <Outlet />;
}
