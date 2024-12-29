import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Doctor, DoctorFormData } from "../doctorInterfaces";
import { useDoctorApi } from "../useDoctorApi";
import EditDoctorForm from "./EditDoctorForm";
import sweetAlertInstance from "../../../helper/SweetAlert";
import NotFound from "../../../helper/notFound-component/Not-Found";
import { NewClinic } from "../../PayRolls/ClinicsInterfaces";
import dayjs from "../../../dateConfig";
import Loader from "../../../helper/loading-component/loader";
import { DayOption } from "../doctorInterfaces";
import { deploy_url } from "../../../helper/DeployUrl";

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
        clinic: doctorData.clinic?.id,
        clinic_id: doctorData.clinic?.id && {
          value: String(doctorData.clinic.id),
          label: String(doctorData.clinic.name),
        },
        working_days: doctorData.week_days
          .filter((day) => day.switch_day === null)
          .map((day) => ({
            value: day.day || day.switch_day || "nothing" ,
            label: day.day || day.switch_day || "nothing",
            isFixed: true,
            id: day.id || 0,
          })),
        working_hours: doctorData.week_days.reduce((acc, day) => {
          if (!day.date) return acc;

          const [hours, minutes] = day.date.split(":").map(Number);
          const dayKey = day.day || day.switch_day;

          if (dayKey) {
            acc[dayKey] = {
              start: dayjs().hour(hours).minute(minutes),
              id: day.id,
            };
          }
          return acc;
        }, {} as Record<string, { start: dayjs.Dayjs; id?: number }>),
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
    console.log(updatedDoctor);
    try {
      const formData = new FormData();

      // Basic fields
      formData.append("name", updatedDoctor.name);
      formData.append("national_id", updatedDoctor.national_id);
      formData.append("phone_number", updatedDoctor.phone_number);
      formData.append("scientific_degree", updatedDoctor.scientific_degree);
      formData.append("fixed_salary", String(updatedDoctor.fixed_salary));
      formData.append("clinic", String(updatedDoctor.clinic));
      formData.append("doctor_share", String(updatedDoctor.doctor_share));

      // Files
      if (updatedDoctor.profile_photo) {
        formData.append("profile_photo", updatedDoctor.profile_photo);
      }
      if (updatedDoctor.union_registration) {
        formData.append("union_registration", updatedDoctor.union_registration);
      }

      // Transform working days and hours
      const transformedData = transformWorkingHoursToArray(
        updatedDoctor.working_hours,
        updatedDoctor.working_days
      );

      formData.append("data", transformedData.join(","));
      console.log(transformedData.join(","));

      await updateDoctor(updatedDoctor, transformedData.join(","));

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
      profileImageUrl={`${deploy_url}${doctor.profile_photo}`}
      unionRegistrationUrl={`${deploy_url}${doctor.union_registration}`}
      formLoading={formLoading}
    />
  );
};

// getting the type from doctor form data
function transformWorkingHoursToArray(
  workingHours: Record<string, { start: dayjs.Dayjs | null }>,
  workingDays: DayOption[]
): string[] {
  const result: string[] = [];

  workingDays.forEach((day) => {
    const time = workingHours[day.value]?.start;
    if (time) {
      if (day.id) {
        // Existing day - include ID
        result.push(String(day.id), day.value, time.format("HH:mm:ss"));
      } else {
        // New day - just day and time
        result.push(day.value, time.format("HH:mm:ss"));
      }
    }
  });

  return result;
}

export default EditDoctorContainer;
