// ClinicsListContainer.tsx
import React, { useState, useEffect } from "react";
import { ClinicsListPresentation } from "./ClinicsListPresentation";
import { NewClinic } from "./ClinicsInterfaces";
import { Doctor } from "../Doctors/doctorInterfaces";
import { useNavigate } from "react-router-dom";
import { useDoctorApi } from "../Doctors/useDoctorApi";
import { useClinicApi } from "./useClinicsApi";
import sweetAlertInstance from "../../helper/SweetAlert";
import Loader from "../../helper/loading-component/loader";

const ClinicsListContainer: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { getAllDoctors } = useDoctorApi();
  const [clinics, setClinics] = useState<NewClinic[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { getClinicList, deleteClinic } = useClinicApi();

  useEffect(() => {
    fetchDoctors();
    fetchClinics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDoctors = async () => {
    try {
      const fetchedDoctors = await getAllDoctors();
      setDoctors(fetchedDoctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchClinics = async () => {
    try {
      setLoading(true);
      const fetchedClinics = await getClinicList();
      setClinics(fetchedClinics);
      setLoading(false);
    } catch {
      console.log("Error fetching clinics");
      sweetAlertInstance.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء جلب بيانات العيادات.",
      });
    }
  };

  const handleClinicClick = (clinic: NewClinic, currentSearchTerm: string) => {
    console.log(`تم النقر على العيادة:`, clinic);
    navigate(`/SystemAdmin/DoctorsPayroll/ClinicDoctors`, {
      state: {
        clinic,
        doctors,
        searchedTerm: currentSearchTerm,
      },
    });
  };

  const handleDeleteCLick = async (clinicId: number) => {
    try {
      console.log(`تم حذف العيادة:`, clinicId);
      await deleteClinic(clinicId);
      setClinics(clinics.filter((clinic) => clinic.id !== clinicId));
      sweetAlertInstance.fire({
        icon: "success",
        title: "تمت عمليه الحذف بنجاح",
        text: "تم حذف العيادة بنجاح",
      });
    } catch (error) {
      console.error("Error deleting clinic:", error);
      sweetAlertInstance.fire({
        icon: "error",
        title: "خطأ في عمليه الحذف",
        text: "حدث خطا اثناء حذف العيادة",
      });
    }
  };

  const handleEditClick = (clinic: NewClinic) => {
    console.log(`تم النقر على تعديل العيادة:`, clinic);
    navigate(`/SystemAdmin/DoctorsPayroll/EditClinic`, { state: { clinic } });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <ClinicsListPresentation
      clinics={clinics}
      doctors={doctors}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onClinicClick={handleClinicClick}
      onDeleteClinic={handleDeleteCLick}
      onEditClinic={handleEditClick}
    />
  );
};

export default ClinicsListContainer;
