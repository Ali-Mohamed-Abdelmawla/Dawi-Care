import React, { ChangeEvent, useState } from "react";
import { Grid, Typography, InputAdornment, Pagination } from "@mui/material";
import { ClinicsListPresentationProps } from "./ClinicsInterfaces";
import generalClinic from './ClinicsImages/general_clinic.png';
import { useClinicStyles } from './useClinicStyles';

export const ClinicsListPresentation: React.FC<ClinicsListPresentationProps> = ({
  clinics,
  doctors,
  searchTerm,
  setSearchTerm,
  onClinicClick,
  onEditClinic,
  onDeleteClinic,
}) => {
  const {
    StyledCard,
    StyledCardContent,
    StyledImageWrapper,
    StyledImage,
    StyledTextField,
    StyledSearchIcon,
    ActionsOverlay,
    StyledButtonBase,
    ActionIconButton,
    DeleteIcon,
    EditIcon,
  } = useClinicStyles();

  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setPage(1); // Reset to first page on new search
  };
  
  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredClinics = clinics.filter(clinic => 
    clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    filteredDoctors.some(doctor => doctor.clinic_id === clinic.id)
  );

  const totalPages = Math.ceil(filteredClinics.length / itemsPerPage);
  const paginatedClinics = filteredClinics.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
  //   setPage(value);
  // };

  return (
    <>
      <StyledTextField
        autoFocus
        fullWidth
        variant="outlined"
        placeholder="ابحث عن طبيب أو عيادة..."
        value={searchTerm}
        onChange={handleSearchChange}
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
        {paginatedClinics.map((clinic) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={clinic.id}>
            <StyledButtonBase onClick={() => onClinicClick(clinic, searchTerm)}>
              <StyledCard>
                <StyledImageWrapper>
                  <StyledImage
                    src={generalClinic}
                    alt={clinic.name}
                    loading="lazy"
                  />
                </StyledImageWrapper>
                <StyledCardContent>
                  <Typography variant="h6" component="div" align="center">
                    {clinic.name}
                  </Typography>
                </StyledCardContent>

                <ActionsOverlay className="actions-overlay">
                  <ActionIconButton
                    className="edit-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClinic(clinic);
                    }}
                    aria-label="Edit clinic"
                  >
                    <EditIcon />
                  </ActionIconButton>
                  <ActionIconButton
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteClinic(clinic.id);
                    }}
                    aria-label="Delete clinic"
                  >
                    <DeleteIcon />
                  </ActionIconButton>
                </ActionsOverlay>
              </StyledCard>
            </StyledButtonBase>
          </Grid>
        ))}
      </Grid>
        <Grid container justifyContent="center" sx={{ mt: 4, mb: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_,value)=>{setPage(value)}}
            color="primary"
            size="large"
            variant="outlined"
            shape="rounded"
          />
        </Grid>
    </>
  );
};