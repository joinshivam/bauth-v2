import { Bell, CalendarDays, Lock, Monitor, Settings, ShieldCheck, Smartphone, User, } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getFixSuggestions } from "../../utils/fixSuggestions";
import QuerySearchBar from "../../components/profile/QuerySearchBar";
import { useAuth } from "../../context/auth.context";
import Avatar from "../../components/elements/avtar";
import { useScreenMode } from "../../utils/Functions/resizer";

function getGreeting({
  input = Date.now(),
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  guest = "user",
}) {
  const date = new Date(input);

  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone,
    }).format(date)
  );

  const label =
    hour < 12
      ? "Good morning"
      : hour < 16
        ? "Good afternoon"
        : hour < 21
          ? "Good evening"
          : "Good night";

  return `${label}, ${guest}`;
}

function formatDate(value) {
  if (!value) return "Not available";

  try {
    return new Date(value).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Not available";
  }
}


export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const mode = useScreenMode();
  const isMobile = mode === "mobile";
  const fixes = useMemo(() => getFixSuggestions(user), [user]);
  const firstName = user?.name?.split(" ")[0] || "user";

  const profileScore = useMemo(() => {
    const fields = [user?.name, user?.username, user?.dob, user?.gender, user?.phone, user?.photo];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [user]);

  return (
    <div className="min-h-full bg-[var(--gray-50)]">
      <div className={`mx-auto w-full max-w-6xl ${isMobile ? "px-4 py-4" : "px-8 py-8"} space-y-6`}>
        <section className="bg-[var(--theme)] border border-[var(--border)] rounded-lg shadow-sm p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className="shrink-0 mx-auto md:mx-0">
              <Avatar size={isMobile ? 5.5 : 6.5} stable />
            </div>

            <div className="min-w-0 flex-1 text-center md:text-left space-y-2">
              <h1 className="text-2xl md:text-3xl font-semibold text-[var(--gray-900)]">
                {getGreeting({ guest: firstName })}
              </h1>
              <p className="text-sm text-[var(--gray-600)]">
                @{user?.username} · Joined {formatDate(user?.created_at)}
              </p>

              <div className="max-w-xl mx-auto md:mx-0 pt-2">
                <QuerySearchBar h="h-[42px]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 md:w-56">
              <QuickButton icon={<User size={16} />} label="Profile" onClick={() => navigate("/myaccount/profile")} />
              <QuickButton icon={<ShieldCheck size={16} />} label="Security" onClick={() => navigate("/myaccount/security")} />
              <QuickButton icon={<Monitor size={16} />} label="Sessions" onClick={() => navigate("/myaccount/sessions")} />
              <QuickButton icon={<Settings size={16} />} label="Settings" onClick={() => navigate("/myaccount/settings")} />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <section className="bg-[var(--theme)] border border-[var(--border)] rounded-lg shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[var(--gray-900)]">Account readiness</h2>
                <p className="text-sm text-[var(--gray-600)]">Keep your account recoverable and easier to manage.</p>
              </div>
              <span className="text-sm font-semibold text-[var(--blue-600)]">{profileScore}%</span>
            </div>

            <div className="h-2 rounded-full bg-[var(--gray-100)] overflow-hidden">
              <div
                className="h-full bg-[var(--blue-600)] rounded-full transition-all"
                style={{ width: `${profileScore}%` }}
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <StatusTile label="Name" value={user?.name || "Missing"} ok={!!user?.name} />
              <StatusTile label="Phone" value={user?.phone || "Not set"} ok={!!user?.phone} />
              <StatusTile label="Verified" value={user?.verified ? "Verified" : "Pending"} ok={!!user?.verified} />
            </div>

            {fixes.map((fix) => (
              <button
                key={fix.id}
                type="button"
                onClick={() => navigate(fix.to)}
                className="w-full flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-left hover:bg-[var(--gray-50)] transition"
              >
                <div>
                  <div className="text-sm text-[var(--gray-800)]">{fix.title}</div>
                  <div className="text-xs text-[var(--gray-500)]">{fix.desc}</div>
                </div>
                <span className="text-xs text-[var(--blue-600)]">Fix</span>
              </button>
            ))}
          </section>

          <section className="bg-[var(--theme)] border border-[var(--border)] rounded-lg shadow-sm p-5 space-y-4">
            <h2 className="text-lg font-semibold text-[var(--gray-900)]">Security snapshot</h2>

            <SnapshotRow
              icon={<Lock size={18} />}
              title="Password"
              desc="Change your password regularly"
              action="Manage"
              onClick={() => navigate("/myaccount/security")}
            />
            <SnapshotRow
              icon={<Smartphone size={18} />}
              title="Active sessions"
              desc="Review devices logged into your account"
              action="View"
              onClick={() => navigate("/myaccount/sessions")}
            />
            <SnapshotRow
              icon={<Bell size={18} />}
              title="Notifications"
              desc="Control account alerts"
              action="Open"
              onClick={() => navigate("/myaccount/notifications")}
            />
          </section>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionCard
            icon={<CalendarDays size={20} />}
            title="Personal info"
            desc="Update your name, birthday, gender, and contact details."
            onClick={() => navigate("/myaccount/profile")}
          />
          <ActionCard
            icon={<ShieldCheck size={20} />}
            title="Privacy"
            desc="Choose what is visible and how your account is discoverable."
            onClick={() => navigate("/myaccount/privacy")}
          />
          <ActionCard
            icon={<Settings size={20} />}
            title="Preferences"
            desc="Adjust account settings, theme, and notification behavior."
            onClick={() => navigate("/myaccount/settings")}
          />
        </section>
      </div>
    </div>
  );
}

function QuickButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-10 flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--gray-50)] text-sm text-[var(--gray-800)] hover:bg-[var(--gray-100)] transition"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StatusTile({ label, value, ok }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--gray-50)] p-3">
      <div className="text-xs text-[var(--gray-500)]">{label}</div>
      <div className={`text-sm font-medium truncate ${ok ? "text-[var(--gray-900)]" : "text-[var(--brand-pinkorange)]"}`}>
        {value}
      </div>
    </div>
  );
}

function SnapshotRow({ icon, title, desc, action, onClick }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-3">
      <div className="h-9 w-9 rounded-lg bg-[var(--blue-50)] text-[var(--blue-600)] grid place-items-center">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-[var(--gray-900)]">{title}</div>
        <div className="text-xs text-[var(--gray-600)] truncate">{desc}</div>
      </div>

      <button type="button" onClick={onClick} className="text-xs font-semibold text-[var(--blue-600)]">
        {action}
      </button>
    </div>
  );
}

function ActionCard({ icon, title, desc, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-lg border border-[var(--border)] bg-[var(--theme)] p-4 shadow-sm hover:bg-[var(--gray-50)] transition"
    >
      <div className="h-10 w-10 rounded-lg bg-[var(--blue-50)] text-[var(--blue-600)] grid place-items-center mb-3">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-[var(--gray-900)]">{title}</h3>
      <p className="text-xs text-[var(--gray-600)] mt-1 leading-5">{desc}</p>
    </button>
  );
}
