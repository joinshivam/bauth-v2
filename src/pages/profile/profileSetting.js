import { useState, useEffect } from "react";
import { Bell, Shield, Globe, Moon, Save } from "lucide-react";
import { useTheme } from "../../context/theme.context";
import Toggle from "../../components/elements/toggle";
import { useNotify } from "../../context/notifyContext";

export default function Settings() {
    const { theme, isDark, toggleTheme } = useTheme();
    const { notify } = useNotify();
    const [settings, setSettings] = useState({
        emailNotif: true,
        pushNotif: false,
        twoFactor: false,
        language: "English",
    });


    const handleChange = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const updateLanguage = (e) => {
        setSettings((prev) => ({ ...prev, language: e.target.value }));
    };

    const saveAll = () => {
        alert("Settings Updated Successfully!");
    };

    return (
        <div className=" bg-[var(--gray-50)] p-6 space-y-8">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--gray-800)]">Settings</h1>
                <p className="text-sm text-[var(--gray-600)]">
                    Manage system preferences, notifications, and security options.
                </p>
            </div>

            {/* NOTIFICATIONS */}
            <Section title="Notifications" icon={<Bell size={18} />}>
                <Row>
                    <Label title="Email notifications" />
                    <Toggle
                        enabled={settings.emailNotif}
                        onToggle={() => handleChange("emailNotif")}
                    />
                </Row>

                <Row>
                    <Label title="Push notifications" />
                    <Toggle
                        enabled={settings.pushNotif}
                        onToggle={() => handleChange("pushNotif")}
                    />
                </Row>
            </Section>

            {/* SYSTEM */}
            <Section title="System Preferences" icon={<Globe size={18} />}>
                <Row>
                    <Label title="Language" />
                    <select
                        value={settings.language}
                        onToggle={updateLanguage}
                        className="border border-[var(--border)] bg-[var(--theme)] text-[var(--gray-700)] rounded-lg px-3 py-1.5 text-sm"
                    >
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Spanish</option>
                        <option>Sanskrit</option>
                    </select>
                </Row>

                <Row>
                    <div className="flex items-center gap-2">
                        <Moon size={16} className="text-gray-500" />
                        <Label title={`Dark mode ${theme === "system" ? "(System)" : "(User)"}`} />
                    </div>
                    <Toggle
                        enabled={isDark}
                        onToggle={() => toggleTheme()}
                    />
                </Row>
            </Section>

            {/* SECURITY */}
            <Section title="Security" icon={<Shield size={18} />}>
                <Row>
                    <Label title="Two-factor authentication (2FA)" />
                    <Toggle
                        enabled={settings.twoFactor}
                        onToggle={() => handleChange("twoFactor")}
                    />
                </Row>
            </Section>

            {/* SAVE */}
            <div className="flex justify-end pt-4">
                <button
                    onClick={saveAll}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow"
                >
                    <Save size={16} />
                    Save changes
                </button>
            </div>
        </div>
    );
}

/* ---------------- Components ---------------- */

function Section({ title, icon, children }) {
    return (
        <section className="bg-[var(--theme)] rounded-xl shadow shadow-[var(--border)] p-4">
            <div className="flex items-center gap-2 mb-4">
                {icon && <span className="text-[var(--gray-600)]">{icon}</span>}
                <h2 className="text-lg font-semibold text-[var(--gray-800)]">{title}</h2>
            </div>

            <div className="space-y-3">{children}</div>
        </section>
    );
}

function Row({ children }) {
    return (
        <div className="p-4 border border-[var(--border)] rounded-lg flex items-center justify-between">
            {children}
        </div>
    );
}

function Label({ title }) {
    return <span className="text-sm font-medium text-[var(--gray-700)]">{title}</span>;
}
