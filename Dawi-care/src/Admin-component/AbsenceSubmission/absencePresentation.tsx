import React, { useState, useEffect } from "react";
import {
  Tab,
  Tabs,
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tooltip,
  Popover,
  Grid,
} from "@mui/material";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import Select from "react-select";
import { GroupBase, OptionsOrGroups } from "react-select";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/ar";

dayjs.locale("ar");
import {
  DoctorOption,
  EmployeeOption,
  AbsencePresentationProps,
} from "./AbsenceInterfaces";
import PersonSelect from "./personSelect";
import theme from "../../Apptheme";

const AbsencePresentation: React.FC<AbsencePresentationProps> = ({
  doctors,
  employees,
  handleMarkAsAbsent,
  getAttendanceByDoctorID,
  selectedDoctorAttendance,
  updateAbsenceStatus,
}) => {
  const [selectedPerson, setSelectedPerson] = useState<
    DoctorOption | EmployeeOption | null
  >(null);
  const [attendanceListFilterValue, setAttendanceListFilterValue] =
    useState<string>("");
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log("handleTabChange", event, newValue);
    setTabIndex(newValue);
    setSelectedPerson(null);
    setSelectedDate(null);
  };

  const groupedDoctorOptions: Record<string, DoctorOption[]> =
    doctors?.reduce((acc, doctor) => {
      const specialty = doctor.specialty;
      if (!acc[specialty]) {
        acc[specialty] = [];
      }
      acc[specialty].push({
        value: doctor.id,
        label: doctor.name,
        weekDays: doctor.week_days,
      });
      return acc;
    }, {} as Record<string, DoctorOption[]>) ?? {};

  const groupedEmployeeOptions: Record<string, EmployeeOption[]> =
    employees?.reduce((acc, employee) => {
      const description = employee.description;
      if (!acc[description]) {
        acc[description] = [];
      }
      acc[description].push({
        value: employee.id,
        label: employee.name,
        weekDays: employee.emlpoyee_week_day,
      });
      return acc;
    }, {} as Record<string, EmployeeOption[]>) ?? {};

  const doctorSelectOptions: OptionsOrGroups<
    DoctorOption,
    GroupBase<DoctorOption>
  > = Object.entries(groupedDoctorOptions).map(([specialty, doctors]) => ({
    label: specialty,
    options: doctors,
  }));

  const employeeSelectOptions: OptionsOrGroups<
    EmployeeOption,
    GroupBase<EmployeeOption>
  > = Object.entries(groupedEmployeeOptions).map(
    ([description, employees]) => ({
      label: description,
      options: employees,
    })
  );

  const handlePersonChange = async (
    selectedOption: DoctorOption | EmployeeOption | null
  ) => {
    setSelectedPerson(selectedOption);
    setSelectedDate(null);
    if (selectedOption) {
      await getAttendanceByDoctorID(
        selectedOption.value,
        tabIndex === 0 ? "doctor" : "employee"
      );
    }
  };

  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    console.log("Selected Person:", selectedPerson);
  }, [selectedPerson]);

  const isDateDisabled = (date: dayjs.Dayjs) => {
    if (!selectedPerson || !selectedPerson.weekDays) {
      console.log(
        `Date: ${date.format(
          "YYYY-MM-DD"
        )}, Disabled: true (no selected person or weekDays)`
      );
      return true;
    }

    const dayOfWeek = date.day();
    const allowedDays = selectedPerson.weekDays.map((day) => {
      switch (day.day) {
        case "الأحد":
          return 0;
        case "الاثنين":
          return 1;
        case "الثلاثاء":
          return 2;
        case "الأربعاء":
          return 3;
        case "الخميس":
          return 4;
        case "الجمعة":
          return 5;
        case "السبت":
          return 6;
        default:
          return -1;
      }
    });

    const isDisabled = !allowedDays.includes(dayOfWeek);
    // console.log(
    //   `Date: ${date.format(
    //     "YYYY-MM-DD"
    //   )}, Day of week: ${dayOfWeek}, Allowed days: ${allowedDays.join(
    //     ", "
    //   )}, Disabled: ${isDisabled}`
    // );
    return isDisabled;
  };

  const isDateAbsent = (date: dayjs.Dayjs) => {
    return selectedDoctorAttendance?.some(
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

  const handleAttendanceListFilter = (filterValue: object) => {
    console.log("handleAttendanceListFilter", filterValue);
    setAttendanceListFilterValue(filterValue.label);
  };

  const open = Boolean(anchorEl);
  const id = open ? "attendance-popover" : undefined;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="absence tabs"
          indicatorColor="secondary"
        >
          <Tab sx={{ borderRadius: "10px" }} label="طبيب" />
          <Tab label="موظف" />
        </Tabs>
      </Box>
      <Typography variant="h5" gutterBottom>
        {tabIndex === 0 ? "اختر طبيبًا" : "اختر موظفًا"}
      </Typography>
      <PersonSelect
        options={tabIndex === 0 ? doctorSelectOptions : employeeSelectOptions}
        placeholder={tabIndex === 0 ? "اختر طبيبًا..." : "اختر موظفًا..."}
        onChange={handlePersonChange}
        value={selectedPerson}
      />

      {selectedPerson && (
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            ايام عمل {tabIndex === 0 ? "الدكتور" : "الموظف"}{" "}
            {selectedPerson.label}
          </Typography>
          {selectedPerson.weekDays && selectedPerson.weekDays.length > 0 ? (
            <List>
              {selectedPerson.weekDays.map((day, index) => (
                <React.Fragment key={day.id}>
                  <ListItem>
                    <ListItemText
                      primary={day.day}
                      secondary={
                        tabIndex === 0 ? `الوقت: ${formatTime(day.date)}` : null
                      }
                    />
                  </ListItem>
                  {index < selectedPerson.weekDays.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography>
              لم يتم جدولة أيام عمل لهذا {tabIndex === 0 ? "الطبيب" : "الموظف"}.
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
                    updateAbsenceStatus(
                      selectedDate.toDate(),
                      selectedPerson,
                      tabIndex === 0 ? "doctor" : "employee"
                    )
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
                    handleMarkAsAbsent(
                      selectedDate.toDate(),
                      selectedPerson,
                      tabIndex === 0 ? "doctor" : "employee"
                    )
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
              <Select
                placeholder="اختر يوما..."
                options={[
                  { value: "all", label: "كل الأيام" },
                  ...selectedPerson.weekDays.map((day) => ({
                    value: day.id,
                    label: day.day,
                  })),
                ]}
                onChange={handleAttendanceListFilter}
                value={
                  attendanceListFilterValue
                    ? {
                        value:
                          attendanceListFilterValue === "كل الأيام"
                            ? "all"
                            : "",
                        label: attendanceListFilterValue,
                      }
                    : null
                }
              />

              {selectedDoctorAttendance &&
              selectedDoctorAttendance.length > 0 ? (
                <List sx={{ maxHeight: 300, width: 350, overflowY: "auto" }}>
                  {selectedDoctorAttendance
                    .filter((attendance) => {
                      if (
                        !attendanceListFilterValue ||
                        attendanceListFilterValue === "كل الأيام"
                      )
                        return true;
                      const attendanceDate = dayjs(attendance.date);
                      const dayName = attendanceDate
                        .locale("ar")
                        .format("dddd");
                      return dayName === attendanceListFilterValue;
                    })
                    .map((attendance, index) => {
                      const attendanceDate = dayjs(attendance.date);
                      const dayName = attendanceDate
                        .locale("ar")
                        .format("dddd");
                      return (
                        <React.Fragment key={index}>
                          <ListItem
                            sx={{
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <Typography variant="subtitle1">
                              {`${dayName} ${attendanceDate.format(
                                "YYYY/MM/DD"
                              )}`}
                            </Typography>
                            <Typography
                              variant="body2"
                              color={
                                attendance.attendance === 0
                                  ? "error"
                                  : "success"
                              }
                            >
                              {attendance.attendance === 0 ? "غائب" : "حاضر"}
                            </Typography>
                          </ListItem>
                          {index < selectedDoctorAttendance.length - 1 && (
                            <Divider sx={{ mr: 6, ml: 2 }} />
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
