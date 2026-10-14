
import api from "./api";

export const getAllUsers = async (params = {}) => {
    const response = await api.get("/users", { params });
    return response.data;
};

export const getUserById = async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

export const getUserStats = async () => {
    const response = await api.get("/users/stats");
    return response.data;
};


export const updateUserRole = async (id, role) => {
    const response = await api.patch(`/users/${id}/role`, {
        role,
    });

    return response.data;
};