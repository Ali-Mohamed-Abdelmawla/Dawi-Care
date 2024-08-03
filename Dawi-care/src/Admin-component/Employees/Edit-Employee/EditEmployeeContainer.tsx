// EditEmployeeContainer.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Employee, EmployeeFormData } from "../employeeInterfaces";
import { useEmployeeApi } from "../useEmployeeApi";
import EditEmployeeForm from "./EditEmployeeForm";
import Loader from "../../../helper/loading-component/loader";
import sweetAlertInstance from "../../../helper/SweetAlert";
import NotFound from "../../../helper/notFound-component/Not-Found";
import { workingDaysOptions } from "../EmployeeUtils";

const EditEmployeeContainer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateEmployee, EditAllWeekDays } = useEmployeeApi();
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const employeeData = location.state?.editData as Employee;
    if (employeeData) {
      const formattedEmployee: EmployeeFormData = {
        ...employeeData,
        working_days: employeeData.worked_days.split(",").map((day) => ({
          value: day.trim(),
          label:
            workingDaysOptions.find((option) => option.value === day.trim())
              ?.label || day.trim(),
        })),
      };
      setEmployee(formattedEmployee);
    } else {
      sweetAlertInstance.fire({
        icon: "error",
        title: "حدث خطأ ما",
        text: "لا يوجد بيانات للتعديل",
      });
      navigate("/SystemAdmin/Employees");
    }
  }, [location.state, navigate]);

  const handleSubmit = async (updatedEmployee: EmployeeFormData) => {
    setLoading(true);
    try {
      const formattedEmployee: Employee = {
        ...updatedEmployee,
        worked_days: updatedEmployee.working_days
          .map((day) => day.value)
          .join(","),
      };
      await updateEmployee(formattedEmployee);
      await EditAllWeekDays(
        formattedEmployee.id,
        formattedEmployee.worked_days
      );
      sweetAlertInstance.fire({
        icon: "success",
        title: "تم",
        text: "تم تحديث بيانات الموظف بنجاح",
      });
      navigate("/SystemAdmin/Employees");
    } catch (error) {
      console.error("Error updating employee:", error);
      sweetAlertInstance.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطا اثناء تحديث بيانات الموظف",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/SystemAdmin/Employees");
  };

  if (loading) {
    return <Loader />;
  }

  if (!employee) {
    return <NotFound />; // Or a loading state if preferred
  }

  return (
    <EditEmployeeForm
      employee={employee}
      onSubmit={handleSubmit}
      onBack={handleBack}
    />
  );
};

export default EditEmployeeContainer;
