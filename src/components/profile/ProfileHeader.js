import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, Copy, LayoutDashboard, LogOut, MenuIcon, Monitor, Plus, RefreshCw, Settings, ShieldCheck, User, Users, X, } from "lucide-react";
import { useNotify } from "../../context/notifyContext";
import QuerySearchBar from "./QuerySearchBar";
import { useScreenMode } from "../../utils/Functions/resizer";
import Avatar from "../elements/avtar";
import api, { API_BASE } from "../../lib/services/api";
import { useSidebar } from "../../context/sidebar.context";
import { useAuth } from "../../context/auth.context";
import {
  ACCOUNT_CENTER_PROMPTS,
  buildAccountManagerAuthRequest,
  buildLoginFlowPath,
} from "../../utils/accountCenterFlow";

function toAccountList(sessions = {}, activeSessionId, currentUsername) {
  return Object.entries(sessions).map(([sessionId, session]) => ({
    sessionId,
    current: sessionId === activeSessionId || session?.username === currentUsername,
    name: session?.name || "Unknown user",
    username: session?.username || "",
    email: session?.email || "",
    photo: session?.profilePhoto || session?.photo || "",
  }));
}

export default function ProfileHeader({ user, log, page }) {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  const mode = useScreenMode();
  const isMobile = mode === "mobile";

  const { notify } = useNotify();
  const { open, toggle } = useSidebar();
  const { switchAccount, activeUser } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [sessions, setSessions] = useState({});
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [switchingId, setSwitchingId] = useState(null);
  const [copied, setCopied] = useState(false);

  const accountList = useMemo(
    () => toAccountList(sessions, activeUser, user?.username),
    [sessions, activeUser, user?.username]
  );

  const currentAccount = useMemo(
    () => accountList.find((account) => account.current),
    [accountList]
  );

  const otherAccounts = useMemo(
    () => accountList.filter((account) => !account.current),
    [accountList]
  );

  const profileUrl = `${window.location.origin}/myaccount/profile`;
  const addAccountUrl = buildLoginFlowPath(
    buildAccountManagerAuthRequest("/myaccount", {
      prompt: ACCOUNT_CENTER_PROMPTS.CONTINUE,
    }),
    { flow: "add" }
  );

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const loadSessions = useCallback(async ({ silent = false } = {}) => {
    if (!user?.username) return;

    try {
      setSessionsLoading(true);
      const data = await api.get("/auth/sessions");

      if (!data?.success || !data?.sessions) {
        setSessions({});
        return;
      }

      setSessions(data.sessions);
    } catch (err) {
      setSessions({});
      if (!silent) {
        notify({
          type: "danger",
          title: "Sessions unavailable",
          message: err?.message || "Unable to load accounts",
          duration: 1500,
        });
      }
    } finally {
      setSessionsLoading(false);
    }
  }, [notify, user?.username]);

  useEffect(() => {
    loadSessions({ silent: true });
  }, [loadSessions]);

  useEffect(() => {
    if (!menuOpen) return;

    loadSessions({ silent: true });

    const handlePointerDown = (event) => {
      const target = event.target;

      if (menuRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;

      closeMenu();
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("pointerdown", handlePointerDown, false);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, false);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, loadSessions, menuOpen]);

  const goTo = (path) => {
    closeMenu();
    navigate(path);
  };

  const handleCopy = async () => {
    if (copied) return;

    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);

      notify({
        type: "success",
        title: "Profile link copied",
        message: profileUrl,
        duration: 1200,
      });

      setTimeout(() => setCopied(false), 1200);
    } catch {
      notify({
        type: "danger",
        title: "Copy failed",
        message: "Unable to copy profile link",
        duration: 1500,
      });
    }
  };

  const handleLogout = async () => {
    try {
      closeMenu();
      await log?.();
      navigate("/", { replace: true });
    } catch (err) {
      notify({
        type: "danger",
        title: "Logout failed",
        message: err?.message || "Please try again",
        duration: 1500,
      });
    }
  };

  const handleSwitchAccount = async (sessionId) => {
    if (!sessionId || switchingId) return;

    try {
      setSwitchingId(sessionId);
      await switchAccount(sessionId);
      closeMenu();
      navigate("/myaccount", { replace: true });

      notify({
        type: "success",
        title: "Account switched",
        message: "Selected account is active",
        duration: 1200,
      });
    } catch (err) {
      notify({
        type: "danger",
        title: "Switch failed",
        message: err?.message || "Unable to switch account",
        duration: 1500,
      });
    } finally {
      setSwitchingId(null);
    }
  };

  return (
    <header className="shrink-0 sticky top-0 z-[99999] bg-[var(--slate-50)] border-b border-[var(--border)]">
      <div className={`relative flex items-center w-full ${isMobile ? "gap-2 px-3 py-2" : "gap-5 px-6 py-3"}`}>
        {isMobile && (
          <button
            type="button"
            onClick={toggle}
            className={`h-11 w-11 grid place-items-center rounded-full bg-[var(--theme)] border shadow-sm transition ${open
              ? "text-blue-600 border-[var(--gray-800)]"
              : "text-[var(--gray-800)] border-[var(--border)]"
              }`}
            aria-label="Toggle sidebar"
          >
            {open ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        )}
        <div className="min-w-0 flex-1">
          <QuerySearchBar h={isMobile ? "h-[34px]" : "h-[40px]"} />
        </div>

        <div className="shrink-0 flex items-center gap-2 sm:gap-3">
          {!isMobile && (
            <HeaderIconButton title="Notifications" onClick={() => goTo("/myaccount/notifications")}>
              <Bell size={18} />
            </HeaderIconButton>
          )}

          <button
            ref={triggerRef}
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMenuOpen((value) => !value);
            }}
            className="h-11 min-w-11 flex items-center justify-center rounded-full bg-[var(--theme)] border border-[var(--border)] shadow-sm text-[var(--gray-800)] hover:bg-[var(--gray-100)] transition"
            aria-label="Account menu"
            aria-expanded={menuOpen}
          >
            <Avatar disabled={true} size={isMobile ? 2 : 2.35} />
          </button>
        </div>

        {menuOpen && (
          <AccountMenu
            refEl={menuRef}
            user={user}
            currentAccount={currentAccount}
            copied={copied}
            sessionsLoading={sessionsLoading}
            otherAccounts={otherAccounts}
            switchingId={switchingId}
            onRefresh={() => loadSessions()}
            onCopy={handleCopy}
            onNavigate={goTo}
            onLogout={handleLogout}
            onSwitch={handleSwitchAccount}
            addAccountUrl={addAccountUrl}
          />
        )}
      </div>
    </header>
  );
}

