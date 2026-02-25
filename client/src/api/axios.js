import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

/* ================= REQUEST INTERCEPTOR ================= */
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("hr_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("hr_token");
            localStorage.removeItem("hr_user");

            // prevent infinite reload loop
            if (!window.location.pathname.includes("login")) {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default API;