import axios from "axios";

const axiosInstance = axios.create({
    // baseURL: "http://127.0.0.1:8000",
    baseURL: "https://amused-robust-sailfish.ngrok-free.app",  // deployed
    headers: {
        "ngrok-skip-browser-warning": "true", // Add the required header here
    },
});

export default axiosInstance;

// baseURL: "https://crowd-funding.site",  
