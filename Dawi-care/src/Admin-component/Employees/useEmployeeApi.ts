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

  const updateEmployee = async (employee: Employee): Promise<Employee> => {
    const response = await axiosInstance.post(
      `/api/Edit_Employee/${employee.id}`,
      employee,
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
      `/api/Edit_all_employee_weekdays/${employeeId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          data: WeekDays,
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
