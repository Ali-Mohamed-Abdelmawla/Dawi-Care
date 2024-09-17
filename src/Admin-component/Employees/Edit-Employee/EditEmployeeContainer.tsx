// EditEmployeeContainer.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Employee, EmployeeFormData } from "../employeeInterfaces";
import { useEmployeeApi } from "../useEmployeeApi";
import EditEmployeeForm from "./EditEmployeeForm";
import sweetAlertInstance from "../../../helper/SweetAlert";
import NotFound from "../../../helper/notFound-component/Not-Found";
import { workingDaysOptions } from "../EmployeeUtils";

const EditEmployeeContainer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateEmployee } = useEmployeeApi();
  const [formLoading, setFormLoading] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const employeeData = location.state?.editData as Employee;
    if (employeeData) {
      const formattedEmployee: EmployeeFormData = {
        ...employeeData,
        working_days: employeeData.weekdays?.map((weekDay) => ({
          value: weekDay.day,
          label:
            workingDaysOptions.find((option) => option.value === weekDay.day)
              ?.label || weekDay.day,
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
    setFormLoading(true);
    try {
      const formattedEmployee: Employee = {
        ...updatedEmployee,
        worked_days: updatedEmployee.working_days
          .map((day) => day.value)
          .join(","),
      };
      await updateEmployee(formattedEmployee, formattedEmployee.worked_days);
      // await EditAllWeekDays(
      //   formattedEmployee.id,
      //   formattedEmployee.worked_days
      // );
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
      setFormLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/SystemAdmin/Employees");
  };

  if (!employee) {
    return <NotFound />; // Or a loading state if preferred
  }

  return (
    <EditEmployeeForm
      employee={employee}
      onSubmit={handleSubmit}
      onBack={handleBack}
      formLoading={formLoading}
    />
  );
};

export default EditEmployeeContainer;
