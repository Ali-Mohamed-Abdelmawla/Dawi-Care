// AddEmployee.tsx

import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../helper/auth/axios";
import sweetAlertInstance from "../../../helper/SweetAlert";
import AddEmployeeForm from "./AddEmployeeForm";
import { EmployeeFormData } from "./AddEmployeeInterfaces";

const AddEmployee: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm<EmployeeFormData>();
  const navigate = useNavigate();

  const onSubmit = (data: EmployeeFormData) => {
    const accessToken = sessionStorage.getItem("accessToken");
    setLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("national_id", data.national_id.toString());
    formData.append("phone_number", data.phone_number.toString());
    formData.append("description", data.description.toString());
    // formData.append("overtime_salary", data.overtime_salary.toString());
    formData.append("fixed_salary", data.fixed_salary.toString());
    formData.append(
      "data",
      data.working_days.map((day) => day.value).join(",")
    );

    console.log(data);

    axiosInstance
      .post("/api/Add_Employee", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(formData);
        if (response.status === 200) {
          setLoading(false);
          sweetAlertInstance
            .fire({
              icon: "success",
              title: "تم إضافة الموظف بنجاح",
            })
            .then(() => {
              navigate("/SystemAdmin/Employees");
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

  return (
    <AddEmployeeForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      loading={loading}
    />
  );
};

export default AddEmployee;
