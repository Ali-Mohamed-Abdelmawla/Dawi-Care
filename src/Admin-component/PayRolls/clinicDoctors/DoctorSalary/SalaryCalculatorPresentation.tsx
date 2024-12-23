import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  IconButton,
  Button,
  Avatar,
  Chip,
  TextField,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  RestartAlt as ResetIcon,
  AccessTime as AccessTimeIcon,
  DateRange as DateRangeIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import dayjs from "../../../../dateConfig";

import { styled } from "@mui/material/styles";
import { Doctor } from "../../../Doctors/doctorInterfaces";
import { WeekDay } from "../../../AbsenceSubmission/AbsenceInterfaces";
import { Service } from "../../ClinicsInterfaces";

interface AttendanceRecord {
  attendanceId: number;
  day: string | null;
  switch_day: string | null;
  attendance: number;
  date: string;
}

interface Props {
  services: Service[];
  doctor?: Doctor;
  attendance: AttendanceRecord[];
  selectedDate: dayjs.Dayjs | null;
  onDateSelect: (date: dayjs.Dayjs | null) => void;
  onServiceQuantityChange: (serviceId: number, change: number) => void;
  onSubmit: () => void;
  onReset: () => void;
  isSubmitting: boolean;
  totalAmount: number;
}

// Styled Components
const ProfileCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const StyledDatePicker = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
  "& .MuiPickersDay-root": {
    margin: "2px",
    borderRadius: "8px",
  },
}));

const ServiceCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `2px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  transition: "border-color 0.3s ease",
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    borderColor: theme.palette.primary.main,
  },
}));

const ServiceQuantityControls = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
}));

const TotalAmountCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.common.white}`,
  boxShadow: theme.shadows[3],
}));

const ChipGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  flexWrap: "wrap",
  marginTop: theme.spacing(2),
}));

const ServicesGrid = styled(Box)(({ theme }) => ({
  maxHeight: "400px",
  overflowY: "auto",
  marginTop: theme.spacing(2),
  padding: theme.spacing(1),
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: theme.palette.background.default,
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.primary.main,
    borderRadius: "4px",
  },
}));

const CustomPickersDay = (
  props: PickersDayProps<dayjs.Dayjs> & {
    isAbsent?: boolean;
    isPresent?: boolean;
  }
) => {
  const { day, isAbsent, isPresent, ...other } = props;
  console.log("day: ", day, "isAbsent: ", isAbsent, "isPresent: ", isPresent);

  return (
    <PickersDay
      {...other}
      day={day}
      sx={{
        ...(isAbsent && {
          backgroundColor: "error.light",
          color: "error.contrastText",
          "&:hover": {
            backgroundColor: "error.main",
          },
        }),
        ...(isPresent && {
          backgroundColor: "success.light",
          color: "success.contrastText",
          "&:hover": {
            backgroundColor: "success.main",
          },
        }),
      }}
    />
  );
};

