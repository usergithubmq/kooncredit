import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
});

// 👉 Interceptor que agrega headers necesarios para Sanctum
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    config.headers.Accept = "application/json";
    config.headers["Content-Type"] = "application/json";

    if (token && token !== "undefined" && token !== "") {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
