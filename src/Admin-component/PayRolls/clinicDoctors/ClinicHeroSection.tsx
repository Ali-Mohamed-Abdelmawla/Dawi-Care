import React from "react";
import { Typography } from "@mui/material";
import { useClinicStyles } from "../useClinicStyles";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { NewClinic } from "../ClinicsInterfaces";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

interface ClinicHeroSectionProps {
  clinic: NewClinic;
}

const ClinicHeroSection: React.FC<ClinicHeroSectionProps> = ({ clinic }) => {
  const {
    ProfileHeroSection,
    CreatedAtText,
    ServicesSection,
    ServicesGrid,
    ServiceCard,
    ServiceCardContent,
    ServiceIcon,
    ServicePrice,
  } = useClinicStyles();

  return (
    <>
      <ProfileHeroSection>
        <Typography variant="h3" gutterBottom sx={{ color: "white" }}>
          {clinic.name}
        </Typography>
        <CreatedAtText>
          تم الإنشاء في {formatDate(clinic.created_at)}
        </CreatedAtText>
      </ProfileHeroSection>

      <ServicesSection>
        <Typography variant="h5" gutterBottom>
          الخدمات المتوفرة
        </Typography>
        <ServicesGrid>
          {clinic.service?.map((service, index) => (
            <ServiceCard key={index}>
              <ServiceCardContent>
                <ServiceIcon>
                  <LocalHospitalIcon />
                </ServiceIcon>
                <Typography variant="h6" sx={{ textAlign: "center" }}>
                  {service.name}
                </Typography>
                <ServicePrice>{service.price} جنيه</ServicePrice>
              </ServiceCardContent>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </ServicesSection>
    </>
  );
};

export default ClinicHeroSection;
