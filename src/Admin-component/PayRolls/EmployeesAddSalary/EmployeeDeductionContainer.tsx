import { useEffect, useState } from "react";
import { useEmployeeApi } from "../../Employees/useEmployeeApi";
import sweetAlertInstance from "../../../helper/SweetAlert";
import { Employee } from "../../Employees/employeeInterfaces";
import Loader from "../../../helper/loading-component/loader";
import { useNavigate } from "react-router-dom";
import { EmployeeDeductionPresentation } from "./EmployeeDeductionPresentation";
import { Typography } from "@mui/material";

const EmployeeDeduction: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { getAllEmployees } = useEmployeeApi();

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const fetchedEmployees = await getAllEmployees();
      setEmployees(fetchedEmployees);
    } catch (error) {
      console.error("Error fetching Employee:", error);
      sweetAlertInstance.fire({
        icon: "error",
        title: "حدث خطأ اثناء جلب بيانات الموظفين",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeClick = (employee: Employee) => {
    navigate(`/SystemAdmin/EmployeesDeduction/EmployeeSalaryCalculator`, { state: { employee } });
  };

  if (loading) {
    return <Loader />;
  }

  if (employees.length === 0) {
    return (
      <Typography variant="h5" align="center">
        لا يوجد موظفون في النظام حاليا
      </Typography>
    );
  }

  return (
    <EmployeeDeductionPresentation
      employees={employees}
      onEmployeeClick={handleEmployeeClick}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
  );
};

export default EmployeeDeduction;
