import { Navigate, useLocation, Outlet, useParams } from "react-router-dom";
import { useAuth, usernameTOurl } from "../context/auth.context"
import DotBounce from "../components/loader/dotBounce"


export default function Protect() {
    const { user, loading, USERNAME } = useAuth();
    const location = useLocation();
    const { username } = useParams();
    const from = (location.state?.from ||
        location.pathname + location.search) || `/${USERNAME}`

    if (loading && !user) {
        return (
            <div className="flex justify-center bg-[var(--gray-50)] h-screen items-center">
                <div className='flex items-end'>
                    <h1 className='text-blue-600 text-4xl font-bold font-mono'>Loading</h1>
                    <DotBounce size={12} />
                </div>
            </div >
        );
    }

    if (!user) {
        return <Navigate to="/login" state={from} replace />;
    }
    if (username !== usernameTOurl(user?.username)) {
        return <Navigate to="/login" state={from} replace />;
    }

    return <Outlet />;
}