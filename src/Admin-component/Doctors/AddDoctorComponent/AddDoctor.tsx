// AddDoctor.tsx

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../helper/auth/axios";
import sweetAlertInstance from "../../../helper/SweetAlert";
import AddDoctorForm from "./AddDoctorForm";
import { DoctorFormData } from "./types";
import { Dayjs } from "dayjs";

const AddDoctor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm<DoctorFormData>();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const onSubmit = (data: DoctorFormData) => {
    const accessToken = sessionStorage.getItem("accessToken");
    setLoading(true);

    console.log(data);
    const transformed = transformWorkingHoursToObjectArray(data.working_hours);
    console.log(transformed);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("national_id", data.national_id.toString());
    formData.append("phone_number", data.phone_number.toString());
    // formData.append(
    //   "worked_days",
    //   data.working_days.map((day) => day.value)
    // );
    formData.append("specialty", data.specialty.value);
    formData.append("fixed_salary", data.fixed_salary.toString());
    formData.append("scientific_degree", data.scientific_degree);
    // formData.append("num_working_days", data.working_days.length.toString());

    if (data.profile_photo) {
      formData.append("profile_photo", data.profile_photo);
    }
    if (data.union_registration) {
      formData.append("union_registration", data.union_registration);
    }

    formData.append("data", transformed.toString());

    axiosInstance
      .post("/api/Add_Doctor", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          sweetAlertInstance
            .fire({
              icon: "success",
              title: "تم إضافة الطبيب بنجاح",
            })
            .then(() => {
              navigate("/SystemAdmin/Doctors");
            });
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        sweetAlertInstance.fire({
          icon: "error",
          title: "حدث خطأ ما",
        });
      });
  };

  const handleProfileImageChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImageUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <AddDoctorForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      loading={loading}
      profileImageUrl={profileImageUrl}
      handleOpenModal={handleOpenModal}
      handleCloseModal={handleCloseModal}
      openModal={openModal}
      handleProfileImageChange={handleProfileImageChange}
    />
  );
};

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

export default AddDoctor;