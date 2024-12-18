import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Employee } from '../../../Employees/employeeInterfaces';
import { useClinicApi } from '../../useClinicsApi';
import { EmployeeDeductionPagePresentation } from './EmployeeDeductionPagePresentation';
import Loader from '../../../../helper/loading-component/loader';
import sweetAlertInstance from '../../../../helper/SweetAlert';
import dayjs from '../../../../dateConfig';

import { Typography } from '@mui/material';

const EmployeeDeductionPageContainer: React.FC = () => {
  const location = useLocation();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCustomDeduction, setIsCustomDeduction] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { addEmployeeDeduction } = useClinicApi();

  useEffect(() => {
    const employeeData = location.state?.employee as Employee;
    if (employeeData) {
      setEmployee(employeeData);
    }
    setLoading(false);
  }, [location.state]);

  const handleSubmit = async (data: { deduction: number; customDeduction: number; description: string }) => {
    setIsSubmitting(true);
    try {
      const formattedDate = selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : null; // Format as Cairo-local date
      const result = await addEmployeeDeduction(
        employee!.id,
        data.deduction,
        data.customDeduction,
        data.description,
        isPaid,
        formattedDate,
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
        title: 'حدث خطأ اثناء إضافة الخصم',
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
      isPaid={isPaid}
      setIsPaid={setIsPaid}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};

export default EmployeeDeductionPageContainer;
