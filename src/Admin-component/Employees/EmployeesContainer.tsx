// EmployeesContainer.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeesTable from './EmployeesTable';
import Loader from '../../helper/loading-component/loader';
import { Employee } from './employeeInterfaces';
import { useEmployeeApi } from './useEmployeeApi';
import sweetAlertInstance from '../../helper/SweetAlert';
const EmployeesContainer: React.FC = () => {
  const [Employee, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { getAllEmployees, deleteEmployee } = useEmployeeApi();

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
      console.error('Error fetching Employee:', error);
      sweetAlertInstance.fire({
        icon: 'error',
        title: 'حدث خطأ اثناء جلب بيانات الموظف',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (employeeData: Employee) => {
    navigate('/SystemAdmin/Employees/EditEmployee', { state: { editData: employeeData } });
  };

  const handleDeleteClick = async (employeeId: number) => {
    try {
      const result = await sweetAlertInstance.fire({
        title: "هل انت متأكد؟",
        text: "سيتم حذف بيانات الموظف نهائيًا ولن تتمكن من استعادتها.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "نعم، احذف",
        cancelButtonText: "إلغاء",
      });
  
      if (!result.isConfirmed) {
        return; // Exit if the user cancels the action
      }
  
      await deleteEmployee(employeeId);
      setEmployees(Employee.filter((employee) => employee.id !== employeeId)); // Corrected `Employee` to `employees`
      sweetAlertInstance.fire({
        icon: "success",
        title: "تمت إزالة بيانات الموظف بنجاح.",
      });
    } catch (error) {
      console.error("Error deleting employee:", error);
      sweetAlertInstance.fire({
        icon: "error",
        title: "فشل في حذف بيانات الموظف.",
      });
    }
  };
  
  

  if (loading) {
    return <Loader />;
  }

  return (
    <EmployeesTable
    employees={Employee}
      handleEditClick={handleEditClick}
      handleDeleteClick={handleDeleteClick}
    />
  );
};

export default EmployeesContainer;