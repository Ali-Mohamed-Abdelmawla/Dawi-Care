import React, { useState, useEffect } from "react";
import axiosInstance from "../../helper/auth/axios";
import AbsencePresentation from "./absencePresentation";
import {
  formatDateWithArabicDay,
  getChosenDayID,
} from "./absenceHelperFunctions";
import {
  AttendanceData,
  PersonOption,
  SwapDayFormData
} from "./AbsenceInterfaces";
import sweetAlertInstance from "../../helper/SweetAlert";

const AbsenceContainer: React.FC = () => {
  const accessToken = sessionStorage.getItem("accessToken");
  const [selectedPersonAttendance, setSelectedPersonAttendance] = useState<AttendanceData[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<PersonOption | null>(null);
  const [personType, setPersonType] = useState<'doctor' | 'employee'>('doctor');



  
  useEffect(() => {
    // Retrieve saved data from sessionStorage on component mount
    const savedPersonType = sessionStorage.getItem('selectedPersonType');
    const savedPerson = sessionStorage.getItem('selectedPerson');

    if (savedPersonType) {
      setPersonType(savedPersonType as 'doctor' | 'employee');
    }

    if (savedPerson) {
      const parsedPerson = JSON.parse(savedPerson);
      setSelectedPerson(parsedPerson);
      getAttendanceByPersonID(parsedPerson.value, savedPersonType as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAttendanceByPersonID = async (
    id: number | undefined,
    personType: string
  ) => {
    try {
      const endpoint = personType === "doctor" ? `/api/get_doctor_attendence/${id}` : `/api/get_employee_attendence/${id}`;
      const response = await axiosInstance.get(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const attendanceData = response.data.attendance_data;
      setSelectedPersonAttendance(attendanceData);
      return attendanceData;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const submitAbsence = (date: Date, personInfo: PersonOption) => {
    const dayInfo = formatDateWithArabicDay(date);
    const dayID = getChosenDayID(dayInfo, personInfo);

    sweetAlertInstance
      .fire({
        title: "هل انت متاكد ؟",
        text: `سيتم تسجيل غياب ${personType === 'doctor' ? 'الطبيب' : 'الموظف'} "${personInfo.label}" يوم "${dayInfo.arabicDayName}" الموافق "${dayInfo.formattedDate}" `,
        icon: "warning",
        confirmButtonText: "نعم",
        cancelButtonText: "لا",
        showCancelButton: true,
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
              if (response.data.message.includes("attendance already taken")) {
                sweetAlertInstance.fire({
                  icon: "error",
                  title: "غياب مسجل مسبقاً",
                  text: `عذراً، هذا ${personType === 'doctor' ? 'الطبيب' : 'الموظف'} مسجل غيابه مسبقاً في هذا اليوم.`,
                });
              } else {
                sweetAlertInstance
                  .fire({
                    icon: "success",
                    title: `تم تسجيل غياب ${personType === 'doctor' ? 'الطبيب' : 'الموظف'}`,
                    text: `تم تسجيل غياب ${personType === 'doctor' ? 'الطبيب' : 'الموظف'} "${personInfo.label}" يوم "${dayInfo.arabicDayName}" الموافق "${dayInfo.formattedDate}" `,
                  })
                  .then(() => {
                    // Save current state to sessionStorage before reloading
                    sessionStorage.setItem('selectedPersonType', personType);
                    sessionStorage.setItem('selectedPerson', JSON.stringify(personInfo));
                    window.location.reload();
                  });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
  };

  const updateAbsenceStatus = async (date: Date, personInfo: PersonOption) => {
    const dayInfo = formatDateWithArabicDay(date);
    const dayID = getChosenDayID(dayInfo, personInfo);

    sweetAlertInstance
      .fire({
        title: "هل انت متاكد ؟",
        text: `سيتم تعديل حالة غياب ${personType === 'doctor' ? 'الطبيب' : 'الموظف'} "${personInfo.label}" يوم "${dayInfo.arabicDayName}" الموافق "${dayInfo.formattedDate}" `,
        icon: "warning",
        confirmButtonText: "نعم",
        cancelButtonText: "لا",
        showCancelButton: true,
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
              if (response.status === 200) {
                sweetAlertInstance
                  .fire({
                    icon: "success",
                    title: `تم تعديل حالة غياب ${personType === 'doctor' ? 'الطبيب' : 'الموظف'}`,
                    text: `تم تعديل حالة غياب ${personType === 'doctor' ? 'الطبيب' : 'الموظف'} "${personInfo.label}" يوم "${dayInfo.arabicDayName}" الموافق "${dayInfo.formattedDate}" `,
                  })
                  .then(() => {
                    // Save current state to sessionStorage before reloading
                    sessionStorage.setItem('selectedPersonType', personType);
                    sessionStorage.setItem('selectedPerson', JSON.stringify(personInfo));
                    window.location.reload();
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
                  text: `تم تعديل حالة هذا ${personType === 'doctor' ? 'الطبيب' : 'الموظف'} كغائب لهذا اليوم بالفعل.`,
                });
              }
            });
        }
      });
  };

  const handlePersonChange = async (selectedOption: PersonOption | null) => {
    setSelectedPerson(selectedOption);
    if (selectedOption) {
      await getAttendanceByPersonID(selectedOption.value, personType);
    }
  };

  const handlePersonTypeChange = (newPersonType: 'doctor' | 'employee') => {
    setPersonType(newPersonType);
    setSelectedPerson(null);
    // Clear sessionStorage when changing person type
    sessionStorage.removeItem('selectedPersonType');
    sessionStorage.removeItem('selectedPerson');
  };

  const handleSwapDaySubmit = async (data: SwapDayFormData) => {
    if (!selectedPerson) {
      sweetAlertInstance.fire({
        icon: "error",
        title: "خطأ",
        text: "يرجى اختيار شخص أولاً",
      });
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/api/switchday/${selectedPerson.value}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          params: {
            data: `${data.day},${data.time}`,
            type: personType,
            created_at: data.date,
          },
        }
      );

      if (response.status === 200) {
        sweetAlertInstance.fire({
          icon: "success",
          title: "تم تبديل اليوم بنجاح",
          text: `تم تبديل يوم العمل لـ ${selectedPerson.label} إلى ${data.day} في ${data.date}`,
        });
        // Refresh the attendance data
        getAttendanceByPersonID(selectedPerson.value, personType);
      }
    } catch (error) {
      console.error(error);
      sweetAlertInstance.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء محاولة تبديل اليوم. يرجى المحاولة مرة أخرى.",
      });
    }
  };

  return (
    <AbsencePresentation
      handleMarkAsAbsent={submitAbsence}
      getAttendanceByPersonID={getAttendanceByPersonID}
      selectedPersonAttendance={selectedPersonAttendance}
      updateAbsenceStatus={updateAbsenceStatus}
      selectedPerson={selectedPerson}
      personType={personType}
      onPersonChange={handlePersonChange}
      onPersonTypeChange={handlePersonTypeChange}
      handleSwapDaySubmit={handleSwapDaySubmit}
    />
  );
};

export default AbsenceContainer;