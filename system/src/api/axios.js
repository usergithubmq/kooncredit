import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    config.headers.Accept = "application/json";

    // SOLO agregar Content-Type: application/json si NO estamos enviando FormData
    if (!(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
    }

    if (token && token !== "undefined" && token !== "") {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;