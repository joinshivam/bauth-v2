import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import FormTop from "../../components/loader/formTop";
import api, { API_BASE } from "../../lib/services/api";
import { Helmet } from 'react-helmet-async';
import {
  ACCOUNT_CENTER_PROMPTS,
  ACCOUNT_CENTER_ROLES,
  buildAccountCenterReturnTo,
  buildLoginFlowPath,
  clearAccountCenterAuthResult,
  getAccountCenterRole,
  hasAnyServiceParams,
  isAuthRequest,
  normalizeAccountManagerReturnTo,
  readAccountCenterAuthResult,
  shouldSelectAccount,
  validateServiceRequestParams,
  writeAccountCenterGrant,
} from "../../utils/accountCenterFlow";

function sessionsToList(sessions = {}, activeSessionId) {
  return Object.entries(sessions).map(([sessionId, user]) => ({
    sessionId,
    current: sessionId === activeSessionId,
    name: user?.name || "Unknown user",
    username: user?.username || "",
    email: user?.email || "",
    photo: user?.profilePhoto || user?.photo || "",
  }));
}

function emptySessionsForExpectedAuthError(err) {
  if (err?.status === 401) return { sessions: {} };

  const message = String(err?.message || "").toLowerCase();
  const expectedAuthMiss =
    message.includes("unauthorized") ||
    message.includes("invalid session") ||
    message.includes("user not found");

  if (expectedAuthMiss) return { sessions: {} };
  throw err;
}

function firstSessionId(sessions = {}) {
  return Object.keys(sessions)[0] || "";
}

