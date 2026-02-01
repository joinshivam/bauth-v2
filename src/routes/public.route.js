import { useAuth, usernameTOurl } from "../context/auth.context"
import { Navigate, useLocation, Outlet } from "react-router-dom";
import DotBounce from "../components/loader/dotBounce"


export default function Public() {
    const { user, USERNAME, loading } = useAuth();
    const location = useLocation();
    const from = location.state?.from?.pathname || `/${USERNAME}`
    if (loading && !user) {
        return (
            <div className="flex justify-center bg-white h-screen items-center">
                <div className='flex items-end'>
                    <h1 className='text-blue-600 text-4xl font-bold font-mono'>Loading</h1>
                    <DotBounce size={12} />
                </div>
            </div >
        )
    }
    if (user) {
        return <Navigate to={`/${USERNAME || usernameTOurl(user?.username)}`} state={from} replace />;
    }
    return <Outlet />;
}