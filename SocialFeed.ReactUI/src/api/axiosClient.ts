import axios from 'axios';

// This acts like your Angular Interceptor / HttpClient setup
const axiosClient = axios.create({
    baseURL: 'https://localhost:7153', // Ensure this matches your .NET API port!
    headers: {
        'Content-Type': 'application/json',
    }
});

export default axiosClient;