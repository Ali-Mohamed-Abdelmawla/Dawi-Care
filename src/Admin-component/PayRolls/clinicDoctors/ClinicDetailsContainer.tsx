import React, { useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import ClinicHeroSection from "./ClinicHeroSection";
import DoctorsSection from "./DoctorsSection";
import DoneServicesSection from "./DoneServicesSection";
import { NewClinic, DoctorWage, DoneService } from "../ClinicsInterfaces";
import { Service } from "../ClinicsInterfaces";
import ServiceTable from "./TableForDoneServices";

interface ClinicDetailsContainerProps {
  clinic: NewClinic;
  doctors: DoctorWage[];
  doneServices: DoneService[];
  searchTerm: string;
  onDoctorSelect: (doctor: DoctorWage) => void;
  onSearchChange: (term: string) => void;
}

const ClinicDetailsContainer: React.FC<ClinicDetailsContainerProps> = ({
  clinic,
  doctors,
  doneServices,
  searchTerm,
  onDoctorSelect,
  onSearchChange,
}) => {
  const [activeSection, setActiveSection] = useState<
    "doctors" | "services" | "servicesBasedDates"
  >("doctors");

  return (
    <Box>
      <ClinicHeroSection clinic={clinic} />

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ my: 3 }}>
        <Button
          variant={activeSection === "doctors" ? "contained" : "outlined"}
          onClick={() => setActiveSection("doctors")}
        >
          الأطباء
        </Button>
        <Button
          variant={activeSection === "services" ? "contained" : "outlined"}
          onClick={() => setActiveSection("services")}
        >
          إحصائيات العيادة
        </Button>
        <Button
          variant={
            activeSection === "servicesBasedDates" ? "contained" : "outlined"
          }
          onClick={() => setActiveSection("servicesBasedDates")}
        >
          سجل نشاط العيادة
        </Button>
      </Stack>

      {activeSection === "doctors" && (
        <DoctorsSection
          doctors={doctors}
          searchTerm={searchTerm}
          onDoctorSelect={onDoctorSelect}
          onSearchChange={onSearchChange}
        />
      )}
      {activeSection === "services" && (
        <DoneServicesSection
          doneServices={doneServices}
          services={clinic.service as Service[]}
          doctors={doctors}
        />
      )}
      {activeSection === "servicesBasedDates" && (
        <ServiceTable
          data={doneServices}
          services={clinic.service as Service[]}
          doctors={doctors}
        />
      )}
    </Box>
  );
};

export default ClinicDetailsContainer;
