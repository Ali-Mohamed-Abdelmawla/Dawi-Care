import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  Divider,
  Tooltip,
  Popover,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Select, { SingleValue } from "react-select";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import dayjs from "dayjs";
import { SwapDayFormData, AbsencePresentationProps } from "./AbsenceInterfaces";
import PersonSelect from "../../helper/personSelect/personSelect";
import theme from "../../Apptheme";
import TwoColumnDaysUI from "./TwoColumnDaysUI";

type DayOption = { value: string; label: string };

const AbsencePresentation: React.FC<AbsencePresentationProps> = ({
  handleMarkAsAbsent,
  selectedPersonAttendance,
  updateAbsenceStatus,
  selectedPerson,
  personType,
  onPersonChange,
  onPersonTypeChange,
  handleSwapDaySubmit,
}) => {
  const [showSwitchedDays, setShowSwitchedDays] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isSwapDayModalOpen, setIsSwapDayModalOpen] = useState(false);
  const { control, handleSubmit, watch } = useForm<SwapDayFormData>();
  const selectedDay = watch("day");

  const isDateDisabled = (date: dayjs.Dayjs) => {
    if (!selectedPerson || !selectedPerson.weekDays) {
      return true;
    }

    const dayOfWeek = date.day();
    const allowedDays = selectedPerson.weekDays.map((day) => {
      const daysMap: { [key: string]: number } = {
        الأحد: 0,
        الاثنين: 1,
        الثلاثاء: 2,
        الأربعاء: 3,
        الخميس: 4,
        الجمعة: 5,
        السبت: 6,
      };

      const dayName = day.day || day.switch_day;
      if (dayName === null) {
        throw new Error(`Unexpected null value for day with id ${day.id}`);
      }
      const mappedDay = daysMap[dayName];

      return mappedDay;
    });

    return !allowedDays.includes(dayOfWeek);
  };

  const isDateAbsent = (date: dayjs.Dayjs) => {
    return selectedPersonAttendance?.some(
      (attendance) =>
        attendance.date === date.format("YYYY-MM-DD") &&
        attendance.attendance === 0
    );
  };

  const CustomPickersDay = (props: PickersDayProps<dayjs.Dayjs>) => {
    const { day, ...other } = props;
    const isAbsent = isDateAbsent(day);

    return (
      <PickersDay
        {...other}
        day={day}
        sx={{
          ...(isAbsent && {
            backgroundColor: "red",
            color: "white",
            "&:hover": {
              backgroundColor: "darkred",
            },
          }),
        }}
      />
    );
  };

  const handleAttendanceListClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAttendanceListClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "attendance-popover" : undefined;

  const ArabicDaysMapping = {
    Sunday: "الأحد",
    Monday: "الاثنين",
    Tuesday: "الثلاثاء",
    Wednesday: "الأربعاء",
    Thursday: "الخميس",
    Friday: "الجمعة",
    Saturday: "السبت",
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    console.log(event);
    onPersonTypeChange(newValue as "doctor" | "employee");
  };

  const handleSwapDayClick = () => {
    setIsSwapDayModalOpen(true);
  };

  const handleCloseSwapDayModal = () => {
    setIsSwapDayModalOpen(false);
  };

  const onSubmit = (data: SwapDayFormData) => {
    const formattedData = {
      ...data,
      date: dayjs(data.date).format("YYYY-MM-DD"),
    };
    handleSwapDaySubmit(formattedData);
    handleCloseSwapDayModal();
  };

  const handleTwoDayColumnsClick = () => {
    setShowSwitchedDays(!showSwitchedDays);
  };

  const dayOptions: DayOption[] = [
    { value: "الأحد", label: "الأحد" },
    { value: "الاثنين", label: "الاثنين" },
    { value: "الثلاثاء", label: "الثلاثاء" },
    { value: "الأربعاء", label: "الأربعاء" },
    { value: "الخميس", label: "الخميس" },
    { value: "الجمعة", label: "الجمعة" },
    { value: "السبت", label: "السبت" },
  ];

  const isDateSelectable = useMemo(() => {
    return (date: dayjs.Dayjs) => {
      if (!selectedDay) return false;
      const dayIndex = dayOptions.findIndex(
        (option) => option.value === selectedDay
      );
      return date.day() === dayIndex && date.month() === dayjs().month();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay]);

  return (
    <Box
      sx={{
        p: 3,
      }}
    >
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
        >
          <Tabs
            value={personType}
            onChange={handleTabChange}
            indicatorColor="secondary"
            textColor="primary"
          >
            <Tab label="طبيب" value="doctor" />
            <Tab label="موظف" value="employee" />
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            {personType === "doctor" ? "اختر طبيبًا" : "اختر موظفًا"}
          </Typography>
          <PersonSelect
            personType={personType}
            onChange={onPersonChange}
            value={selectedPerson}
          />
        </Grid>
      </Grid>

      {selectedPerson && (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mt: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            ايام عمل {personType === "doctor" ? "الدكتور" : "الموظف"}{" "}
            {selectedPerson.label}
          </Typography>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 2, mb: 2 }}
          >
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSwapDayClick}
              >
                تبديل يوم العمل
              </Button>
            </Grid>
          </Grid>

          <Dialog open={isSwapDayModalOpen} onClose={handleCloseSwapDayModal}>
            <DialogTitle>تبديل يوم العمل</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogContent>
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    اليوم الجديد
                  </Typography>
                  <Controller
                    name="day"
                    control={control}
                    rules={{
                      required: "اختيار اليوم مطلوب",
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={dayOptions}
                        placeholder="اختر اليوم"
                        onChange={(selectedOption: SingleValue<DayOption>) => {
                          field.onChange(selectedOption?.value);
                        }}
                        menuPosition="fixed"
                        value={
                          dayOptions.find(
                            (option) => option.value === field.value
                          ) || null
                        }
                      />
                    )}
                  />
                </Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                        sx={{
                          mt: 2,
                          mb: 2,
                          width: "100%",
                          ".MuiInputLabel-root": {
                            zIndex: 0,
                          },
                        }}
                        minDate={dayjs().startOf("month")}
                        maxDate={dayjs().endOf("month")}
                        views={["day"]}
                      />
                    )}
                  />
                  <Controller
                    name="time"
                    control={control}
                    rules={{ required: "الوقت مطلوب" }}
                    render={({ field }) => (
                      <TimePicker
                        label="الوقت"
                        value={field.value ? dayjs(field.value, "HH:mm") : null}
                        onChange={(newValue) =>
                          field.onChange(
                            newValue ? newValue.format("HH:mm") : ""
                          )
                        }
                        sx={{
                          mt: 2,
                          mb: 2,
                          width: "100%",
                          ".MuiInputLabel-root": {
                            zIndex: 0,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseSwapDayModal}>إلغاء</Button>
                <Button type="submit" variant="contained" color="primary">
                  تأكيد
                </Button>
              </DialogActions>
            </form>
          </Dialog>
          {selectedPerson.weekDays && selectedPerson.weekDays.length > 0 ? (
            <TwoColumnDaysUI
              weekDays={selectedPerson.weekDays}
              showSwitchedDays={showSwitchedDays}
              setShowSwitchedDays={setShowSwitchedDays}
              personType={personType}
            />
          ) : (
            <Typography>
              لم يتم جدولة أيام عمل لهذا{" "}
              {personType === "doctor" ? "الطبيب" : "الموظف"}.
            </Typography>
          )}
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                اختر يوم الغياب
              </Typography>
            </Grid>
            <Grid item>
              <Tooltip title="عرض قائمة الغياب">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleTwoDayColumnsClick}
                >
                  عرض الأيام المبدله
                </Button>
              </Tooltip>
              <Tooltip title="عرض قائمة الغياب">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleAttendanceListClick}
                >
                  قائمة الغياب
                </Button>
              </Tooltip>
            </Grid>
          </Grid>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              orientation="landscape"
              openTo="day"
              value={selectedDate}
              shouldDisableDate={isDateDisabled}
              onChange={(newValue) => {
                setSelectedDate(newValue);
              }}
              slots={{
                day: CustomPickersDay,
              }}
              displayStaticWrapperAs="desktop"
              minDate={dayjs().startOf("month")}
              maxDate={dayjs().endOf("month")}
              views={["day"]}
            />
          </LocalizationProvider>
          {selectedDate && (
            <>
              {isDateAbsent(selectedDate) ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    updateAbsenceStatus(selectedDate.toDate(), selectedPerson)
                  }
                  sx={{ mt: 2, mr: 2 }}
                >
                  تعديل حالة الغياب
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() =>
                    handleMarkAsAbsent(selectedDate.toDate(), selectedPerson)
                  }
                  sx={{ mt: 2, mr: 2 }}
                >
                  وضع علامة كغائب
                </Button>
              )}
            </>
          )}

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleAttendanceListClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            disableScrollLock={true}
          >
            <Paper
              sx={{
                p: 2,
                maxWidth: 350,
                backgroundColor: "#f6f6f6",
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  borderBottom: 1,
                  borderColor: theme.palette.dividerColor.main,
                  mb: 1,
                }}
              >
                قائمة الغياب
              </Typography>
              {selectedPersonAttendance &&
              selectedPersonAttendance.length > 0 ? (
                <List
                  sx={{
                    maxHeight: 300,
                    width: 350,
                    overflowY: "auto",
                  }}
                >
                  {selectedPersonAttendance.map((attendance, index) => {
                    const attendanceDate = dayjs(attendance.date);
                    const dayName = attendanceDate.locale("ar").format("dddd");
                    return (
                      <React.Fragment key={index}>
                        <ListItem
                          sx={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <Typography variant="subtitle1">
                            {`${
                              ArabicDaysMapping[
                                dayName as keyof typeof ArabicDaysMapping
                              ]
                            } ${attendanceDate.format("YYYY/MM/DD")}`}
                          </Typography>
                          <Typography
                            variant="body2"
                            color={
                              attendance.attendance === 0 ? "error" : "success"
                            }
                          >
                            {attendance.attendance === 0 ? "غائب" : "حاضر"}
                          </Typography>
                        </ListItem>
                        {index < selectedPersonAttendance.length - 1 && (
                          <Divider
                            sx={{
                              mr: 6,
                              ml: 2,
                            }}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  لا يوجد بيانات غياب لعرضها.
                </Typography>
              )}
            </Paper>
          </Popover>
        </Paper>
      )}
    </Box>
  );
};

export default AbsencePresentation;
