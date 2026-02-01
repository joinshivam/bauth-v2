export const CHANNEL_NAME = "app-sync";

export const postSync = (payload) => {
  localStorage.setItem(CHANNEL_NAME, JSON.stringify({
    ...payload,
    ts: Date.now()
  }));
};

export const listenSync = (handler) => {
  const listener = (e) => {
    if (e.key === CHANNEL_NAME && e.newValue) {
      handler(JSON.parse(e.newValue));
    }
  };
  window.addEventListener("storage", listener);
  return () => window.removeEventListener("storage", listener);
};
