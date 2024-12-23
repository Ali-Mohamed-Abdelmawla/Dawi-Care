import React, { useState, useMemo } from "react";
import {
  Box,
  InputAdornment,
  Typography,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { DoctorWage } from "../ClinicsInterfaces";
import { useClinicStyles } from "./../useClinicStyles";

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
  onSearchChange,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const {
    StyledTablePaper,
    StyledTableCell,
    StyledSearchIcon,
    StyledTextField,
  } = useClinicStyles();

  // Filter doctors based on search term
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [doctors, searchTerm]);

  // Reset page when search term changes
  React.useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  // Handle page change
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    console.log(event)
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get current page data
  const paginatedDoctors = filteredDoctors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      {/* Search TextField */}
      <StyledTextField
        autoFocus
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
          ),
        }}
      />

      {/* Doctors Table */}
      {filteredDoctors.length > 0 ? (
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
                {paginatedDoctors.map((doctor) => (
                  <TableRow
                    key={doctor.id}
                    hover
                    onClick={() => onDoctorSelect(doctor)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <StyledTableCell>{doctor.name}</StyledTableCell>
                    <StyledTableCell>
                      {doctor.fixed_salary} جنيه
                    </StyledTableCell>
                    <StyledTableCell>{doctor.doctor_share}%</StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredDoctors.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="عدد الصفوف"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} من ${count}`
            }
            rowsPerPageOptions={[5, 10, 25]}
            dir="rtl"
          />
        </StyledTablePaper>
      ) : (
        <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
          {searchTerm
            ? `لا توجد نتائج للبحث "${searchTerm}"`
            : "لم يتم العثور على أطباء"}
        </Typography>
      )}
    </Box>
  );
};

export default DoctorsSection;
