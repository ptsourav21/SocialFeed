import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://localhost:7039', // Your HTTPS backend port
});

// Intercept requests and add the Bearer token
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosClient;