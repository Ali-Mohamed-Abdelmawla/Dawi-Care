// import axios from "axios";

// const axiosInstance = axios.create({
//     baseURL: "http://127.0.0.1:8000",  
// });

// export default axiosInstance;

// // baseURL: "https://crowd-funding.site",  


import axios from "axios";

// Dynamic base URL that can be configured per environment/user
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
console.log(import.meta.env.VITE_API_BASE_URL)
const axiosInstance = axios.create({
    baseURL,
    // You can add other common configurations here
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

// Optional: Add request/response interceptors if needed
axiosInstance.interceptors.request.use(
    (config) => {
        // Add any auth tokens or other headers here
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;