import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from '../../pages/login';
import Signup from '../../pages/signup';
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


const Eject = () => {
    const navi = useNavigate();
    return (
        <>
            <NotifyContainer />
            <Routes>


                <Route path="/u/:username" element={<div className='w-[100dvw] h-[100dvh] flex items-center justify-center text-4xl flex-col gap-12'><div className='w-full text-center'>Feature Coming Soon...</div><button onClick={() => { navi("/") }} className='text-xl bg-[var(--gray-200)] p-2 rounded text-[var(--gray-700)]'>Visit Website</button></div>} />
                <Route path="/" element={<Landing />} />


                <Route element={<ProtectedRoute />}>
                    <Route path="/:username" element={<SidebarProvider><Profile /></SidebarProvider>} >
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
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                </Route>
                <Route path="/serverError" element={<E500 />} />
                <Route path='*' element={<A404 />} />
            </Routes>
        </>
    )
}

export default Eject;