export default function Account() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { user, activeUser, setUser, setActiveUser, switchAccount } = useAuth();

  const [flowId, setFlowId] = useState(searchParams.get("flow_id") || "");
  const [flow, setFlow] = useState(null);
  const [sessions, setSessions] = useState({});
  const [loading, setLoading] = useState(true);
  const [switchingId, setSwitchingId] = useState(null);
  const [error, setError] = useState("");
  const [fatalError, setFatalError] = useState("");
  const loadStartedRef = useRef(false);
  const redirectingRef = useRef(false);

  const accounts = useMemo(
    () => sessionsToList(sessions, activeUser),
    [sessions, activeUser]
  );
  const accountReturnTo = normalizeAccountManagerReturnTo(
    searchParams.get("returnTo") || searchParams.get("continue")
  );
  const chooserRequired = shouldSelectAccount(searchParams);

  const startFlow = useCallback(async () => {
    const existingFlowId = searchParams.get("flow_id");
    if (existingFlowId) return existingFlowId;

    const hasServiceRequest = hasAnyServiceParams(searchParams);
    const hasAccountManagerRequest = isAuthRequest(searchParams);

    if (!hasServiceRequest && !hasAccountManagerRequest) {
      throw new Error("Missing auth request parameters");
    }

    if (hasServiceRequest && !validateServiceRequestParams(searchParams)) {
      throw new Error("Invalid service auth request");
    }

    let data;

    if (searchParams.get("client_id")) {
      data = await api.post("/idp/flows/init", {
        client_id: searchParams.get("client_id"),
        redirect_uri: searchParams.get("redirect_uri"),
        state: searchParams.get("state"),
        code_challenge: searchParams.get("code_challenge"),
        code_challenge_method: searchParams.get("code_challenge_method"),
      });
    } else {
      data = await api.post("/idp/flows/account-center", {
        returnTo: accountReturnTo,
      });
    }

    if (!data?.flowId) {
      throw new Error("Unable to create Account Center flow");
    }

    const nextUrl = buildAccountCenterReturnTo(data.flowId, {
      reqType: searchParams.get("reqType") || "",
      prompt: searchParams.get("prompt") || "",
      returnTo: data.client?.client_type === "account_center" ? accountReturnTo : "",
    });
    window.history.replaceState(null, "", nextUrl);
    return data.flowId;
  }, [accountReturnTo, searchParams]);

  const continueWithSession = useCallback(async ({ nextFlowId, nextFlow, sessionId }) => {
    if (!sessionId) return false;

    await switchAccount(sessionId);

    const approved = await api.post(`/idp/flows/${encodeURIComponent(nextFlowId)}/approve`);
    writeAccountCenterGrant({ flow: nextFlow, flowId: nextFlowId, userSessionId: sessionId });
    redirectingRef.current = true;
    window.location.assign(approved.redirectTo);
    return true;
  }, [switchAccount]);

  const loadPage = useCallback(async () => {
    if (loadStartedRef.current || redirectingRef.current) return;
    loadStartedRef.current = true;

    try {
      setLoading(true);
      setError("");
      setFatalError("");

      const nextFlowId = await startFlow();
      setFlowId(nextFlowId);

      const flowData = await api.get(`/idp/flows/${encodeURIComponent(nextFlowId)}`);
      const nextFlow = flowData.flow;
      const nextFlowRole = getAccountCenterRole(nextFlow);
      const authResult = readAccountCenterAuthResult(nextFlowId);
      const signedInSessionId = activeUser || authResult?.sessionId;
      const signedInUser = user || authResult?.user;

      setFlow(nextFlow);

      if (
        nextFlowRole === ACCOUNT_CENTER_ROLES.ACCOUNT_MANAGER &&
        signedInSessionId &&
        signedInUser?.username
      ) {
        flushSync(() => {
          setUser(signedInUser);
          setActiveUser(signedInSessionId);
        });
        writeAccountCenterGrant({
          flow: nextFlow,
          flowId: nextFlowId,
          userSessionId: signedInSessionId,
        });
        clearAccountCenterAuthResult(nextFlowId);
        redirectingRef.current = true;
        navigate(accountReturnTo, { replace: true });
        return;
      }

      const sessionData = await api.get("/auth/sessions").catch(emptySessionsForExpectedAuthError);
      const nextSessions = sessionData.sessions || {};
      const activeSessionId = sessionData.active || activeUser || firstSessionId(nextSessions);

      setSessions(nextSessions);

      if (!Object.keys(nextSessions).length) {
        const loginReturnTo = buildAccountCenterReturnTo(nextFlowId, {
          prompt: ACCOUNT_CENTER_PROMPTS.CONTINUE,
          returnTo: nextFlowRole === ACCOUNT_CENTER_ROLES.ACCOUNT_MANAGER
            ? accountReturnTo
            : "",
        });

        redirectingRef.current = true;
        navigate(buildLoginFlowPath(loginReturnTo), { replace: true });
        return;
      }

      if (!chooserRequired) {
        await continueWithSession({
          nextFlowId,
          nextFlow,
          sessionId: activeSessionId,
        });
      }
    } catch (err) {
      if (redirectingRef.current) return;
      setFatalError(err?.message || "Unable to load Account Center");
      setSessions({});
    } finally {
      if (!redirectingRef.current) {
        setLoading(false);
      }
    }
  }, [
    accountReturnTo,
    activeUser,
    chooserRequired,
    continueWithSession,
    navigate,
    setActiveUser,
    setUser,
    startFlow,
    user,
  ]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const handleUseAccount = async (sessionId) => {
    try {
      setSwitchingId(sessionId);
      setError("");

      await continueWithSession({
        nextFlowId: flowId,
        nextFlow: flow,
        sessionId,
      });
    } catch (err) {
      setError(err?.message || "Unable to continue with this account");
    } finally {
      setSwitchingId(null);
    }
  };

  const handleAddAccount = () => {
    navigate(buildLoginFlowPath(buildAccountCenterReturnTo(flowId, {
      prompt: ACCOUNT_CENTER_PROMPTS.CONTINUE,
      returnTo: getAccountCenterRole(flow) === ACCOUNT_CENTER_ROLES.ACCOUNT_MANAGER
        ? accountReturnTo
        : "",
    }), { flow: "add" }));
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[var(--theme)]">
        <FormTop size={16} />
      </div>
    );
  }

  if (fatalError) {
    return (
      <div className="container flex sm:justify-center items-center min-w-full h-[100dvh] bg-[var(--theme)] px-4">
        <div className="gpu-safe max-w-[500px] w-full relative px-4 lg:p-6 flex flex-col gap-5 rounded-lg shadow-md shadow-[var(--border)]">
          <img src="/favicon.png" alt="Logo" width={30} height={30} />
          <div>
            <h1 className="text-3xl font-semibold text-[var(--gray-900)]">
              Invalid auth request
            </h1>
            <p className="text-[var(--gray-600)] mt-2">
              {fatalError}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            className="w-full p-3 rounded-lg bg-[var(--blue-600)] text-white font-medium hover:opacity-90 transition"
          >
            Start again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex sm:justify-center items-center min-w-full h-[100dvh] bg-[var(--theme)] px-4">
      <Helmet>
        <title>BAuth - Accounts</title>
        <link rel="canonical" href="https://joinshivam-bauth.vercel.app" />
      </Helmet>

      <div className="gpu-safe max-w-[500px] w-full relative px-4 lg:p-6 flex flex-col gap-6 rounded-lg shadow-md shadow-[var(--border)]">
        <Header flow={flow} />

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex flex-col gap-3">
          {accounts.map((account) => (
            <AccountButton
              key={account.sessionId}
              account={account}
              loading={switchingId === account.sessionId}
              disabled={!!switchingId}
              onClick={() => handleUseAccount(account.sessionId)}
            />
          ))}

          <button
            type="button"
            onClick={handleAddAccount}
            className="w-full p-3 rounded-lg border border-[var(--border)] text-[var(--gray-800)] hover:bg-[var(--gray-100)] transition"
          >
            + Add Account
          </button>
        </div>
      </div>
    </div>
  );
}

function Header({ flow }) {
  const serviceName = flow?.name || "Account Center";
  const role = getAccountCenterRole(flow);

  return (
    <div className="flex flex-col gap-2">
      <img src="/favicon.png" alt="Logo" width={30} height={30} />
      <h1 className="text-3xl font-semibold text-[var(--gray-900)]">
        Continue to {serviceName}
      </h1>
      <p className="text-[var(--gray-600)]">
        {role === "account_manager"
          ? "Choose which BAuth account you want to open."
          : "Choose which BAuth account this service can use."}
      </p>
    </div>
  );
}

function AccountButton({ account, loading, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-3 p-3 rounded-lg border border-[var(--border)] text-left transition ${account.current ? "bg-[var(--blue-50)]" : "hover:bg-[var(--gray-100)]"
        } ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 shrink-0 rounded-full bg-[var(--gray-300)] flex items-center justify-center text-[var(--gray-700)] font-semibold">
          <img src={`${API_BASE}/media/profile/${account.username}`} alt={account.name} className="h-full w-full rounded-full object-cover" />

        </div>

        <div className="flex flex-col items-start min-w-0">
          <span className="text-[var(--gray-900)] font-medium truncate">
            {account.name}
          </span>
          <span className="text-sm opacity-60 truncate">@{account.username}</span>
        </div>
      </div>

      <div className="text-xs text-[var(--blue-600)] shrink-0">
        {loading ? "Continuing..." : account.current ? "Current" : "Use"}
      </div>
    </button>
  );
}
