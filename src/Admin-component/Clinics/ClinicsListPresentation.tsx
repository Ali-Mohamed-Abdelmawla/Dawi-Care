// ClinicsListPresentation.tsx
import React from "react";
import { Grid, Typography, useTheme, InputAdornment } from "@mui/material";
import { ClinicsListPresentationProps } from "./ClinicsInterfaces";
import {
  StyledCard,
  StyledImageWrapper,
  StyledImage,
  StyledCardContent,
  StyledButtonBase,
  StyledTextField,
  StyledSearchIcon
} from './StyledClinicsComponents';

export const ClinicsListPresentation: React.FC<ClinicsListPresentationProps> = ({
  clinics,
  doctors,
  searchTerm,
  setSearchTerm,
  onClinicClick,
}) => {
  const theme = useTheme();

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClinics = clinics.filter(clinic =>
    clinic.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    filteredDoctors.some(doctor => doctor.specialty === clinic.value)
  );

  return (
    <>
      <StyledTextField
        fullWidth
        variant="outlined"
        placeholder="ابحث عن طبيب أو عيادة..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <StyledSearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Grid container spacing={3} justifyContent="center">
        {filteredClinics.map((clinic) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={clinic.value}>
            <StyledButtonBase onClick={() => onClinicClick(clinic, searchTerm)} theme={theme}> 
              <StyledCard>
                <StyledImageWrapper>
                  <StyledImage
                    src={clinic.imageUrl}
                    alt={clinic.label}
                    loading="lazy"
                    onError={(e) => {
                      console.error(`Failed to load image for clinic: ${clinic.value}`);
                      console.log("Image src:", (e.target as HTMLImageElement).src);
                    }}
                  />
                </StyledImageWrapper>
                <StyledCardContent>
                  <Typography variant="h6" component="div" align="center">
                    {clinic.label}
                  </Typography>
                </StyledCardContent>
              </StyledCard>
            </StyledButtonBase>
          </Grid>
        ))}
      </Grid>
    </>
  );
};