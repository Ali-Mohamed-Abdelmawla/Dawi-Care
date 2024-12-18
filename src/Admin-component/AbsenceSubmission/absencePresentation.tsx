import React, { useState } from "react";
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
} from "@mui/material";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from '../../dateConfig';
import { AbsencePresentationProps, SwapDayFormData } from "./AbsenceInterfaces";
import PersonSelect from "../../helper/personSelect/personSelect";
import TwoColumnDaysUI from "./TwoColumnDaysUI";
import SwapDayModal from "./SwapDayModal";

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

  const isDateDisabled = (date: dayjs.Dayjs) => {
    if (!selectedPerson || !selectedPerson.weekDays) {
      return true;
    }

    const dayOfWeek = date.day();
    const allowedDays = selectedPerson.weekDays
      .filter((day) => day.day !== null)
      .map((day) => {
        const daysMap: { [key: string]: number } = {
          الأحد: 0,
          الاثنين: 1,
          الثلاثاء: 2,
          الأربعاء: 3,
          الخميس: 4,
          الجمعة: 5,
          السبت: 6,
        };

        const dayName = day.day as string;
        return daysMap[dayName];
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

  // const handleAttendanceListClick = (
  //   event: React.MouseEvent<HTMLButtonElement>
  // ) => {
  //   setAnchorEl(event.currentTarget);
  // };

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
    console.log(data);
    handleSwapDaySubmit(data);
    handleCloseSwapDayModal();
  };

  const handleTwoDayColumnsClick = () => {
    setShowSwitchedDays(!showSwitchedDays);
  };

  return (
    <Box sx={{ p: 3 }}>
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
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
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

          <SwapDayModal
            isOpen={isSwapDayModalOpen}
            onClose={handleCloseSwapDayModal}
            onSubmit={onSubmit}
            personAttendance={selectedPersonAttendance}
          />

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
              <Tooltip title="عرض الأيام المبدله">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleTwoDayColumnsClick}
                  sx={{ mr: 1 }}
                >
                  عرض الأيام المبدله
                </Button>
              </Tooltip>
              {/* <Tooltip title="عرض قائمة الغياب">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleAttendanceListClick}
                >
                  قائمة الغياب
                </Button>
              </Tooltip> */}
            </Grid>
          </Grid>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ar">
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
              slotProps={{
                day: (props) => ({
                  selected: selectedDate?.isSame(props.day, "day") ?? false,
                }),
              }}
              sx={{ width: "100%", mt: 2 }}
            />
          </LocalizationProvider>

          {selectedDate && (
            <Box sx={{ mt: 2 }}>
              {isDateAbsent(selectedDate) ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    updateAbsenceStatus(selectedDate.toDate(), selectedPerson)
                  }
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
                >
                  وضع علامة كغائب
                </Button>
              )}
            </Box>
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
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <Paper
              sx={{ p: 2, maxWidth: 350, maxHeight: 300, overflow: "auto" }}
            >
              <Typography variant="h6" gutterBottom>
                قائمة الغياب
              </Typography>
              {selectedPersonAttendance &&
              selectedPersonAttendance.length > 0 ? (
                <List>
                  {selectedPersonAttendance.map((attendance, index) => {
                    const attendanceDate = dayjs(attendance.date);
                    const dayName = attendanceDate.locale("ar").format("dddd");
                    return (
                      <React.Fragment key={index}>
                        <ListItem>
                          <Box>
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
                                attendance.attendance === 0
                                  ? "error"
                                  : "success"
                              }
                            >
                              {attendance.attendance === 0 ? "غائب" : "حاضر"}
                            </Typography>
                          </Box>
                        </ListItem>
                        {index < selectedPersonAttendance.length - 1 && (
                          <Divider />
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