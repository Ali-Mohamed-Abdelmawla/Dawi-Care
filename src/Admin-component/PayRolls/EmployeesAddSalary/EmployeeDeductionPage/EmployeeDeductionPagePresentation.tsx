import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Chip,
  Avatar,
} from "@mui/material";
import { Check, CircleDollarSign, CalendarDays } from "lucide-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import dayjs from "../../../../dateConfig";

import { useForm, Controller } from "react-hook-form";
import { Employee } from "../../../Employees/employeeInterfaces";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material/styles";

export interface DeductionFormData {
  deduction: number;
  customDeduction: number;
  description: string;
}

interface EmployeeDeductionPagePresentationProps {
  employee: Employee;
  isCustomDeduction: boolean;
  setIsCustomDeduction: (value: boolean) => void;
  selectedDate: dayjs.Dayjs | null;
  setSelectedDate: (date: dayjs.Dayjs | null) => void;
  onSubmit: (data: DeductionFormData) => Promise<void>;
  isSubmitting: boolean;
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

const ChipGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  flexWrap: "wrap",
  marginTop: theme.spacing(2),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.common.white}`,
  boxShadow: theme.shadows[3],
}));

export const EmployeeDeductionPagePresentation: React.FC<
  EmployeeDeductionPagePresentationProps
> = ({
  employee,
  isCustomDeduction,
  setIsCustomDeduction,
  selectedDate,
  setSelectedDate,

  onSubmit,
  isSubmitting,
}) => {
  const [isDeductionFocused, setIsDeductionFocused] = useState<boolean>(false);
  const { control, handleSubmit } = useForm<DeductionFormData>({
    defaultValues: {
      deduction: 0,
      customDeduction: 0,
      description: "",
    },
    mode: "onBlur",
  });

  return (
    <Box sx={{ p: 3 }} dir="rtl">
      <ProfileCard elevation={3}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <StyledAvatar>{employee.name.charAt(0).toUpperCase()}</StyledAvatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              {employee.name}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {employee.description}
            </Typography>

            <ChipGroup>
              <Chip
                icon={<CircleDollarSign />}
                label={`الراتب الأساسي: ${employee.fixed_salary} ج.م`}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: "white",
                }}
              />
              <Chip
                icon={<CalendarDays />}
                label={`عدد أيام العمل: ${
                  employee.weekdays.filter((day) => !day.switch_day).length
                }`}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: "white",
                }}
              />
            </ChipGroup>
          </Grid>
        </Grid>
      </ProfileCard>

      {isCustomDeduction ? (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                اختر يوم العمل
              </Typography>
              <StyledDatePicker elevation={3}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="ar"
                >
                  <StaticDatePicker
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                  />
                </LocalizationProvider>
              </StyledDatePicker>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                تفاصيل الخصم
              </Typography>
              <Controller
                name="customDeduction"
                control={control}
                rules={
                  isCustomDeduction
                    ? {
                        required: "قيمة الخصم مطلوبة",
                        pattern: {
                          value: /^\d+$/,
                          message: "يجب إدخال أرقام فقط",
                        },
                        min: {
                          value: 1,
                          message: "يجب أن تكون قيمة الخصم 1 أو أكبر",
                        },
                        max: {
                          value: employee.fixed_salary,
                          message: "لا يمكن أن يتجاوز الخصم قيمة الراتب",
                        },
                      }
                    : {}
                }
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="قيمة الخصم المخصص"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                    disabled={!isCustomDeduction} // Disable this field when normal deduction is active
                    sx={{mb:2}}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                rules={{ required: "هذا الحقل مطلوب" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    maxRows={6} // Limit the number of rows
                    multiline
                    label="سبب الخصم"
                    helperText={error?.message}
                    error={!!error}
                    sx={{
                      width: "100%",
                    }}
                  />
                )}
              />

              <Box component={"div"} sx={{ display: "flex", mt: 2 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={isSubmitting}
                  loadingPosition="end"
                  endIcon={<Check />}
                >
                  تأكيد
                </LoadingButton>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setIsCustomDeduction(!isCustomDeduction)}
                  sx={{ ml: 2 }}
                >
                  {isCustomDeduction
                    ? "عودة إلى الخصم العادي"
                    : "إضافة خصم مخصص"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Controller
                name="deduction"
                control={control}
                rules={
                  !isCustomDeduction
                    ? {
                        required: "قيمة الخصم مطلوبة",
                        pattern: {
                          value: /^\d+$/,
                          message: "يجب إدخال أرقام فقط",
                        },
                        min: {
                          value: 1,
                          message: "يجب أن تكون قيمة الخصم 1 أو أكبر",
                        },
                        max: {
                          value: employee.fixed_salary,
                          message: "لا يمكن أن يتجاوز الخصم قيمة الراتب",
                        },
                      }
                    : {}
                }
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="قيمة الخصم"
                    fullWidth
                    error={!!error}
                    onFocus={() => setIsDeductionFocused(true)}
                    onBlur={() => setIsDeductionFocused(false)}
                    helperText={
                      isDeductionFocused
                        ? "القيمة المسجلة الآن هي التي سيتم خصمها لكل يوم غابه الموظف"
                        : error?.message
                    }
                  />
                )}
              />
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isPaid}
                    onChange={(e) => setIsPaid(e.target.checked)}
                    color="primary"
                  />
                }
                label="هل سيتم دفع الراتب الآن؟"
              />
            </Grid> */}
          </Grid>
          <Box component={"div"} sx={{ display: "flex", mt: 2 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              loading={isSubmitting}
              loadingPosition="end"
              endIcon={<Check />}
            >
              <span>سيتم دفع الراتب</span>
            </LoadingButton>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsCustomDeduction(!isCustomDeduction)}
              sx={{ ml: 2 }}
            >
              {isCustomDeduction ? "عودة إلى الخصم العادي" : "إضافة خصم مخصص"}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};
