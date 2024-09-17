// useUserApi.ts
import axiosInstance from "../../helper/auth/axios";
import { User } from "./userInterfaces";

export const useUserApi = () => {
  const accessToken = sessionStorage.getItem("accessToken");

  const getAllUsers = async (): Promise<User[]> => {
    const response = await axiosInstance.get("/api/All_Users", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  };

  const updateUser = async (user: User): Promise<User> => {
    const response = await axiosInstance.post(
      `/api/Edit_User/${user.id}`,
      user,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  };

  const deleteUser = async (userId: number): Promise<void> => {
    await axiosInstance.post(
      `/api/Delete_User/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  };

  return {
    getAllUsers,
    updateUser,
    deleteUser,
  };
};
