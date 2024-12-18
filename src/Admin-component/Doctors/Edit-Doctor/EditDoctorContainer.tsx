import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Doctor, DoctorFormData } from "../doctorInterfaces";
import { useDoctorApi } from "../useDoctorApi";
import EditDoctorForm from "./EditDoctorForm";
import sweetAlertInstance from "../../../helper/SweetAlert";
import NotFound from "../../../helper/notFound-component/Not-Found";
import { NewClinic } from "../../PayRolls/ClinicsInterfaces";
import dayjs from '../../../dateConfig';
import Loader from "../../../helper/loading-component/loader";

const EditDoctorContainer: React.FC = () => {
  const [clinics, setClinics] = useState<NewClinic[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { updateDoctor } = useDoctorApi();
  const [formLoading, setFormLoading] = useState(false);
  const [doctor, setDoctor] = useState<DoctorFormData>();

  useEffect(() => {
    const clinicData = location.state?.clinicList as NewClinic[];
    setClinics(clinicData);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (clinics.length !== 0) setUpPage();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinics]);

  const setUpPage = () => {
    const doctorData = location.state?.editData as Doctor;

    if (doctorData) {
      const formattedDoctor: DoctorFormData = {
        ...doctorData,
        clinic: doctorData.clinic?.id, // Convert to number for DoctorFormData
        clinic_id: doctorData.clinic?.id && {
          value: String(doctorData.clinic.id),
          label: String(doctorData.clinic.name),
        },
        working_days: doctorData.week_days
          .filter((day) => day.switch_day === null) // Filter out items with null switch_day
          .map((day) => ({
            value: day.day || day.switch_day,
            label: day.day || day.switch_day,
          })),
        working_hours: doctorData.week_days.reduce((acc, day) => {
          const [hours, minutes] = day.date.split(":").map(Number);
          if (day.day !== null) {
            acc[day.day] = { start: dayjs().hour(hours).minute(minutes) };
          } else {
            acc[day.switch_day as string] = {
              start: dayjs().hour(hours).minute(minutes),
            };
          }
          return acc;
        }, {} as Record<string, { start: dayjs.Dayjs }>),
      };

      setDoctor(formattedDoctor);
    } else {
      sweetAlertInstance.fire({
        icon: "error",
        title: "No doctor data provided",
      });
      navigate("/SystemAdmin/Doctors");
    }
  };

  const handleSubmit = async (updatedDoctor: DoctorFormData) => {
    setFormLoading(true);
    console.log("sending space: ", updatedDoctor);
    try {
      const formattedDoctor: DoctorFormData = {
        ...updatedDoctor,
        clinic: updatedDoctor.clinic_id && parseInt(updatedDoctor.clinic_id.value, 10), // Will be undefined if no clinic_id
      };

      console.log("before senmding doctor: ", formattedDoctor);
      console.log(formattedDoctor?.id);
      console.log(formattedDoctor.working_hours);

      const transformed = transformWorkingHoursToObjectArray(
        formattedDoctor.working_hours
      );

      console.log(transformed);
      const string = transformed.map((day) => day).join(",");
      console.log(string);
      await updateDoctor(formattedDoctor, string);

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
    return <Loader />;
  }

  if (!clinics) {
    return <NotFound />;
  }

  return (
    <EditDoctorForm
      clinics={clinics}
      doctor={doctor}
      onSubmit={handleSubmit}
      onBack={handleBack}
      profileImageUrl={`http://127.0.0.1:8000${doctor.profile_photo}`}
      unionRegistrationUrl={`http://127.0.0.1:8000${doctor.union_registration}`}
      formLoading={formLoading}
    />
  );
};

// getting the type from doctor form data
function transformWorkingHoursToObjectArray(
  workingHoursObj: Record<string, { start: dayjs.Dayjs | null }>
) {
  const result = [];

  for (const day in workingHoursObj) {
    const startTime = workingHoursObj[day].start;

    if (startTime) {
      // Convert Dayjs to a format that Date constructor can accept
      const dateString = startTime.format("YYYY-MM-DD HH:mm:ss");
      const date = new Date(dateString);

      // Extract only the time part (HH:mm:ss) from the Date object
      const timePart = date.toTimeString().split(" ")[0];
      console.log(timePart);

      // Push day and extracted time part into the result array
      result.push(day, timePart);
    }
  }

  console.log(result);
  return result;
}

export default EditDoctorContainer;
