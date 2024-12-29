import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Select from "react-select";
import dayjs from "../../dateConfig";

import { styled } from "@mui/system";

import { SwapDayFormData, AttendanceData } from "./AbsenceInterfaces";

interface SwapDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SwapDayFormData) => void;
  personAttendance: AttendanceData[];
}

const dayOptions = [
  { value: "الأحد", label: "الأحد" },
  { value: "الاثنين", label: "الاثنين" },
  { value: "الثلاثاء", label: "الثلاثاء" },
  { value: "الأربعاء", label: "الأربعاء" },
  { value: "الخميس", label: "الخميس" },
  { value: "الجمعة", label: "الجمعة" },
  { value: "السبت", label: "السبت" },
];

const StyledCard = styled(Card)({
  maxWidth: 600,
  width: "400px",
  margin: "auto",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  borderRadius: 12,
  overflow: "hidden",
});

const Header = styled(Box)({
  backgroundColor: "#1976d2",
  color: "#ffffff",
  padding: "16px",
  textAlign: "center",
});

const StyledCardContent = styled(CardContent)({
  padding: 16,
});

const SwapDayModal: React.FC<SwapDayModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  personAttendance,
}) => {
  const { control, handleSubmit, watch } = useForm<SwapDayFormData>();
  const selectedDay = watch("day");

  // Pre-filter `absentDates` based on `personAttendance` and reuse throughout the component
  const absentDates = useMemo(() => { 
    console.log(personAttendance)
    return Array.isArray(personAttendance)
      ? personAttendance.filter((date) => date?.attedance === 0)
      : [];
  }, [personAttendance]);

  const absentDateOptions = absentDates.map((date) => ({
    value: date.date,
    label: dayjs(date.date).locale("ar").format("dddd, YYYY/MM/DD"),
  }));

  const isDateSelectable = (date: dayjs.Dayjs) => {
    if (!selectedDay) return false;

    // Convert Arabic day names to English day indices
    const dayMapping = {
      الأحد: 0,
      الاثنين: 1,
      الثلاثاء: 2,
      الأربعاء: 3,
      الخميس: 4,
      الجمعة: 5,
      السبت: 6,
    };

    const selectedDayIndex =
      dayMapping[selectedDay.value as keyof typeof dayMapping];

    // Check if the date matches the selected day and is not in `absentDates`
    const isNotAbsent = !absentDates.some((absentDate) =>
      dayjs(absentDate.date).isSame(date, "day")
    );

    return date.day() === selectedDayIndex && isNotAbsent;
  };

  useEffect(() => {
    console.log(absentDates); // Debugging/logging
  }, [absentDates]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="swap-day-modal-title"
      aria-describedby="swap-day-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 15,
          borderRadius: 12,
          "& .MuiFormLabel-root": {
            zIndex: 0,
          },
        }}
      >
        <StyledCard>
          <Header>
            <Typography variant="h5" component="div">
              تبديل يوم العمل
            </Typography>
          </Header>
          <StyledCardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item>
                  {absentDates.length === 0 && (
                    <Alert severity="info" variant="outlined">
                      لا يمكن إجراء أي تغيير على أيام عمل هذا الموظف نظراً لعدم
                      وجود أي ايام غياب.
                    </Alert>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    اليوم الجديد
                  </Typography>
                  <Controller
                    name="day"
                    control={control}
                    rules={{ required: "اختيار اليوم مطلوب" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={dayOptions}
                        placeholder="اختر اليوم"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    تاريخ الغياب
                  </Typography>
                  <Controller
                    name="absentDate"
                    control={control}
                    rules={{ required: "اختيار تاريخ الغياب مطلوب" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={absentDateOptions}
                        placeholder="اختر تاريخ الغياب"
                      />
                    )}
                  />
                </Grid>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="ar"
                >
                  <Grid item xs={12}>
                    <Controller
                      name="date"
                      control={control}
                      rules={{ required: "التاريخ مطلوب" }}
                      render={({ field }) => (
                        <DatePicker
                          label="التاريخ"
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(newValue) => field.onChange(newValue)}
                          shouldDisableDate={(date) => !isDateSelectable(date)}
                          sx={{ width: "100%" }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="time"
                      control={control}
                      rules={{ required: "الوقت مطلوب" }}
                      render={({ field }) => (
                        <TimePicker
                          label="الوقت"
                          value={
                            field.value ? dayjs(field.value, "HH:mm") : null
                          }
                          onChange={(newValue) =>
                            field.onChange(
                              newValue ? newValue.format("HH:mm") : ""
                            )
                          }
                          sx={{ width: "100%" }}
                        />
                      )}
                    />
                  </Grid>
                </LocalizationProvider>
                <Grid
                  item
                  xs={12}
                  sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
                >
                  <Button onClick={onClose} sx={{ mr: 1 }}>
                    إلغاء
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    تأكيد
                  </Button>
                </Grid>
              </Grid>
            </form>
          </StyledCardContent>
        </StyledCard>
      </Box>
    </Modal>
  );
};

export default SwapDayModal;
