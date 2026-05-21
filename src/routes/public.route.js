import { useAuth } from "../context/auth.context"
import { Outlet } from "react-router-dom";
import DotBounce from "../components/loader/dotBounce"


export default function Public() {
    const { user, loading } = useAuth();
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
    return <Outlet />;
}