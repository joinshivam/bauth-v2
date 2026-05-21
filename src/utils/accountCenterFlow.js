export const ACCOUNT_CENTER_STORAGE_KEY = "account_center";
export const ACCOUNT_CENTER_AUTH_RESULT_KEY = "account_center_auth_result";
export const ACCOUNT_MANAGER_PATH = "/myaccount";
export const ACCOUNT_CENTER_PATH = "/account-center";

export const ACCOUNT_CENTER_ROLES = {
  ACCOUNT_MANAGER: "account_manager",
  IDENTITY_PROVIDER: "identity_provider",
};

export const ACCOUNT_CENTER_PROMPTS = {
  SELECT: "select_account",
  CONTINUE: "continue",
};

const ACCOUNT_MANAGER_GRANT_TTL_MS = 60 * 60 * 1000;
const ACCOUNT_CENTER_AUTH_RESULT_TTL_MS = 2 * 60 * 1000;

const SSO_PARAMS = [
  "client_id",
  "redirect_uri",
  "state",
  "code_challenge",
  "code_challenge_method",
];

export function getAccountCenterRole(flow) {
  return flow?.client_type === "account_center"
    ? ACCOUNT_CENTER_ROLES.ACCOUNT_MANAGER
    : ACCOUNT_CENTER_ROLES.IDENTITY_PROVIDER;
}

export function isAuthRequest(searchParams) {
  return searchParams.get("reqType") === "auth";
}

export function shouldSelectAccount(searchParams) {
  return isAuthRequest(searchParams) && searchParams.get("prompt") !== ACCOUNT_CENTER_PROMPTS.CONTINUE;
}

export function normalizeAccountManagerReturnTo(value) {
  if (!value) return ACCOUNT_MANAGER_PATH;

  try {
    const url = new URL(value, window.location.origin);

    if (url.origin !== window.location.origin) return ACCOUNT_MANAGER_PATH;

    if (url.pathname === "/u") return ACCOUNT_MANAGER_PATH;
    if (url.pathname.startsWith("/u/")) {
      return `${ACCOUNT_MANAGER_PATH}${url.pathname.slice(2)}${url.search}`;
    }

    if (url.pathname === ACCOUNT_MANAGER_PATH || url.pathname.startsWith(`${ACCOUNT_MANAGER_PATH}/`)) {
      return `${url.pathname}${url.search}`;
    }

    return ACCOUNT_MANAGER_PATH;
  } catch {
    return ACCOUNT_MANAGER_PATH;
  }
}

export function buildAccountCenterReturnTo(flowId, options = {}) {
  const url = new URL(ACCOUNT_CENTER_PATH, window.location.origin);

  if (flowId) {
    url.searchParams.set("flow_id", flowId);
  }

  if (options.reqType) {
    url.searchParams.set("reqType", options.reqType);
  }

  if (options.prompt) {
    url.searchParams.set("prompt", options.prompt);
  }

  if (options.returnTo) {
    url.searchParams.set("returnTo", normalizeAccountManagerReturnTo(options.returnTo));
  }

  return `${url.pathname}${url.search}`;
}

export function buildAccountManagerAuthRequest(returnTo = ACCOUNT_MANAGER_PATH, options = {}) {
  return buildAccountCenterReturnTo("", {
    reqType: "auth",
    prompt: options.prompt,
    returnTo,
  });
}

export function buildLoginFlowPath(returnTo, options = {}) {
  const url = new URL("/account-center/login/flow", window.location.origin);
  const safeReturnTo = normalizeAccountCenterReturnTo(returnTo);

  if (safeReturnTo) {
    url.searchParams.set("returnTo", safeReturnTo);
  }

  if (options.flow) {
    url.searchParams.set("flow", options.flow);
  }

  return `${url.pathname}${url.search}`;
}

export function buildSignupFlowPath(returnTo) {
  const url = new URL("/account-center/signup/flow", window.location.origin);
  const safeReturnTo = normalizeAccountCenterReturnTo(returnTo);

  if (safeReturnTo) {
    url.searchParams.set("returnTo", safeReturnTo);
  }

  return `${url.pathname}${url.search}`;
}

