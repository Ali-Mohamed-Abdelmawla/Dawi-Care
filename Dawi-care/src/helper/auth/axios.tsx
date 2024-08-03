import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://crowd-funding.site",  
});

export default axiosInstance;