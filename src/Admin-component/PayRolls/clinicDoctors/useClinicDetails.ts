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

  const { servicesDoneByClinic, editService, deleteService } = useClinicApi();
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

  const handleServiceEdit = useCallback(async (
    serviceId: number,
    clinicId: number,
    newService: { name: string; price: string }
  ) => {
    try {
      await editService(serviceId, clinicId, newService);
      
      // Update local state
      setClinic((prevClinic) => {
        if (!prevClinic) return null;
        const updatedClinic = {
          ...prevClinic,
          service: prevClinic.service?.map((service) =>
            service.id === serviceId
              ? { ...service, ...newService }
              : service
          ),
        };
        
        // Update navigation state
        navigate(location.pathname, {
          state: {
            ...location.state,
            clinic: updatedClinic,
          },
          replace: true
        });
        
        return updatedClinic;
      });
    } catch (error) {
      console.error("Failed to update service:", error);
      throw error;
    }
  }, [editService, navigate, location]);

  const handleServiceDelete = useCallback(async (serviceId: number) => {
    try {
      await deleteService(serviceId);
      
      // Update local state
      setClinic((prevClinic) => {
        if (!prevClinic) return null;
        const updatedClinic = {
          ...prevClinic,
          service: prevClinic.service?.filter(
            (service) => service.id !== serviceId
          ),
        };
        
        // Update navigation state
        navigate(location.pathname, {
          state: {
            ...location.state,
            clinic: updatedClinic,
          },
          replace: true
        });
        
        return updatedClinic;
      });
    } catch (error) {
      console.error("Failed to delete service:", error);
      throw error;
    }
  }, [deleteService, navigate, location]);

  return {
    clinic,
    doctors: filteredDoctors,
    doneServices,
    searchTerm,
    handleDoctorSelect,
    handleSearch,
    handleServiceEdit,
    handleServiceDelete,
  };
};
