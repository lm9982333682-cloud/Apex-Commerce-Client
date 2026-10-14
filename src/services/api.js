import axios from "axios";
import store from "../store/store.js";

const api = axios.create({
    baseURL: "http://localhost:4500/api",
    withCredentials: true,
});

api.interceptors.request.use(
    (requestConfig) => {

        const accessToken = store.getState().auth.accessToken;

        if (accessToken) {
            requestConfig.headers.Authorization = `Bearer ${accessToken}`;
        }

        return requestConfig;
    },
    (error) => Promise.reject(error)
);

export default api;