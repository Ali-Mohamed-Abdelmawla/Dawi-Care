//absenceContainer.tsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../helper/auth/axios";
import AbsencePresentation from "./absencePresentation";
import {
  formatDateWithArabicDay,
  getChosenDayID,
} from "./absenceHelperFunctions.tsx";

import {
  Doctor,
  AbsencePresentationProps,
  AttendanceData,
  Employee
} from "./AbsenceInterfaces.ts";
import sweetAlertInstance from "../../helper/SweetAlert";

const AbsenceContainer: React.FC = () => {
  const accessToken = sessionStorage.getItem("accessToken");
  const [doctors, setDoctors] = useState<Doctor[] | null>(null);
  const [selectedDoctorAttendance, setSelectedDoctorAttendance] = useState<
    AttendanceData[]
  >([]);
  const [employees, setEmployees] = useState<Employee[] | null>(null);

  useEffect(() => {
    fetchDoctors();
    fetchEmployees();

  }, [accessToken]);

  const fetchDoctors = () => {
    axiosInstance
      .get<Doctor[]>("/api/All_doctors", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        setDoctors(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }


  const fetchEmployees = () => {
    axiosInstance
      .get<Employee[]>("/api/All_Employee", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        setEmployees(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAttendanceByDoctorID = async (id: number | undefined, personType: string) => {
    console.log(id, personType);
    try {
      const response = await axiosInstance.get(
        `/api/get_doctor_attendence/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const attendanceData = response.data.attendance_data;
      setSelectedDoctorAttendance(attendanceData);
      return attendanceData;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

   const submitAbsence: AbsencePresentationProps["handleMarkAsAbsent"] = (
    date,
    doctorInfo
  ) => {
    const dayInfo = formatDateWithArabicDay(date);
    const dayID = getChosenDayID(dayInfo, doctorInfo);

    sweetAlertInstance
      .fire({
        title: "هل انت متاكد ؟",
        text: `سيتم تسجيل غياب الطبيب "${doctorInfo.label}" يوم "${dayInfo.arabicDayName}" الموافق "${dayInfo.formattedDate}" `,
        icon: "warning",
        confirmButtonText: "نعم",
        cancelButtonText: "لا",
        showCancelButton: true,
        timer: undefined,
      })
      .then((result) => {
        if (result.isConfirmed) {
          axiosInstance
            .post(
              `/api/attendencezero/${dayID}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
                params: {
                  created_at: dayInfo.formattedDate,
                },
              }
            )
            .then((response) => {
              console.log(response);
              if (response.data.message.includes("attendance already taken")) {
                sweetAlertInstance.fire({
                  icon: "error",
                  title: "غياب مسجل مسبقاً",
                  text: "عذراً، هذا الطبيب مسجل غيابه مسبقاً في هذا اليوم.",
                });
              } else {
                sweetAlertInstance.fire({
                  icon: "success",
                  title: "تم تسجيل غياب الطبيب",
                  text: `تم تسجيل غياب الطبيب "${doctorInfo.label}" يوم "${dayInfo.arabicDayName}" الموافق "${dayInfo.formattedDate}" `,
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          return;
        }
      });
  };

  const updateAbsenceStatus: AbsencePresentationProps["updateAbsenceStatus"] =
    async (date, doctorInfo) => {
      const dayInfo = formatDateWithArabicDay(date);
      const dayID = getChosenDayID(dayInfo, doctorInfo);

      sweetAlertInstance
        .fire({
          title: "هل انت متاكد ؟",
          text: `سيتم تعديل حالة غياب الطبيب "${doctorInfo.label}" يوم "${dayInfo.arabicDayName}" الموافق "${dayInfo.formattedDate}" `,
          icon: "warning",
          confirmButtonText: "نعم",
          cancelButtonText: "لا",
          showCancelButton: true,
          timer: undefined,
        })
        .then((result) => {
          if (result.isConfirmed) {
            axiosInstance
              .post(
                `/api/deleteattendence/${dayID}`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                  },
                  params: {
                    date: dayInfo.formattedDate,
                  },
                }
              )
              .then((response) => {
                console.log(response);
                if (response.status === 200) {
                  sweetAlertInstance.fire({
                    icon: "success",
                    title: "تم تسجيل غياب الطبيب",
                    text: `تم تسجيل غياب الطبيب "${doctorInfo.label}" يوم "${dayInfo.arabicDayName}" الموافق "${dayInfo.formattedDate}" `,
                  });
                }
              })
              .catch((error) => {
                console.log(error);
                if (
                  error.response.data.message.includes(
                    "No attendance record found for the given date and ID"
                  )
                ) {
                  sweetAlertInstance.fire({
                    icon: "error",
                    title: "تم تعديل حاله الغياب مسبقاً",
                    text: "تم تسجيل هذا الطبيب كحاضر لهذا اليوم بالفعل. يرجى اختيار يوم آخر.",
                  });
                }
              });
          }
        });
    };

  return (
    <AbsencePresentation
      doctors={doctors}
      employees = {employees}
      handleMarkAsAbsent={submitAbsence}
      getAttendanceByDoctorID={getAttendanceByDoctorID}
      selectedDoctorAttendance={selectedDoctorAttendance}
      updateAbsenceStatus={updateAbsenceStatus}
    />
  );
};

export default AbsenceContainer;


