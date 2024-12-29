import React, { useState, useEffect } from "react";
import AbsencePresentation from "./absencePresentation";
import { AttendanceData, PersonOption, SwapDayFormData } from "./AbsenceInterfaces";
import { useAbsenceApi } from "./useAbsenceApi";
import sweetAlertInstance from "../../helper/SweetAlert";
import { useDoctorApi } from "../Doctors/useDoctorApi";
import { useEmployeeApi } from "../Employees/useEmployeeApi";
import { Doctor } from "./AbsenceInterfaces";
import { Employee } from "./AbsenceInterfaces";

const AbsenceContainer: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<PersonOption | null>(null);
  const [loading,setLoading] = useState<boolean>(false)
  const [personType, setPersonType] = useState<"doctor" | "employee">("doctor");
  const [people, setPeople] = useState<Doctor[] | Employee[]>([]);
  const [selectedPersonAttendance, setSelectedPersonAttendance] = useState<AttendanceData[]>([]);

  const { getAllDoctors } = useDoctorApi();
  const { getAllEmployees } = useEmployeeApi();

  const {
    getAttendanceByPersonID,
    submitAbsence,
    updateAbsenceStatus,
    handleSwapDay
  } = useAbsenceApi();

  
  const handleClearSelection = () => {
    setSelectedPerson(null);
    setSelectedPersonAttendance([]);
    sessionStorage.removeItem("selectedPerson");
    sessionStorage.removeItem("selectedPersonType");
  };

  useEffect(() => {
    const fetchPeople = async () => {
      setPeople([]); // Reset the list of people
      try {
        setLoading(true)
        if (personType === "doctor") {
          const rawDoctors = await getAllDoctors();
          const transformedDoctors: Doctor[] = rawDoctors.map((doctor) => ({
            id: doctor.id,
            name: doctor.name,
            clinic: doctor.clinic,
            phoneNumber:doctor.phone_number,
            hire_date:doctor.hire_date,
            profile_photo:doctor.profile_photo,
            week_days: doctor.week_days.map((day) => ({
              id: day.id,
              day: day.day,
              date: day.date,
              attendance: day.attendance,
              switch_day: day.switch_day,
              created_at: day.created_at,
              switch_day_date: day.switch_day_date,
              switched_day_date: day.switched_day_date,
            })),
          }));
          setPeople(transformedDoctors);
        } else {
          const rawEmployees = await getAllEmployees();
          const transformedEmployees: Employee[] = rawEmployees.map((employee) => ({
            id: employee.id,
            name: employee.name,
            description: employee.description,
            worked_days: employee.worked_days,
            num_working_days: employee.weekdays.length,
            phoneNumber:employee.phone_number,
            hire_date:employee.hire_date,
            weekdays: employee.weekdays.map((day) => ({
              id: day.id,
              day: day.day,
              date: "",
              attendance: "",
              switch_day: day.switch_day,
              created_at: "",
              switch_day_date: "",
              switched_day_date: "",
            })),
          }));
          setPeople(transformedEmployees);
        }
      } catch (error) {
        console.error(`Error fetching ${personType}s:`, error);
      }finally{
        setLoading(false)
    }
    };

    fetchPeople();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personType]);


  useEffect(() => {
    const savedPersonType = sessionStorage.getItem("selectedPersonType");
    const savedPerson = sessionStorage.getItem("selectedPerson");

    if (savedPersonType) {
      setPersonType(savedPersonType as "doctor" | "employee");
    }

    if (savedPerson) {
      const parsedPerson = JSON.parse(savedPerson);
      setSelectedPerson(parsedPerson);
      fetchAttendance(parsedPerson.value, savedPersonType as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAttendance = async (id: number, type: string) => {
    const data = await getAttendanceByPersonID(id, type);
    console.log("attendance data: ",data)
    setSelectedPersonAttendance(data);
  };

  const handlePersonChange = async (selectedOption: PersonOption | null) => {
    setSelectedPerson(selectedOption);
    if (selectedOption) {
      await fetchAttendance(selectedOption.value, personType);
    }
  };

  const handlePersonTypeChange = (newPersonType: "doctor" | "employee") => {
    setPersonType(newPersonType);
    setSelectedPerson(null);
    setSelectedPersonAttendance([]);
    sessionStorage.removeItem("selectedPersonType");
    sessionStorage.removeItem("selectedPerson");
  };

  const handleMarkAsAbsent = async (date: Date, personInfo: PersonOption, selectedPersonAttendance: AttendanceData[]) => {
    try {
      const localDate = new Date(date);
      localDate.setHours(0, 0, 0, 0);
      const formattedInputDate = localDate.toLocaleDateString('en-CA');
      
      const existingAttendance = selectedPersonAttendance.find(attendance => {
        const attendanceDate = attendance.created_at.split(' ')[0];
        return attendanceDate === formattedInputDate;
      });

      const attendanceId = existingAttendance?.id;

      const response = await submitAbsence(date, personInfo, personType, attendanceId);
      
      if (response?.status === "success") {
        if (response?.message?.includes("attendance already taken")) {
          await sweetAlertInstance.fire({
            icon: "error",
            title: "غياب مسجل مسبقاً",
            text: `عذراً، هذا ${
              personType === "doctor" ? "الطبيب" : "الموظف"
            } مسجل غيابه مسبقاً في هذا اليوم.`,
          });
        } else {
          await sweetAlertInstance.fire({
            icon: "success",
            title: `تم تسجيل غياب ${personType === "doctor" ? "الطبيب" : "الموظف"}`,
            text: `تم تسجيل غياب بنجاح`,
          });
          await fetchAttendance(personInfo.value, personType);
        }
      } else {
        sweetAlertInstance.fire({
          icon: "error",
          title: "خطأ",
          text: "حدث خطأ أثناء تسجيل الغياب. يرجى المحاولة مرة أخرى.",
        });
      }
    } finally {
      console.log("done");
    }
};

const handleUpdateAbsence = async (date: Date, personInfo: PersonOption, selectedPersonAttendance: AttendanceData[]) => {
    try {
      const localDate = new Date(date);
      localDate.setHours(0, 0, 0, 0);
      const formattedInputDate = localDate.toLocaleDateString('en-CA');
      
      const existingAttendance = selectedPersonAttendance.find(attendance => {
        const attendanceDate = attendance.created_at.split(' ')[0];
        return attendanceDate === formattedInputDate;
      });

      const attendanceId = existingAttendance?.id;
      const response = await updateAbsenceStatus(date, personInfo, personType, attendanceId);
      
      if (response?.status === "success") {
        await sweetAlertInstance.fire({
          icon: "success",
          title: `تم تعديل حالة غياب ${
            personType === "doctor" ? "الطبيب" : "الموظف"
          }`,
          text: "تم تعديل حالة الغياب بنجاح",
        });
        await fetchAttendance(personInfo.value, personType);
      } else {
        sweetAlertInstance.fire({
          icon: "error",
          title: "خطأ",
          text: "حدث خطأ أثناء تعديل حالة الغياب. يرجى المحاولة مرة أخرى.",
        });
      }
    } finally {
      console.log("done");
    }
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
      // setIsSubmitting(true);
      const response = await handleSwapDay(data, selectedPerson, personType);
      
      if (response.status === "success") {
        await sweetAlertInstance.fire({
          icon: "success",
          title: "تم تبديل اليوم بنجاح",
          text: `تم تبديل يوم العمل بنجاح`,
        });
        await fetchAttendance(selectedPerson.value, personType);
      } else if(response.status === "error"){
        const errorMessage = response.data.response.data.error
        const switchedDate = response.data.response.data.existing_switch.switched_date

        console.log(errorMessage)
        if(errorMessage === "This day has already been submitted for switching"){
          await sweetAlertInstance.fire({
            icon: "error",
            title: "حدث خطأ اثناء تبديل اليوم",
            text: `لا يمكن تبديل يوم  "${switchedDate}"    لأنه مسجل مسبقاً`,

          })
        }
      }
      else {
        sweetAlertInstance.fire({
          icon: "error",
          title: "خطأ",
          text: "حدث خطأ أثناء محاولة تبديل اليوم. يرجى المحاولة مرة أخرى.",
        });
      }
    } finally {
      // setIsSubmitting(false);
      console.log("done");
    }
  };

  return (
    <AbsencePresentation
      handleMarkAsAbsent={handleMarkAsAbsent}
      getAttendanceByPersonID={getAttendanceByPersonID}
      selectedPersonAttendance={selectedPersonAttendance}
      updateAbsenceStatus={handleUpdateAbsence}
      selectedPerson={selectedPerson}
      personType={personType}
      onPersonChange={handlePersonChange}
      onPersonTypeChange={handlePersonTypeChange}
      handleSwapDaySubmit={handleSwapDaySubmit}
      people={people}
      onClearSelection = {handleClearSelection}
      loading={loading}
    />
  );
};

export default AbsenceContainer;