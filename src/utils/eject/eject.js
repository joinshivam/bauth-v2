import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import Accounts from "../../pages/auth/accounts";
import Signin from '../../pages/auth/signin';
import Signup from '../../pages/auth/signup';
import Landing from "../../pages/Landing"
import Profile from "../../pages/profile/profile"
import PublicRoute from "../../routes/public.route"
import ProtectedRoute from "../../routes/protect.route"
import ProfileHome from "../../pages/profile/profileHome";
import ProfileInfo from "../../pages/profile/profileInfo";
import ProfileSecurity from "../../pages/profile/profileSecurity";
import ProfileSettings from "../../pages/profile/profileSetting";
import ProfilePrivacy from "../../pages/profile/ProfilePrivacy";
import ProfileNotifications from "../../pages/profile/notification";
import Sessions from "../../pages/profile/deviceAndSessions";
import NotifyContainer from '../../components/notify/notifyContainer';
import E404 from "../../pages/profile/404NotFound"
import A404 from "../../pages/notfound"
import E500 from "../../pages/profile/500NotFound"
import { SidebarProvider } from "../../context/sidebar.context"
import SsoSelect from '../../pages/auth/SsoSelect';
import { useAuth } from '../../context/auth.context';
import { buildAccountManagerAuthRequest } from '../accountCenterFlow';

function RootGate() {
    const { user, activeUser, loading } = useAuth();
    const location = useLocation();
    const returnTo = location.state?.from || "/myaccount";

    if (loading) {
        return (
            <div className="min-h-[100dvh] grid place-items-center bg-[var(--theme)] text-[var(--gray-800)]">
                Loading...
            </div>
        );
    }

    if (user?.username && activeUser) {
        return <Navigate to="/myaccount" replace />;
    }

    return <Navigate to={buildAccountManagerAuthRequest(returnTo)} replace />;
}

const Eject = () => {
    return (
        <div className='gpu-safe min-h-[100dvh] bg-[var(--theme)] text-[var(--gray-800)]'>
            <NotifyContainer />
            <Routes>
                <Route path="bauth" element={<Landing />} />

                <Route path="/" element={<RootGate />} />
                <Route path="/account-center" element={<Accounts />} />
                <Route path="/account-center/" element={<Accounts />} />
                <Route path="/sso/select" element={<SsoSelect />} />

                <Route element={<ProtectedRoute />}>
                    <Route path={`/myaccount`} element={<SidebarProvider><Profile /></SidebarProvider>} >
                        <Route index element={<ProfileHome />} />
                        <Route path='profile' element={<ProfileInfo />} />
                        <Route path='security' element={<ProfileSecurity />} />
                        <Route path='settings' element={<ProfileSettings />} />
                        <Route path='notifications' element={<ProfileNotifications />} />
                        <Route path='sessions' element={<Sessions />} />
                        <Route path='privacy' element={<ProfilePrivacy />} />
                        <Route path='*' element={<E404 />} />
                    </Route>
                    <Route path={`/u`} element={<SidebarProvider><Profile /></SidebarProvider>} >
                        <Route index element={<ProfileHome />} />
                        <Route path='profile' element={<ProfileInfo />} />
                        <Route path='security' element={<ProfileSecurity />} />
                        <Route path='settings' element={<ProfileSettings />} />
                        <Route path='notifications' element={<ProfileNotifications />} />
                        <Route path='sessions' element={<Sessions />} />
                        <Route path='privacy' element={<ProfilePrivacy />} />
                        <Route path='*' element={<E404 />} />
                    </Route>
                </Route>

                <Route element={<PublicRoute />}>
                    <Route path="/account-center/login" element={<Signin />} />
                    <Route path="/account-center/login/flow" element={<Signin />} />
                    <Route path="/account-center/signup" element={<Signup />} />
                    <Route path="/account-center/signup/flow" element={<Signup />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Signin />} />
                </Route>
                <Route path="/serverError" element={<E500 />} />
                <Route path='*' element={<A404 />} />
            </Routes>
        </div>
    )
}

export default Eject;
