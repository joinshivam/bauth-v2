import { apiRequest } from "./api"
const API_BASE = process.env.REACT_APP_API_BASE;
export const updateName = async (Name) => {
    return await apiRequest("/api/auth/update-name", {
        method: "PUT",
        body: { name: Name }
    });
};
export const updateUsername = async (Username) => {
    return await apiRequest("/api/auth/update-username", {
        method: "PUT",
        body: { username: Username }
    });
};
export const updateDOB = async (dob) => {
    return await apiRequest("/api/auth/update-dob", {
        method: "PUT",
        body: { dob: dob }
    });
};
export const updateGender = async (gender) => {
    return await apiRequest("/api/auth/update-gender", {
        method: "PUT",
        body: { gender: gender }
    });
};
export const updatePhone = async (phone) => {
    return await apiRequest("/api/auth/update-phone", {
        method: "PUT",
        body: { phone: phone }
    });
};
export const updatePhoto = async (file) => {
    const formData = new FormData();
    formData.append("photo", file);
    const res = await fetch(`${API_BASE}/api/auth/update-photo`, {
        method: "PUT",
        credentials: "include",
        body: formData
    });

    return await res.json();
};