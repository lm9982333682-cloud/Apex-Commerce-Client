
import api from "./api";

export const getMyOrders = async () => {
    const response = await api.get("/orders");
    return response.data;
};


export const getAllOrders = async (params = {}) => {
    const response = await api.get("/orders/admin/all", {
        params,
    });
    return response.data;
};

export const getOrderById = async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
};

export const updateOrderStatus = async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, {
        status,
    });
    return response.data;
};



export const updateOrderNotes = async (id, notes) => {
    const response = await api.patch(`/orders/${id}/notes`, {
        notes,
    });

    return response.data;
};


export const getOrderStats = async () => {
    const response = await api.get("/orders/admin/stats");
    return response.data;
};


