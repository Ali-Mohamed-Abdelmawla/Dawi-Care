import { useState } from "react";
import axiosInstance from "../helper/auth/axios";
import axios from "axios";
import { LoginFormInputs } from "./LoginInterfaces";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginFormInputs) => {
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      const response = await axiosInstance.post(
        "/api/login",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            email: data.email,
            password: data.password,
          },
        }
      );
      setLoading(false);
      console.log()

      if (response.data === "error") {
        // Handle the case where the API returns an error message
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        throw new Error("Invalid credentials");
      }

      sessionStorage.setItem("accessToken", response.data.token);
      console.log(response.data.data)
      sessionStorage.setItem("userData", JSON.stringify(response.data.data));

      return response.data;
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error) && error.response) {
        // Server responded with a status other than 2xx
        setError(error.response.data.message || "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.");
      } else if (axios.isAxiosError(error) && error.request) {
        // No response was received
        setError("لم يتم الحصول على استجابة من الخادم. يرجى المحاولة مرة أخرى لاحقًا.");
      }
      throw error;
    }
  };

  return { loading, error, login };
};

export default useLogin;