const DoctorSalaryCalculatorPresentation: React.FC<Props> = ({
  services,
  doctor,
  attendance,
  selectedDate,
  onDateSelect,
  onServiceQuantityChange,
  onSubmit,
  onReset,
  isSubmitting,
  totalAmount,
}) => {
  const getRegularWorkDays = (weekDays: WeekDay[]) => {
    return weekDays.filter((day) => !day.switch_day).length;
  };
  const [searchTerm, setSearchTerm] = useState<string>("");
  const isDateAvailable = (date: dayjs.Dayjs) => {
    return attendance.some(
      (record) => record.date === date.format("YYYY-MM-DD")
    );
  };

  const getAttendanceStatus = (date: dayjs.Dayjs) => {
    const record = attendance.find(
      (record) => record.date === date.format("YYYY-MM-DD")
    );
    return record?.attendance === 1;
  };

  const filteredServices = services?.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }} dir="rtl">
      {doctor && (
        <ProfileCard elevation={3}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <StyledAvatar
                src={`http://127.0.0.1:8000${doctor.profile_photo}`}
                alt={doctor.name}
              >
                {!doctor.profile_photo && doctor.name.charAt(0)}
              </StyledAvatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                {doctor.name}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, color: "rgba(255, 255, 255, 0.8)" }}
              >
                الدرجه العلميه: {doctor.scientific_degree}
              </Typography>
              <ChipGroup>
                <Chip
                  icon={<DateRangeIcon />}
                  label={`تاريخ التعيين: ${dayjs(doctor.hire_date).format(
                    "DD/MM/YYYY"
                  )}`}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    color: "white",
                  }}
                />
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`أيام العمل الثابتة: ${getRegularWorkDays(
                    doctor.week_days
                  )}`}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    color: "white",
                  }}
                />
                <Chip
                  icon={<PhoneIcon />}
                  label={doctor.phone_number}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    color: "white",
                  }}
                />
                <Chip
                  icon={<BadgeIcon />}
                  label={`رقم قومي: ${doctor.national_id}`}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    color: "white",
                  }}
                />
              </ChipGroup>
            </Grid>
          </Grid>
        </ProfileCard>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            اختر يوم العمل
          </Typography>
          <StyledDatePicker elevation={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ar">
              <StaticDatePicker
                value={selectedDate}
                onChange={onDateSelect}
                shouldDisableDate={(date) => !isDateAvailable(date)}
                slots={{
                  day: CustomPickersDay as React.FC<
                    PickersDayProps<dayjs.Dayjs>
                  >,
                }}
                slotProps={{
                  day: (props) => ({
                    ...props,
                    isPresent: getAttendanceStatus(props.day),
                    isAbsent:
                      isDateAvailable(props.day) &&
                      !getAttendanceStatus(props.day),
                  }),
                }}
              />
            </LocalizationProvider>
          </StyledDatePicker>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            الخدمات المقدمة
          </Typography>
          <TextField
            fullWidth
            value={searchTerm}
            variant="outlined"
            placeholder="بحث عن الخدمات..."
            sx={{ mb: 2 }}
            onChange={(e) => {
              setSearchTerm(e.target.value.toLowerCase());
            }}
          />
          <ServicesGrid>
            <Grid container spacing={2}>
              {filteredServices.map((service) => (
                <Grid item xs={12} key={service.id}>
                  <ServiceCard>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs>
                        <Typography variant="h6">{service.name}</Typography>
                        <Typography color="primary">
                          {service.price} جنيه
                        </Typography>
                      </Grid>
                      <Grid item>
                        <ServiceQuantityControls>
                          <IconButton
                            onClick={() =>
                              onServiceQuantityChange(service.id, -1)
                            }
                            disabled={!service.quantity}
                            size="small"
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography
                            sx={{ minWidth: 40, textAlign: "center" }}
                          >
                            {service.quantity || 0}
                          </Typography>
                          <IconButton
                            onClick={() =>
                              onServiceQuantityChange(service.id, 1)
                            }
                            size="small"
                          >
                            <AddIcon />
                          </IconButton>
                        </ServiceQuantityControls>
                      </Grid>
                    </Grid>
                  </ServiceCard>
                </Grid>
              ))}
            </Grid>
          </ServicesGrid>

          <TotalAmountCard elevation={3}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h5">إجمالي المبلغ</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h4">
                  {Math.max(0, totalAmount).toFixed(2)} جنيه
                </Typography>
              </Grid>
            </Grid>
          </TotalAmountCard>
        </Grid>
      </Grid>

      <Box
        sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "space-between" }}
      >
        <LoadingButton
          loading={isSubmitting}
          endIcon={<AddIcon />}
          loadingPosition="end"
          onClick={onSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting || !selectedDate || totalAmount <= 0}
          size="large"
          sx={{
            minWidth: 200,
            "&.Mui-disabled": {
              backgroundColor: "action.disabledBackground",
              color: "action.disabled",
            },
          }}
        >
          {isSubmitting ? "جاري الإرسال..." : "تأكيد الراتب اليومي"}
        </LoadingButton>
        <Button
          variant="outlined"
          color="error"
          size="large"
          onClick={onReset}
          startIcon={<ResetIcon />}
          sx={{ minWidth: 160 }}
        >
          إعادة تعيين الكل
        </Button>
      </Box>
    </Box>
  );
};

export default DoctorSalaryCalculatorPresentation;
