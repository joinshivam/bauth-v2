import { useAuth } from "../../context/auth.context";
import { ShieldCheck, Lock, Smartphone, History, LogOut } from "lucide-react";
import { useState } from "react";
import Toggle from "../../components/elements/toggle"
import { useNavigate, NavLink } from "react-router-dom";
import { logout_all } from "../../utils/Functions/getSession";
import ConformModal from "../../components/elements/conformModal";

export default function Security() {
    const { user, setUser } = useAuth();
    const navi = useNavigate();
    const [modal, setModal] = useState(false);
    const toggle2FA = () => {
    };

    const changePassword = () => {

    };

    const logoutAll = () => {
        setModal(p => !p);
    };

    return (
        <div className="bg-[var(--gray-50)] p-6 space-y-8">
            {modal && (
                <ConformModal Title="Conform Logout Everywhere?" onClose={() => setModal(false)} onConform={async () => { await logout_all(); setUser(null); navi("/login"); }} fixer={(<div className="text-[var(--gray-600)]">Conform Logout from all devices. this will also logout from this device</div>)} />
            )}
            <div>
                <h1 className="text-2xl font-bold text-[var(--gray-800)] flex items-center gap-2">
                    <ShieldCheck size={22} />
                    Security
                </h1>
                <p className="text-sm text-[var(--gray-600)]">
                    Manage how you protect your account and control access.
                </p>
            </div>

            {/* AUTHENTICATION */}
            <Section title="Authentication">
                <Row
                    icon={<Lock size={18} />}
                    title="Password"
                    desc="Last updated recently"
                    action={
                        <ActionButton onClick={changePassword}>
                            Change password
                        </ActionButton>
                    }
                />

                <Row
                    icon={<ShieldCheck size={18} />}
                    title="Two-factor authentication (2FA)"
                    desc={user.twoFactor ? "Enabled" : "Disabled"}
                    action={
                        <Toggle
                            enabled={user.twoFactor}
                            onToggle={toggle2FA}
                        />
                    }
                />
            </Section>
            <Section title="Sessions & Devices">
                <Row
                    icon={<Smartphone size={18} />}
                    title="Active sessions"
                    desc="View devices currently logged in"
                    action={
                        <ActionButton>
                            <NavLink to="/myaccount/sessions">
                                View sessions
                            </NavLink>
                        </ActionButton>
                    }
                />

                <Row
                    icon={<History size={18} />}
                    title="Login history"
                    desc="Last 5–10 login attempts"
                    action={
                        <ActionButton>
                            <NavLink to="/myaccount/sessions">
                                View sessions
                            </NavLink>
                        </ActionButton>
                    }
                />
            </Section>

            <Section title="Danger zone">
                <Row
                    icon={<LogOut size={18} className="text-red-600" />}
                    title="Logout from all devices"
                    desc="Immediately sign out everywhere"
                    action={
                        <DangerButton onClick={() => logoutAll()}>
                            Logout all
                        </DangerButton>
                    }
                />
            </Section>
        </div>
    );
}

/* ---------------- Components ---------------- */

function Section({ title, children }) {
    return (
        <section className="bg-[var(--theme)] rounded-xl shadow p-4 shadow-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--gray-800)] mb-4">
                {title}
            </h2>
            <div className="space-y-3">{children}</div>
        </section>
    );
}

function Row({ icon, title, desc, action }) {
    return (
        <div className="p-4 border border-[var(--border)] rounded-lg flex items-center justify-between">
            <div className="flex gap-3">
                <span className="text-[var(--gray-600)]">{icon}</span>
                <div>
                    <div className="text-sm font-medium text-[var(--gray-800)]">
                        {title}
                    </div>
                    <div className="text-xs text-[var(--gray-500)]">{desc}</div>
                </div>
            </div>
            {action}
        </div>
    );
}

function ActionButton({ children, onClick }) {
    return (
        <button
            onClick={onClick}
            className="text-sm text-[var(--blue-600)] hover:underline"
        >
            {children}
        </button>
    );
}

function DangerButton({ children, onClick }) {
    return (
        <button
            onClick={onClick}
            className="text-sm text-red-600 hover:underline"
        >
            {children}
        </button>
    );
}
