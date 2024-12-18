import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useClinicApi } from "../useClinicsApi";
import { NewClinic, DoctorWage, DoneService } from "../ClinicsInterfaces";

export const useClinicDetails = () => {
  const [clinic, setClinic] = useState<NewClinic | null>(null);
  const [doctors, setDoctors] = useState<DoctorWage[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorWage[]>([]);
  const [doneServices, setDoneServices] = useState<DoneService[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { servicesDoneByClinic } = useClinicApi();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract clinic data from navigation state
  const clinicData = location.state?.clinic;
  const allDoctors = useMemo(() => {
    return location.state?.doctors || [];
  }, [location.state?.doctors]);

  // Fetch and filter doctors
  const filterDoctorsForClinic = useCallback(
    (clinic: NewClinic) => {
      return allDoctors.filter(
        (doctor: DoctorWage) => doctor.clinic?.id === clinic.id
      );
    },
    [allDoctors]
  ); // Now depends on memoized allDoctors

  // Search and filter doctors
  const filterDoctors = useCallback(
    (term: string, doctorsToFilter: DoctorWage[]) => {
      return doctorsToFilter.filter((doctor) =>
        doctor.name.toLowerCase().includes(term.toLowerCase())
      );
    },
    []
  );

  // Fetch done services
  const fetchDoneServices = useCallback(
    async (clinicId: number) => {
      try {
        const services = await servicesDoneByClinic(clinicId);
        setDoneServices(services);
      } catch (error) {
        console.error("Error fetching done services:", error);
      }
    },
    [servicesDoneByClinic]
  );

  // Initialize clinic and doctors
  useEffect(() => {
    if (clinicData) {
      setClinic(clinicData);
      const filteredClinicDoctors = filterDoctorsForClinic(clinicData);
      setDoctors(filteredClinicDoctors);
      setFilteredDoctors(filteredClinicDoctors);

      // Fetch done services
      fetchDoneServices(clinicData.id);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinicData]);

  // Handle doctor selection
  const handleDoctorSelect = useCallback(
    (doctor: DoctorWage) => {
      navigate(
        `/SystemAdmin/DoctorsPayroll/ClinicDoctors/DoctorSalaryCalculator`,
        {
          state: {
            doctor: doctor,
            services: clinic?.service,
            weekDays: doctor?.week_days,
          },
        }
      );
    },
    [navigate, clinic]
  );

  // Search handler
  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      const filtered = filterDoctors(term, doctors);
      setFilteredDoctors(filtered);
    },
    [doctors, filterDoctors]
  );

  return {
    clinic,
    doctors: filteredDoctors,
    doneServices,
    searchTerm,
    handleDoctorSelect,
    handleSearch,
  };
};