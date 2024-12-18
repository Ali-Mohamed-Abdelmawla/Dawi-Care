// useEmployeeApi.ts

import axiosInstance from "../../helper/auth/axios";
import { Employee } from "./employeeInterfaces";

export const useEmployeeApi = () => {
  const accessToken = sessionStorage.getItem("accessToken");

  const getAllEmployees = async (): Promise<Employee[]> => {
    const response = await axiosInstance.get("/api/All_Employee", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  };

  const updateEmployee = async (employee: Employee,WeekDays: string): Promise<Employee> => {
    const response = await axiosInstance.post(
      `/api/Edit_Employee/${employee.id}`,
      {
        ...employee,
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

  const deleteEmployee = async (employeeId: number): Promise<void> => {
    await axiosInstance.post(
      `/api/Delete_Employee/${employeeId}`,
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
    employeeId: number,
    WeekDays: string
  ): Promise<void> => {
    await axiosInstance.post(
      `/api/Edit_all_Week_day/${employeeId}`,
      {
        data: WeekDays,
        type: "employee",
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
    getAllEmployees,
    updateEmployee,
    deleteEmployee,
    EditAllWeekDays,
  };
};
