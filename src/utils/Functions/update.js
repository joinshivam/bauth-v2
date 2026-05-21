import api from "../../lib/services/api";
export const updateName = async (Name) => {
    return await api.put("/user/update/name", { name: Name });
};
export const updateUsername = async (Username) => {
    return await api.put("/user/update/username", { username: Username });
};
export const updateDOB = async (dob) => {
    return await api.put("/user/update/dob", { dob });
};
export const updateGender = async (gender) => {
    return await api.put("/user/update/gender", { gender });
};
export const updatePhone = async (phone) => {
    return await api.put("/user/update/phone", { phone });
};
export const updatePhoto = async (file) => {
    const formData = new FormData();
    formData.append("photo", file);
    return await api.put("/user/update/photo", formData);
};