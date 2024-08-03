import React, { useState, useEffect } from "react";
import { ClinicsListPresentation } from "./ClinicsListPresentation";
import { Clinic } from "./ClinicsInterfaces";
import { Clinincs } from "./ClinicsConstant";
import { useNavigate } from "react-router-dom";
import { useDoctorApi } from "../Doctors/useDoctorApi";
import { Doctor } from "../Doctors/doctorInterfaces";

 const ClinicsListContainer: React.FC = () => {
  const navigate = useNavigate();
  const {getAllDoctors} = useDoctorApi();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    fetchDoctors();
    setClinics(Clinincs);  
  }, []);

  const fetchDoctors = async () => {
    try {
      const fetchedDoctors = await getAllDoctors();
      setDoctors(fetchedDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleClinicClick = (clinic: Clinic) => { // Change this line
    console.log(`تم النقر على العيادة:`, clinic); // Change this line
    navigate(`/SystemAdmin/ClinicDoctors`, { state: { clinic , doctors } });
  };

  return (
    <ClinicsListPresentation
      clinics={clinics}
      onClinicClick={handleClinicClick}
    />
  );
};

export default ClinicsListContainer;