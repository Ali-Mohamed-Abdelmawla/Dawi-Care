// AddUser.tsx

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../helper/auth/axios";
import sweetAlertInstance from "../../../helper/SweetAlert";
import AddUserForm from "./AddUserForm";
import { UserFormData } from "./AddUserInterfaces";

const AddUser: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { control, getValues, handleSubmit } = useForm<UserFormData>({
    mode: "onChange",
  });
  const navigate = useNavigate();

  const onSubmit = (data: UserFormData) => {
    const accessToken = sessionStorage.getItem("accessToken");
    setLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email.toString());
    formData.append("password", data.password.toString());

    console.log(data);

    axiosInstance
      .post("/api/Add_User", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
        params: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          sweetAlertInstance
            .fire({
              icon: "success",
              title: "تم إضافة المستخدم بنجاح",
            })
            .then(() => {
              navigate("/SystemAdmin/Users");
            });
        }
      })
      .catch((error) => {
        setLoading(false);

        console.log(error);
        console.log(error.response.data.message);
        const errorMessage = error.response.data.message;
        if (errorMessage.includes("The email has already been taken")) {
          sweetAlertInstance
            .fire({
              icon: "error",
              title: "خطأ",
              text: "البريد الالكتروني مسجل من قبل",
            })
            .then(() => {
              return;
            });
        } else {
          sweetAlertInstance.fire({
            icon: "error",
            title: "خطأ",
            text: "يرجى المحاولة مرة أخرى",
          });
        }
      });
  };

  return (
    <AddUserForm
      control={control}
      getValues={getValues}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      loading={loading}
    />
  );
};

export default AddUser;
