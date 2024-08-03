import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Doctor, DoctorFormData } from "../doctorInterfaces";
import { useDoctorApi } from "../useDoctorApi";
import EditDoctorForm from "./EditDoctorForm";
import Loader from "../../../helper/loading-component/loader";
import sweetAlertInstance from "../../../helper/SweetAlert";
import { specialtyOptions, workingDaysOptions } from "../doctorUtils";
import NotFound from "../../../helper/notFound-component/Not-Found";
import dayjs from "dayjs";

const EditDoctorContainer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateDoctor, EditAllWeekDays } = useDoctorApi();
  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState<DoctorFormData | null>(null);

  useEffect(() => {
    const doctorData = location.state?.editData as Doctor;
    if (doctorData) {
      const formattedDoctor: DoctorFormData = {
        ...doctorData,
        specialty: {
          value: doctorData.specialty,
          label:
            specialtyOptions.find(
              (option) => option.value === doctorData.specialty
            )?.label || doctorData.specialty,
        },
        working_days: doctorData.week_days.map((day) => ({
          value: day.day,
          label:
            workingDaysOptions.find((option) => option.value === day.day)
              ?.label || day.day,
        })),
        working_hours: doctorData.week_days.reduce((acc, day) => {
          const [hours, minutes] = day.date.split(":").map(Number);
          acc[day.day] = { start: dayjs().hour(hours).minute(minutes) };
          return acc;
        }, {} as Record<string, { start: dayjs.Dayjs }>),
      };
      console.log(formattedDoctor);
      setDoctor(formattedDoctor);
    } else {
      sweetAlertInstance.fire({
        icon: "error",
        title: "No doctor data provided",
      });
      navigate("/SystemAdmin/Doctors");
    }
  }, [location.state, navigate]);

  const handleSubmit = async (updatedDoctor: DoctorFormData) => {
    setLoading(true);
    try {
      const formattedDoctor: Doctor = {
        ...updatedDoctor,
        specialty: updatedDoctor.specialty.value,
      };

      console.log(formattedDoctor);
      console.log(formattedDoctor.id);
      console.log(formattedDoctor.working_hours);

      const transformed = transformWorkingHoursToObjectArray(
        formattedDoctor.working_hours
      );
      console.log(transformed);

      await updateDoctor(formattedDoctor);
      await EditAllWeekDays(formattedDoctor.id, transformed);

      sweetAlertInstance.fire({
        icon: "success",
        title: "",
        text: "تم تعديل بيانات الطبيب بنجاح",
      });
      navigate("/SystemAdmin/Doctors");
    } catch (error) {
      console.error("Error updating doctor:", error);
      sweetAlertInstance.fire({
        icon: "error",
        title: "Failed to update doctor",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/SystemAdmin/Doctors");
  };

  if (loading) {
    return <Loader />;
  }

  if (!doctor) {
    return <NotFound />;
  }

  return (

        <div dir="rtl">
          <EditDoctorForm
            doctor={doctor}
            onSubmit={handleSubmit}
            onBack={handleBack}
            profileImageUrl={`https://crowd-funding.site${doctor.profile_photo}`}
            unionRegistrationUrl={`https://crowd-funding.site${doctor.union_registration}`}
          />
        </div>

  );
};

function transformWorkingHoursToObjectArray(workingHoursObj: object) {
  const result = [];

  for (const day in workingHoursObj) {
    // Parse the start time string to a Date object
    const startTime = new Date(workingHoursObj[day].start);

    // Extract only the time part (HH:mm:ss) from the Date object
    const timePart = startTime.toTimeString().split(" ")[0];
    console.log(timePart);

    // Push day and extracted time part into the result array
    result.push(day, timePart);
    // Directly push day and time as float into the result array
    // result.push(day, startTime); // This line changed to push elements individually
  }
  console.log(result);
  return result;
}

export default EditDoctorContainer;
