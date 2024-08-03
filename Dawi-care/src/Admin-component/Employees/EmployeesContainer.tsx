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
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const fetchedDoctors = await getAllEmployees();
      setEmployees(fetchedDoctors);
    } catch (error) {
      console.error('Error fetching Employee:', error);
      sweetAlertInstance.fire({
        icon: 'error',
        title: 'Failed to fetch Employee',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (employeeData: Employee) => {
    navigate('/SystemAdmin/EditEmployee', { state: { editData: employeeData } });
  };

  const handleDeleteClick = async (doctorId: number) => {
    try {
      await deleteEmployee(doctorId);
      setEmployees(Employee.filter(Employee => Employee.id !== doctorId));
      sweetAlertInstance.fire({
        icon: 'success',
        title: 'Employee data removed successfully.',
      });
    } catch (error) {
      console.error('Error deleting Employee:', error);
      sweetAlertInstance.fire({
        icon: 'error',
        title: 'Failed to delete Employee',
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