// useDoctorApi.ts
import axiosInstance from "../../helper/auth/axios";
import { Doctor } from "./doctorInterfaces";

export const useDoctorApi = () => {
  const accessToken = sessionStorage.getItem("accessToken");

  const getAllDoctors = async (): Promise<Doctor[]> => {
    const response = await axiosInstance.get("/api/All_doctors", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  };

  const updateDoctor = async (
    doctor: Doctor,
    WeekDays: string
  ): Promise<Doctor> => {
    const response = await axiosInstance.post(
      `/api/Edit_Doctor/${doctor.id}`,
      {
        ...doctor,
        data: WeekDays
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  };

  const deleteDoctor = async (doctorId: number): Promise<void> => {
    await axiosInstance.post(
      `/api/Delete_Doctor/${doctorId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  };

  const EditAllWeekDays = async (
    doctorId: number,
    WeekDays: Array<string>,
    personType: string
  ): Promise<void> => {
    await axiosInstance.post(
      `/api/Edit_all_Week_day/${doctorId}`,
      {
        data: WeekDays.toString(),
        type: personType,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  };

  return {
    getAllDoctors,
    updateDoctor,
    deleteDoctor,
    EditAllWeekDays,
  };
};
