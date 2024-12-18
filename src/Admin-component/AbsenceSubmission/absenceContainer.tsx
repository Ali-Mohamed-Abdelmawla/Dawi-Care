import React, { useState, useEffect } from "react";
import AbsencePresentation from "./absencePresentation";
import { AttendanceData, PersonOption, SwapDayFormData } from "./AbsenceInterfaces";
import { useAbsenceApi } from "./useAbsenceApi";
import sweetAlertInstance from "../../helper/SweetAlert";

const AbsenceContainer: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<PersonOption | null>(null);
  const [personType, setPersonType] = useState<"doctor" | "employee">("doctor");
  const [selectedPersonAttendance, setSelectedPersonAttendance] = useState<AttendanceData[]>([]);

  const {
    getAttendanceByPersonID,
    submitAbsence,
    updateAbsenceStatus,
    handleSwapDay
  } = useAbsenceApi();

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

  const handleMarkAsAbsent = async (date: Date, personInfo: PersonOption) => {
    try {
      // setIsSubmitting(true);
      const response = await submitAbsence(date, personInfo, personType);
      
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
      // setIsSubmitting(false);
      console.log("done");
    }
  };

  const handleUpdateAbsence = async (date: Date, personInfo: PersonOption) => {
    try {
      // setIsSubmitting(true);
      const response = await updateAbsenceStatus(date, personInfo, personType);
      
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
      // setIsSubmitting(false);
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
      } else {
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
    />
  );
};

export default AbsenceContainer;