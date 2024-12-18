// src/Admin-component/Statistics/useStatisticsApi.ts

import { useState, useEffect } from "react";
import { PersonOption } from "../AbsenceSubmission/AbsenceInterfaces";
import { AttendanceData, SalaryData } from "./Statistics-Interfaces";
import axiosInstance from "../../helper/auth/axios";
import sweetAlertInstance from "../../helper/SweetAlert";

const useStatisticsApi = () => {
  const [selectedPerson, setSelectedPerson] = useState<PersonOption | null>(
    null
  );
  const [personType, setPersonType] = useState<"doctor" | "employee">("doctor");
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(
    null
  );
  const [salaryData, setSalaryData] = useState<SalaryData[] | null>(null);
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"statistics" | "salary">(
    "statistics"
  );
  const accessToken = sessionStorage.getItem("accessToken");

  const handleViewTypeChange = (
    newValue: "statistics" | "salary"
  ) => {
    setViewType(newValue);
    setSelectedPerson(null);
    setSalaryData(null);
  };

  const handlePersonTypeChange = (
    event: React.SyntheticEvent,
    newValue: "doctor" | "employee"
  ) => {
    console.log(event);
    setPersonType(newValue);
    setSelectedPerson(null);
    setNoDataMessage(null);
    setSalaryData(null);
  };

  const handlePersonChange = (selected: PersonOption | null) => {
    setSelectedPerson(selected);
    setNoDataMessage(null);
    setSalaryData(null);
  };

  const fetchSalaryData = async (doctorId: number,personType: string) => {
    try {
      const response = await axiosInstance.get(`/api/show_salary/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          type: personType,
        },
      });
      setSalaryData(response.data);
    } catch (error) {
      console.error(error);
      sweetAlertInstance.fire({
        title: "خطأ",
        text: "حدث خطأ أثناء جلب بيانات الراتب",
        icon: "error",
      });
      setSalaryData(null);
    }
  };

  useEffect(() => {
    if (selectedPerson) {
      if (viewType === "statistics") {
        const apiUrl =
          personType === "doctor"
            ? `/api/get_doctor_attendence/${selectedPerson.value}`
            : `/api/get_employee_attendence/${selectedPerson.value}`;

        axiosInstance
          .get(apiUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            if (
              response.data?.attendance_data &&
              response.data?.attendance_data.length > 0
            ) {
              setAttendanceData(response.data);
              setNoDataMessage(null);
            } else {
              sweetAlertInstance.fire({
                title: "لا توجد بيانات",
                text: "لم يتم العثور على بيانات الحضور لهذا الشخص",
                icon: "info",
              });
              setAttendanceData(null);
              setNoDataMessage(
                `لا توجد بيانات حضور لـ "${selectedPerson.label}"`
              );
            }
          })
          .catch((error) => {
            console.error(error);
            sweetAlertInstance.fire({
              title: "خطأ",
              text: "حدث خطأ أثناء جلب البيانات",
              icon: "error",
            });
            setAttendanceData(null);
            setNoDataMessage("حدث خطأ أثناء جلب البيانات");
          });
      } else if (viewType === "salary") {
        fetchSalaryData(selectedPerson.value, personType);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPerson, personType, viewType, accessToken]);

  const totalSalaryEquation = async (salaryId: number) => {
    try {
      const response = await axiosInstance.post(`/api/totalsalaryequation/${salaryId}`);
      return response.data;
    } catch (error) {
      console.error('Error recalculating salary:', error);
      return {
        status: "error",
        data: error,
      }
    } 
  };

  const markAsPaid = async (salaryId: number) => {
    try {
      const response = await axiosInstance.post(`api/getPayed/${salaryId}?value=1`);
      return response.data;
    } catch (error) {
      console.error('Error marking salary as paid:', error);
      throw error;
    }
  };

  const showDeductionBySalaryId = async(salaryId: number) => {
    try {
      const response = await axiosInstance.get(`/api/show_deduction/${salaryId}`);
      return response.data;
    } catch (error) {
      console.error('Error marking salary as paid:', error);
      throw error;
    }
  }

  return {
    selectedPerson,
    personType,
    viewType,
    attendanceData,
    salaryData,
    setSalaryData,
    noDataMessage,
    handleViewTypeChange,
    handlePersonTypeChange,
    handlePersonChange,
    totalSalaryEquation,
    markAsPaid,
    showDeductionBySalaryId
  };
};

export default useStatisticsApi;
