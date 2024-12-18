import React from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableHeaderCell,
  AppointmentChip,
} from "./StyledSchedeuleComponents";
import { weekDays, SchedulePresentationProps } from "./SchedeuleInterfaces";
import { useTheme } from "@mui/material";

const SchedulePresentation: React.FC<SchedulePresentationProps> = ({
  clinics,
  appointments,
}) => {
  const theme = useTheme();

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: "88vh",
        "&::-webkit-scrollbar": {
          width: "10px",
          height: "10px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb": {
          background: theme.palette.primary.light,
          borderTopRightRadius: "4px",
          borderBottomRightRadius: "4px",
          "&:hover": {
            background: "#555",
          },
        },
        "&::-webkit-scrollbar-corner": {
          background: "#f1f1f1",
        },
      }}
    >
      <Table stickyHeader sx={{ minWidth: 650 }} aria-label="جدول المواعيد">
        <TableHead>
          <TableRow>
            <StyledTableHeaderCell align="left">التخصص</StyledTableHeaderCell>
            {weekDays.map((day) => (
              <StyledTableHeaderCell key={day} align="left">
                {day}
              </StyledTableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {clinics.map((clinic) => (
            <TableRow key={clinic.id}>
              <StyledTableCell
                component="th"
                scope="row"
                align="left"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  border: "1px solid #00000024",
                  minwidth: 163,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {clinic.name}
                </Typography>
              </StyledTableCell>
              {weekDays.map((day) => (
                <StyledTableCell key={day} align="left">
                  <Box
                    display="flex"
                    flexWrap="wrap"
                    justifyContent="flex-start"
                    flexDirection="column"
                  >
                    {appointments[clinic.name]?.[day]?.length ? (
                      appointments[clinic.name][day].map(
                        (appointment, index) => (
                          <AppointmentChip
                            key={index}
                            label={`د/ ${appointment.doctorName} \n الموعد: ${appointment.time}`}
                            color="primary"
                            variant="outlined"
                          />
                        )
                      )
                    ) : (
                      <Typography variant="caption" color="textSecondary">
                        لا توجد مواعيد
                      </Typography>
                    )}
                  </Box>
                </StyledTableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SchedulePresentation;
