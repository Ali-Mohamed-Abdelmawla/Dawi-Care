// DoctorsContainer.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorsTable from './DoctorsTable';
import Loader from '../../helper/loading-component/loader';
import { Doctor } from './doctorInterfaces';
import { useDoctorApi } from './useDoctorApi';
import sweetAlertInstance from '../../helper/SweetAlert';
const DoctorsContainer: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { getAllDoctors, deleteDoctor } = useDoctorApi();

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const fetchedDoctors = await getAllDoctors();
      setDoctors(fetchedDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      sweetAlertInstance.fire({
        icon: 'error',
        title: 'Failed to fetch doctors',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (doctorData: Doctor) => {
    navigate('/SystemAdmin/Doctors/EditDoctor', { state: { editData: doctorData } });
  };

  const handleDeleteClick = async (doctorId: number) => {
    try {
      await deleteDoctor(doctorId);
      setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
      sweetAlertInstance.fire({
        icon: 'success',
        title: 'تمت ازاله بيانات الطبيب بنجاح.',
      });
    } catch (error) {
      console.error('Error deleting doctor:', error);
      sweetAlertInstance.fire({
        icon: 'error',
        title: 'فشلت ازاله بيانات الطبيب',
      });
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <DoctorsTable
      doctors={doctors}
      handleEditClick={handleEditClick}
      handleDeleteClick={handleDeleteClick}
    />
  );
};

export default DoctorsContainer;