// ClinicsListContainer.tsx
import React, { useState, useEffect } from "react";
import { ClinicsListPresentation } from "./ClinicsListPresentation";
import { Clinic } from "./ClinicsInterfaces";
import { Doctor } from "../Doctors/doctorInterfaces";
import { Clinincs } from "./ClinicsConstant";
import { useNavigate } from "react-router-dom";
import { useDoctorApi } from "../Doctors/useDoctorApi";

const ClinicsListContainer: React.FC = () => {
  const navigate = useNavigate();
  const { getAllDoctors } = useDoctorApi();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDoctors();
    setClinics(Clinincs);  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDoctors = async () => {
    try {
      const fetchedDoctors = await getAllDoctors();
      setDoctors(fetchedDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleClinicClick = (clinic: Clinic, currentSearchTerm: string) => {
    console.log(`تم النقر على العيادة:`, clinic);
    navigate(`/SystemAdmin/Clinics/ClinicDoctors`, {
      state: { 
        clinic, 
        doctors,
        searchedTerm: currentSearchTerm 
      } 
    });
  };

  return (
    <ClinicsListPresentation
      clinics={clinics}
      doctors={doctors}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onClinicClick={handleClinicClick}
    />
  );
};

export default ClinicsListContainer;