export function hasAnyServiceParams(searchParams) {
  return SSO_PARAMS.some((key) => !!searchParams.get(key));
}

export function validateServiceRequestParams(searchParams) {
  if (!hasAnyServiceParams(searchParams)) return true;

  const missing = SSO_PARAMS.filter((key) => !searchParams.get(key));
  if (missing.length) return false;

  return searchParams.get("code_challenge_method") === "S256";
}

export function normalizeAccountCenterReturnTo(value) {
  if (!value) return "";

  try {
    const url = new URL(value, window.location.origin);

    if (url.origin !== window.location.origin) return "";
    if (url.pathname !== ACCOUNT_CENTER_PATH) return "";

    const hasFlow = !!url.searchParams.get("flow_id");
    const hasAuthRequest = url.searchParams.get("reqType") === "auth";
    const hasServiceParams = hasAnyServiceParams(url.searchParams);

    if (!hasFlow && !hasAuthRequest && !hasServiceParams) return "";

    const returnTo = url.searchParams.get("returnTo") || url.searchParams.get("continue");
    if (returnTo) {
      url.searchParams.set("returnTo", normalizeAccountManagerReturnTo(returnTo));
      url.searchParams.delete("continue");
    }

    return `${url.pathname}${url.search}`;
  } catch {
    return "";
  }
}

function accountCenterAuthResultKey(flowId) {
  return `${ACCOUNT_CENTER_AUTH_RESULT_KEY}:${flowId || "default"}`;
}

export function getAccountCenterFlowId(value) {
  const safeReturnTo = normalizeAccountCenterReturnTo(value);
  if (!safeReturnTo) return "";

  try {
    const url = new URL(safeReturnTo, window.location.origin);
    return url.searchParams.get("flow_id") || "";
  } catch {
    return "";
  }
}

export function writeAccountCenterAuthResult(returnTo, result = {}) {
  const flowId = getAccountCenterFlowId(returnTo);
  if (!flowId || !result?.sessionId || !result?.user?.username) return;

  sessionStorage.setItem(
    accountCenterAuthResultKey(flowId),
    JSON.stringify({
      sessionId: result.sessionId,
      user: result.user,
      createdAt: Date.now(),
      expiresAt: Date.now() + ACCOUNT_CENTER_AUTH_RESULT_TTL_MS,
    })
  );
}

export function readAccountCenterAuthResult(flowId) {
  if (!flowId) return null;

  try {
    const key = accountCenterAuthResultKey(flowId);
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;

    const data = JSON.parse(raw);
    if (!data?.sessionId || !data?.user?.username || Date.now() > data.expiresAt) {
      sessionStorage.removeItem(key);
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export function clearAccountCenterAuthResult(flowId) {
  if (!flowId) return;
  sessionStorage.removeItem(accountCenterAuthResultKey(flowId));
}

export function writeAccountCenterGrant({ flow, flowId, userSessionId }) {
  const role = getAccountCenterRole(flow);

  sessionStorage.setItem(
    ACCOUNT_CENTER_STORAGE_KEY,
    JSON.stringify({
      approved: true,
      role,
      flowId,
      clientId: flow?.client_id,
      clientType: flow?.client_type,
      userSessionId,
      approvedAt: Date.now(),
      expiresAt: Date.now() + ACCOUNT_MANAGER_GRANT_TTL_MS,
    })
  );
}

export function readAccountCenterGrant() {
  try {
    const raw = sessionStorage.getItem(ACCOUNT_CENTER_STORAGE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);

    if (!data?.approved || !data?.role || !data?.expiresAt) {
      clearAccountCenterGrant();
      return null;
    }

    if (Date.now() > data.expiresAt) {
      clearAccountCenterGrant();
      return null;
    }

    return data;
  } catch {
    clearAccountCenterGrant();
    return null;
  }
}

export function hasAccountManagerAccess(activeSessionId) {
  const grant = readAccountCenterGrant();

  return (
    grant?.role === ACCOUNT_CENTER_ROLES.ACCOUNT_MANAGER &&
    grant?.clientType === "account_center" &&
    grant?.userSessionId === activeSessionId
  );
}

export function clearAccountCenterGrant() {
  sessionStorage.removeItem(ACCOUNT_CENTER_STORAGE_KEY);
}