function AccountMenu({
  refEl,
  user,
  currentAccount,
  copied,
  sessionsLoading,
  otherAccounts,
  switchingId,
  onRefresh,
  onCopy,
  onNavigate,
  onLogout,
  onSwitch,
  addAccountUrl,
}) {
  return (
    <div
      ref={refEl}
      onPointerDown={(e) => e.stopPropagation()}
      className="
        fixed sm:right-6 top-14
        w-[calc(100vw-1rem)] sm:w-[26rem]
        max-h-[calc(100dvh-5rem)]
        overflow-hidden rounded-xl border border-[var(--border)]
        bg-[var(--theme)] shadow-2xl
        z-[99999]
      "
    >
      <div className="flex flex-col max-h-[calc(100dvh-5rem)]">
        <div className="p-3 border-b border-[var(--border)]">
          <button
            type="button"
            onClick={() => onNavigate("/myaccount/profile")}
            className="w-full flex items-center gap-3 rounded-lg p-2 bg-[var(--gray-50)] hover:bg-[var(--gray-100)] text-left transition"
          >
            <Avatar disabled={true} size={2.75} />

            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-[var(--gray-900)] truncate">
                {user?.name || currentAccount?.name || "User"}
              </div>
              <div className="text-xs text-[var(--gray-500)] truncate">
                @{user?.username || currentAccount?.username}
              </div>
            </div>

            <span className="text-xs text-[var(--blue-600)] shrink-0">View</span>
          </button>
        </div>

        <div className="p-2 border-b border-[var(--border)]">
          <div className="grid grid-cols-4 gap-2">
            <TouchAction icon={<User size={17} />} label="Profile" onClick={() => onNavigate("/myaccount/profile")} />
            <TouchAction icon={<ShieldCheck size={17} />} label="Security" onClick={() => onNavigate("/myaccount/security")} />
            <TouchAction icon={<Monitor size={17} />} label="Sessions" onClick={() => onNavigate("/myaccount/sessions")} />
            <TouchAction icon={<Settings size={17} />} label="Settings" onClick={() => onNavigate("/myaccount/settings")} />
          </div>

          <div className="grid grid-cols-4 gap-2 mt-2">
            <TouchAction icon={<LayoutDashboard size={17} />} label="Home" onClick={() => onNavigate("/myaccount")} />
            <TouchAction icon={<Bell size={17} />} label="Alerts" onClick={() => onNavigate("/myaccount/notifications")} />
            <TouchAction icon={copied ? <Check size={17} /> : <Copy size={17} />} label={copied ? "Copied" : "Share"} onClick={onCopy} />
            <TouchAction icon={<Plus size={17} />} label="Add" onClick={() => onNavigate(addAccountUrl)} />
          </div>
        </div>

        <div className="px-3 pt-3 pb-2 flex items-center justify-between gap-3">
          <div className="text-xs font-medium text-[var(--gray-500)] flex items-center gap-2">
            <Users size={14} />
            Switch account
          </div>

          <button
            type="button"
            onClick={onRefresh}
            className="h-8 w-8 grid place-items-center rounded-full hover:bg-[var(--gray-100)] text-[var(--gray-600)] transition"
          >
            <RefreshCw size={14} className={sessionsLoading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto px-2 pb-2">
          {sessionsLoading && (
            <div className="px-2 py-3 text-sm text-[var(--gray-500)]">
              Loading accounts...
            </div>
          )}

          {!sessionsLoading && otherAccounts.length === 0 && (
            <div className="px-2 py-3 text-sm text-[var(--gray-500)]">
              No other accounts added.
            </div>
          )}

          {!sessionsLoading &&
            otherAccounts.map((account) => (
              <AccountMenuItem
                key={account.sessionId}
                account={account}
                loading={switchingId === account.sessionId}
                disabled={!!switchingId}
                onClick={() => onSwitch(account.sessionId)}
              />
            ))}
        </div>

        <div className="flex p-2 border-t border-[var(--border)]">
          <button
            type="button"
            onClick={onLogout}
            className="w-full min-h-11 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
          <button
            type="button"
            onClick={() => onNavigate(addAccountUrl)}
            className="w-full min-h-11 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
          >
            <Plus size={16} />
            Add Account
          </button>
        </div>
      </div>
    </div>
  );
}

function AccountMenuItem({ account, loading, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full min-h-12 flex items-center gap-3 rounded-lg px-3 py-2 text-left transition ${disabled ? "opacity-70 cursor-not-allowed" : "hover:bg-[var(--gray-100)]"
        }`}
    >
      <div className="h-10 w-10 shrink-0 rounded-full bg-[var(--blue-50)] text-[var(--blue-600)] grid place-items-center font-semibold">
        <img src={`${API_BASE}/media/profile/${account.username}`} alt={account.name} className="h-full w-full rounded-full object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-[var(--gray-900)] truncate">
          {account.name}
        </div>
        <div className="text-xs text-[var(--gray-500)] truncate">
          @{account.username}
        </div>
      </div>

      <span className="text-xs text-[var(--blue-600)] shrink-0">
        {loading ? "Switching..." : "Switch"}
      </span>
    </button>
  );
}

function TouchAction({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-14 flex flex-col items-center justify-center gap-1 rounded-lg bg-[var(--gray-50)] hover:bg-[var(--gray-100)] text-[var(--gray-800)] transition"
    >
      {icon}
      <span className="text-[11px] leading-none truncate max-w-full px-1">{label}</span>
    </button>
  );
}

function HeaderIconButton({ title, children, onClick }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className="h-11 w-11 grid place-items-center rounded-full bg-[var(--theme)] border border-[var(--border)] shadow-sm text-[var(--gray-800)] hover:bg-[var(--gray-100)] transition"
    >
      {children}
    </button>
  );
}
