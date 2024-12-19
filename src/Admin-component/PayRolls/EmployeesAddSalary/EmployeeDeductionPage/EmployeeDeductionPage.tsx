import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Employee } from '../../../Employees/employeeInterfaces';
import { useClinicApi } from '../../useClinicsApi';
import { EmployeeDeductionPagePresentation } from './EmployeeDeductionPagePresentation';
import Loader from '../../../../helper/loading-component/loader';
import sweetAlertInstance from '../../../../helper/SweetAlert';
import dayjs from '../../../../dateConfig';
import { DeductionFormData } from './EmployeeDeductionPagePresentation';
import { Typography } from '@mui/material';

const EmployeeDeductionPageContainer: React.FC = () => {
  const location = useLocation();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCustomDeduction, setIsCustomDeduction] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { addEmployeeDeduction } = useClinicApi();

  useEffect(() => {
    const employeeData = location.state?.employee as Employee;
    if (employeeData) {
      setEmployee(employeeData);
    }
    setLoading(false);
  }, [location.state]);

  const handleSubmitData = async (formData: DeductionFormData) => {
    setIsSubmitting(true);
  
    // Filter the form data based on `isCustomDeduction`
    const dataToSubmit = isCustomDeduction
      ? { customDeduction: formData.customDeduction, description: formData.description }
      : { deduction: formData.deduction };
  
    try {
      const formattedDate = selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : null;
  
      const result = await addEmployeeDeduction(
        employee!.id,
        dataToSubmit.deduction || 0, // Normal deduction or 0 if not used
        dataToSubmit.customDeduction || 0, // Custom deduction or 0 if not used
        dataToSubmit.description || '', // Description
        formattedDate
      );
  
      if (result.status === 'success') {
        sweetAlertInstance.fire({
          icon: 'success',
          title: 'تم إضافة الخصم بنجاح',
        });
      } else {
        throw new Error('Failed to add deduction');
      }
    } catch (error) {
      console.error('Error adding deduction:', error);
      sweetAlertInstance.fire({
        icon: 'error',
        title: 'حدث خطأ أثناء إضافة الخصم',
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
    />
  );
};

export default EmployeeDeductionPageContainer;
