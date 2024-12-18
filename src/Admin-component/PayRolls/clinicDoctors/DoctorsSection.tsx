import React from 'react';
import { 
  Box, 
  TextField, 
  InputAdornment, 
  Typography,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { DoctorWage } from '../ClinicsInterfaces';
import { useClinicStyles } from './../useClinicStyles';
interface DoctorsSectionProps {
  doctors: DoctorWage[];
  searchTerm: string;
  onDoctorSelect: (doctor: DoctorWage) => void;
  onSearchChange: (term: string) => void;
}

const DoctorsSection: React.FC<DoctorsSectionProps> = ({
  doctors,
  searchTerm,
  onDoctorSelect,
  onSearchChange
}) => {
  // Use the styled components from useClinicStyles
  const { 
    StyledTablePaper, 
    StyledTableCell, 
    StyledSearchIcon 
  } = useClinicStyles();

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      {/* Search TextField */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="ابحث عن طبيب..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <StyledSearchIcon />
            </InputAdornment>
          )
        }}
      />

      {/* Doctors Table */}
      {doctors.length > 0 ? (
        <StyledTablePaper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>اسم الطبيب</StyledTableCell>
                  <StyledTableCell>الراتب الأساسي</StyledTableCell>
                  <StyledTableCell>نسبة الطبيب</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doctors.map((doctor) => (
                  <TableRow 
                    key={doctor.id} 
                    hover 
                    onClick={() => onDoctorSelect(doctor)}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { 
                        backgroundColor: 'rgba(0, 0, 0, 0.04)' 
                      }
                    }}
                  >
                    <StyledTableCell>{doctor.name}</StyledTableCell>
                    <StyledTableCell>{doctor.fixed_salary} جنيه</StyledTableCell>
                    <StyledTableCell>{doctor.doctor_share}%</StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </StyledTablePaper>
      ) : (
        <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
          {searchTerm 
            ? `لا توجد نتائج للبحث "${searchTerm}"` 
            : 'لم يتم العثور على أطباء'}
        </Typography>
      )}
    </Box>
  );
};

export default DoctorsSection;