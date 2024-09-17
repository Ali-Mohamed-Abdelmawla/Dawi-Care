import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Doctor, DoctorFormData } from "../doctorInterfaces";
import { useDoctorApi } from "../useDoctorApi";
import EditDoctorForm from "./EditDoctorForm";
import sweetAlertInstance from "../../../helper/SweetAlert";
import { specialtyOptions, workingDaysOptions } from "../doctorUtils";
import NotFound from "../../../helper/notFound-component/Not-Found";
import dayjs from "dayjs";
import { Dayjs } from 'dayjs';

const EditDoctorContainer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateDoctor } = useDoctorApi();
  const [formLoading, setFormLoading] = useState(false);
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
          if (day.day !== null) {
            acc[day.day] = { start: dayjs().hour(hours).minute(minutes) };
          }
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
    setFormLoading(true);
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
      const string = transformed.map((day) => day).join(",");
      console.log(string);
      await updateDoctor(formattedDoctor, string);
      // await EditAllWeekDays(formattedDoctor.id, transformed, "doctor");

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
      setFormLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/SystemAdmin/Doctors");
  };

  if (!doctor) {
    return <NotFound />;
  }

  return (

        <div dir="rtl">
          <EditDoctorForm
            doctor={doctor}
            onSubmit={handleSubmit}
            onBack={handleBack}
            profileImageUrl={`http://127.0.0.1:8000${doctor.profile_photo}`}
            unionRegistrationUrl={`http://127.0.0.1:8000${doctor.union_registration}`}
            formLoading={formLoading}
          />
        </div>

  );
};

// getting the type from doctor form data
function transformWorkingHoursToObjectArray(workingHoursObj: Record<string, { start: Dayjs | null }>) {
  const result = [];

  for (const day in workingHoursObj) {
    const startTime = workingHoursObj[day].start;
    
    if (startTime) {
      // Convert Dayjs to a format that Date constructor can accept
      const dateString = startTime.format('YYYY-MM-DD HH:mm:ss');
      const date = new Date(dateString);
      
      // Extract only the time part (HH:mm:ss) from the Date object
      const timePart = date.toTimeString().split(' ')[0];
      console.log(timePart);

      // Push day and extracted time part into the result array
      result.push(day, timePart);
    }
  }
  
  console.log(result);
  return result;
}

export default EditDoctorContainer;
