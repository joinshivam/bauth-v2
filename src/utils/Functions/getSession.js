import { apiRequest } from "./api"
const API_BASE = process.env.REACT_APP_API_BASE;
export const getSessions = async () => {
    return await apiRequest("/api/auth/session-history", {
        method: "GET",
    });
};
export const logout_all = async () => {
    return await apiRequest("/api/auth/logout-all", {
        method: "GET",
    });
};
