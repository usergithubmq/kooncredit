import axios from "axios";

const api = axios.create({
    // Si estamos en desarrollo usa localhost, si no, usa la URL de producción
    baseURL: import.meta.env.VITE_API_URL || "https://api.koonfinansen.com.mx/api",
    withCredentials: true, // 👈 IMPORTANTE para que las cookies de sesión funcionen en el navegador
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    config.headers.Accept = "application/json";

    // Solo ponemos JSON si no estamos enviando archivos (como la INE)
    if (!(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
    }

    if (token && token !== "undefined" && token !== "") {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;