import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // URL của backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm interceptor để xử lý token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
