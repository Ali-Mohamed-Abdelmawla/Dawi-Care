import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Employee } from "../../../Employees/employeeInterfaces";
import { useClinicApi } from "../../useClinicsApi";
import { EmployeeDeductionPagePresentation } from "./EmployeeDeductionPagePresentation";
import Loader from "../../../../helper/loading-component/loader";
import sweetAlertInstance from "../../../../helper/SweetAlert";
import dayjs from "../../../../dateConfig";
import { DeductionFormData } from "./EmployeeDeductionPagePresentation";
import { Typography } from "@mui/material";
import useStatisticsApi from "../../../MainPage/useStatisticsApi";
import { SalaryData } from "../../../MainPage/Statistics-Interfaces";

const EmployeeDeductionPageContainer: React.FC = () => {
  const location = useLocation();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [employeeSalaryData, setEmployeeSalaryData] = useState<SalaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCustomDeduction, setIsCustomDeduction] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { addEmployeeDeduction } = useClinicApi();
  const { fetchSalaryData } = useStatisticsApi();

  useEffect(() => {
    const employeeData = location.state?.employee as Employee;

    if (employeeData) {
      setEmployee(employeeData);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  useEffect(() => {
    getEmployeeSalaryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee]);

  const getEmployeeSalaryData = async () => {
    if (!employee) {
      return;
    }
    const salaryData = await fetchSalaryData(employee.id, "employee");
    const mostRecentData = getMostRecentSalaryData(salaryData);
  
    console.log(mostRecentData); // Logs the most recent salary data for the current month
    setEmployeeSalaryData(mostRecentData);
  };

  const getMostRecentSalaryData = (salaryData: SalaryData[]) => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // Months are 0-indexed
    const currentYear = now.getFullYear();
  
    const filteredData = salaryData
      .filter(
        (entry) => entry.month === currentMonth && entry.year === currentYear
      )
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
    return filteredData.length > 0 ? filteredData[0] : null;
  };
  
  const handleSubmitData = async (formData: DeductionFormData) => {
    setIsSubmitting(true);
  
    const dataToSubmit = isCustomDeduction
      ? {
          customDeduction: formData.customDeduction,
          description: formData.description,
        }
      : { deduction: formData.deduction };
  
    try {
      const formattedDate = selectedDate
        ? dayjs(selectedDate).format("YYYY-MM-DD")
        : null;
  
      const result = await addEmployeeDeduction(
        employee!.id,
        dataToSubmit.deduction || 0, // Normal deduction or 0 if not used
        dataToSubmit.customDeduction || 0, // Custom deduction or 0 if not used
        dataToSubmit.description || "", // Description
        formattedDate
      );
  
      console.log(result.data.salary.total_salary);
      console.log(result.data.salary.custom_deduction);
  
      if (result.status === "success") {
        let alertText = "تم إضافة الخصم بنجاح";
  
        if (!isCustomDeduction) {
          alertText = `تم تسجيل دفع راتب بقيمة <b>${result.data.salary.total_salary} EGP</b><br> 
          تم خصم مبلغ قدره <b>${result.data.salary.custom_deduction} EGP</b> خصومات مخصصة<br> 
          تم خصم <b>${dataToSubmit.deduction} EGP</b> عن كل يوم غياب للموظف.`;        }
  
        sweetAlertInstance.fire({
          icon: "success",
          title: "تم إضافة الخصم بنجاح",
          html: alertText, 
        });
      } else {
        throw new Error("Failed to add deduction");
      }
    } catch (error) {
      console.error("Error adding deduction:", error);
      sweetAlertInstance.fire({
        icon: "error",
        title: "حدث خطأ أثناء إضافة الخصم",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  if (loading) {
    return <Loader />;
  }

  if (!employee) {
    return (
      <Typography variant="h5" align="center">
        لا يوجد موظف بهذا الرقم
      </Typography>
    );
  }

  return (
    <EmployeeDeductionPagePresentation
      employee={employee}
      isCustomDeduction={isCustomDeduction}
      setIsCustomDeduction={setIsCustomDeduction}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      onSubmit={handleSubmitData}
      isSubmitting={isSubmitting}
      employeeSalaryData={employeeSalaryData}
    />
  );
};

export default EmployeeDeductionPageContainer;
