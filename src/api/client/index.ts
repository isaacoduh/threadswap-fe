import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://threadswap-backend-production.up.railway.app/api/v1';



export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30_000
});

api.interceptors.request.use((config) => {
    if(typeof window !== "undefined") {
        const token = window.localStorage.getItem("access_token");
        if(token){
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
});

api.interceptors.response.use(
    (res) => res,
    (error) => {
        // Minimal shape normalized to catch it in UI
        const status = error?.response?.status ?? 0;
        const data = error?.response?.data;
        const message = data?.message ?? data?.detail ?? error?.message ?? "Request failed"
        return Promise.reject({status, message, data});
    }
)