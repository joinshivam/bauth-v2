import { useState } from "react";
import {
    Eye,
    EyeOff,
    Pencil,
    Shield,
    Mail,
    Search,
    Database,
} from "lucide-react";
import { useNotify } from "../../context/notifyContext";
import EditModal from "../../components/elements/InputModal"
import Toggle from "../../components/elements/toggle";
import { useScreenMode } from "../../utils/Functions/resizer";

export default function PrivacySettings() {
    const { notify } = useNotify();
    const [profileVisibility, setProfileVisibility] = useState("private");
    const [emailVisibility, setEmailVisibility] = useState(false);
    const [searchIndexing, setSearchIndexing] = useState(false);
    const [activityTracking, setActivityTracking] = useState(true);
    const [editModal, setEditModal] = useState(null);
    const mode = useScreenMode();
    const isMobile = mode === "mobile";

    return (
        <div className={`bg-[var(--gray-50)] ${isMobile ? "p-4 space-y-6" : "p-6 space-y-8"}`}>
            <div>
                <h1 className="text-2xl font-bold text-[var(--gray-800)] flex items-center gap-2">
                    <Shield size={22} />
                    Privacy Settings
                </h1>
                <p className="text-sm text-[var(--gray-600)]">
                    Control how your data, profile, and activity are used and shared.
                </p>
            </div>

            <Section title="Profile Visibility">
                <Row
                    icon={profileVisibility === "private" ? <EyeOff /> : <Eye />}
                    title="Profile visibility"
                    desc="Control who can view your profile information."
                    action={
                        <select
                            value={profileVisibility}
                            onChange={() =>
                                notify({ message: "Default : private , feature come soon", title: "Unable to Update", duration: 3000, Type: "info" })
                            }
                            className="border border-[var(--border)] bg-[var(--theme)] text-[var(--gray-700)] rounded-lg px-3 py-1.5 text-sm"
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    }
                />
            </Section>

            <Section title="Communication Preferences">
                <Row
                    icon={<Mail />}
                    title="Email visibility"
                    desc="Allow others to see your email address."
                    action={
                        <Toggle
                            enabled={emailVisibility}
                            onToggle={() => {
                                notify({ message: `feature come soon , ${!emailVisibility ? "off" : "on"}`, title: "Unable to Update", duration: 3000, Type: "info" })
                            }}
                        />
                    }
                />
            </Section>

            {/* DATA & ACTIVITY */}
            <Section title="Data & Activity">
                <Row
                    icon={<Database />}
                    title="Activity tracking"
                    desc="Allow us to collect usage data to improve experience."
                    action={
                        <Toggle
                            enabled={activityTracking}
                            onToggle={() => {
                                notify({ message: `feature come soon , ${!activityTracking ? "off" : "on"}`, title: "Unable to Update", duration: 3000, Type: "info" })

                            }}
                        />
                    }
                />
            </Section>

            {/* DISCOVERY */}
            <Section title="Account Discovery">
                <Row
                    icon={<Search />}
                    title="Search engine indexing"
                    desc="Allow your profile to appear in search engines."
                    action={
                        <Toggle
                            enabled={searchIndexing}
                            onToggle={() => {
                                notify({ message: `feature come soon , ${!searchIndexing ? "off" : "on"}`, title: "Unable to Update", duration: 3000, Type: "info" })

                            }}
                        />
                    }
                />
            </Section>

            {/* SECURITY */}
            <Section title="Security Controls">
                <Row
                    icon={<Shield />}
                    title="Recovery email"
                    desc="Email used for account recovery."
                    action={
                        <button
                            onClick={() => {
                                // setEditModal("recovery")
                                notify({ message: `feature come soon`, title: "Unable to Update", duration: 3000, Type: "info" })

                            }}
                            className="flex items-center gap-1 text-[var(--blue-600)] hover:underline text-sm"
                        >
                            <Pencil size={14} />
                            Edit
                        </button>
                    }
                />
            </Section>
            {editModal && (
                <EditModal name="recovery-email" parentClose={() => { setEditModal(false) }} label="Enter Recovery Email" Title="Recovery Email" onClose={() => setEditModal(null)} />
            )}
        </div>
    );
}

/* ---------- Reusable Components ---------- */

function Section({ title, children }) {
    const mode = useScreenMode();
    const isMobile = mode === "mobile";
    return (
        <section className={`rounded-xl ${!isMobile && "bg-[var(--theme)] p-4"}`}>
            <h2 className="text-lg font-semibold text-[var(--gray-800)] mb-4">{title}</h2>
            <div className="space-y-3 bg-[var(--theme)] rounded">{children}</div>
        </section>
    );
}

function Row({ icon, title, desc, action }) {
    return (
        <div className="p-4 border border-[var(--border)] rounded-lg flex justify-between items-start">
            <div className="flex gap-3">
                <div className="text-[var(--gray-500)]">{icon}</div>
                <div>
                    <h3 className="font-medium text-[var(--gray-800)]">{title}</h3>
                    <p className="text-sm text-[var(--gray-600)]">{desc}</p>
                </div>
            </div>
            {action}
        </div>
    );
}
