import api from "../../lib/services/api";
export const getSessions = async () => {
    return await api.get("/auth/sessions");
};
export const logout_all = async () => {
    return await api.post("/users/logout");
};
