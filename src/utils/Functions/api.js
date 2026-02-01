const API_BASE = process.env.REACT_APP_API_BASE;

export async function apiRequest(url, { method = "GET", body, headers = {} } = {}) {

    const res = await fetch(`${API_BASE}${url}`, {
        method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...headers
        },
        body: body ? JSON.stringify(body) : undefined
    });

    const data = await res.json();
    if (!res.ok) {
        throw data;
    }

    return data;
}
