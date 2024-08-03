// ClinicDetailsPresentation.tsx
import React from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ClinicDetailsPresentationProps } from "../ClinicsInterfaces";
import { StyledTablePaper, StyledTableCell } from "../StyledClinicsComponents";

export const ClinicDetailsPresentation: React.FC<
  ClinicDetailsPresentationProps
> = ({ clinic, doctors, onDoctorSelect }) => {
  return (
    <StyledTablePaper elevation={3}>
      <Typography variant="h5" gutterBottom>
        حسابات عيادة {clinic.value}
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>اسم الطبيب</StyledTableCell>
              <StyledTableCell align="left">الراتب</StyledTableCell>
              <StyledTableCell align="left">نسبة المركز</StyledTableCell>
              <StyledTableCell align="left">الدخل الإجمالي</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow
                key={doctor.id}
                onClick={() => onDoctorSelect(doctor)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{doctor.name}</TableCell>
                <TableCell align="left">{doctor.salary}</TableCell>
                <TableCell align="left">{doctor.centerPercentage}%</TableCell>
                <TableCell align="left">{doctor.totalIncome}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledTablePaper>
  );
};
