import axios from "axios";

// Default API base matches the backend .env PORT (3000) unless overridden.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

export default apiClient;
