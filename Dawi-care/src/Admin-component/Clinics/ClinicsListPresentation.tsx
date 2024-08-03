import React from "react";
import { Grid, Typography, useTheme } from "@mui/material";
import { ClinicsListPresentationProps } from "./ClinicsInterfaces";
import {
  StyledCard,
  StyledImageWrapper,
  StyledImage,
  StyledCardContent,
  StyledButtonBase
} from './StyledClinicsComponents';




export const ClinicsListPresentation: React.FC<ClinicsListPresentationProps> = ({
  clinics,
  onClinicClick,
}) => {

  const theme = useTheme();


  return (
    <Grid container spacing={3} justifyContent="center">
      {clinics.map((clinic) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={clinic.value}>
          <StyledButtonBase onClick={() => onClinicClick(clinic)} theme={theme}> 
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
  );
};