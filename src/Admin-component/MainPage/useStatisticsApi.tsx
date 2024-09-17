import { useState, useEffect } from "react";
import { PersonOption } from "../../Admin-component/AbsenceSubmission/AbsenceInterfaces";
import { AttendanceData } from "./Statistics-Interfaces";
import axiosInstance from "../../helper/auth/axios";
import sweetAlertInstance from "../../helper/SweetAlert";

const useStatisticsApi = () => {
  const [selectedPerson, setSelectedPerson] = useState<PersonOption | null>(null);
  const [personType, setPersonType] = useState<"doctor" | "employee">("doctor");
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);
  const accessToken = sessionStorage.getItem("accessToken");

  const handlePersonTypeChange = (
    event: React.SyntheticEvent,
    newValue: "doctor" | "employee"
  ) => {
    console.log(event);
    setPersonType(newValue);
    setSelectedPerson(null);
    setNoDataMessage(null);
  };

  const handlePersonChange = (selected: PersonOption | null) => {
    setSelectedPerson(selected);
    setNoDataMessage(null);
  };

  useEffect(() => {
    if (selectedPerson) {
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
    }
  }, [selectedPerson, personType, accessToken]);

  return {
    selectedPerson,
    personType,
    attendanceData,
    noDataMessage,
    handlePersonTypeChange,
    handlePersonChange,
  };
};

export default useStatisticsApi;