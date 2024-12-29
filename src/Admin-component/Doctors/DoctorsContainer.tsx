// DoctorsContainer.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorsTable from './DoctorsTable';
import Loader from '../../helper/loading-component/loader';
import { Doctor } from './doctorInterfaces';
import { useDoctorApi } from './useDoctorApi';
import { useClinicApi } from '../PayRolls/useClinicsApi';
import { NewClinic } from '../PayRolls/ClinicsInterfaces';
import sweetAlertInstance from '../../helper/SweetAlert';
const DoctorsContainer: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<NewClinic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { getAllDoctors, deleteDoctor } = useDoctorApi();
  const { getClinicList } = useClinicApi();


  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const [fetchedDoctors, fetchedClinics] = await Promise.all([
        getAllDoctors(),
        getClinicList()
      ]);
      setClinics(fetchedClinics);
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
    navigate('/SystemAdmin/Doctors/EditDoctor', { state: { editData: doctorData, clinicList: clinics } });
  };

  const handleDeleteClick = async (doctorId: number) => {
    try {
      const result = await sweetAlertInstance.fire({
        title: "هل انت متأكد؟",
        text: "سيتم حذف بيانات الطبيب ولن تتمكن من استرجاعها.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "نعم، احذف",
        cancelButtonText: "إلغاء",
      });
  
      if (!result.isConfirmed) {
        return; // Exit if the user cancels the action
      }
  
      await deleteDoctor(doctorId);
      setDoctors(doctors.filter((doctor) => doctor.id !== doctorId));
      sweetAlertInstance.fire({
        icon: "success",
        title: "تمت إزالة بيانات الطبيب بنجاح.",
      });
    } catch (error) {
      console.error("Error deleting doctor:", error);
      sweetAlertInstance.fire({
        icon: "error",
        title: "فشلت إزالة بيانات الطبيب.",
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