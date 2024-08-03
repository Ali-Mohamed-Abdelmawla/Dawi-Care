// ClinicDetailsContainer.tsx
import { useState, useEffect } from "react";
import { ClinicDetailsPresentation } from "./ClinicDetailsPresentation";
import { DoctorRevenueEntry } from "./DoctorRevenueEntry";
import { Clinic, DoctorWage } from "../ClinicsInterfaces";
import { useLocation } from "react-router-dom";


const ClinicDetailsContainer = () => {
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [doctors, setDoctors] = useState<DoctorWage[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorWage | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const clinicValue = location?.state?.clinic?.value;
  const AllDoctors = location?.state?.doctors;

  useEffect(() => {
    setClinic({ value: clinicValue, label: "اسم العيادة" });
  }, [clinicValue]);

  useEffect(() => {
    setDoctors(filterDoctorsAccordingTospeciality());
  }, [clinic]);

  const filterDoctorsAccordingTospeciality = () => {
    return AllDoctors.filter(
      (doctor: DoctorWage) => doctor.specialty === clinic?.value
    );
  };

  const handleDoctorSelect = (doctor: DoctorWage) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  const handleSaveRevenueData = (
    doctorId: number,
    totalRevenue: number,
    doctorShare: number,
    centerShare: number
  ) => {
    console.log(`حفظ بيانات الإيرادات للطبيب ${doctorId}:`, {
      totalRevenue,
      doctorShare,
      centerShare,
    });
    setDoctors(
      doctors.map((doctor) =>
        doctor.id === doctorId
          ? { ...doctor, totalRevenue, doctorShare, centerShare }
          : doctor
      )
    );
    handleCloseModal();
  };

  if (!clinic) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <>
      <ClinicDetailsPresentation
        clinic={clinic}
        doctors={doctors}
        onDoctorSelect={handleDoctorSelect}
      />
      {selectedDoctor && (
        <DoctorRevenueEntry
          doctor={selectedDoctor}
          onSave={handleSaveRevenueData}
          open={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ClinicDetailsContainer;
