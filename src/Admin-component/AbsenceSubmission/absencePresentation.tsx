import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Tooltip,
  Grid,
  Button,
} from "@mui/material";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "../../dateConfig";
import {
  AbsencePresentationProps,
  SwapDayFormData,
  Doctor,
  Employee,
} from "./AbsenceInterfaces";
import { PeopleGrid } from "./absencePersonCard";
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
  people,
  onClearSelection,
  loading,
}) => {
  const [showSwitchedDays, setShowSwitchedDays] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
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

  useEffect(() => {
    console.log("Attendance Data:", selectedPersonAttendance)
}, [selectedPersonAttendance])

  const isDateAbsent = (date: dayjs.Dayjs) => {
    return selectedPersonAttendance?.some(
      (attendance) =>
        dayjs(attendance.created_at).format("YYYY-MM-DD") === date.format("YYYY-MM-DD") &&
        attendance.attedance === 0
    );
  };

  const isDatePresent = (date: dayjs.Dayjs) => {
    return selectedPersonAttendance?.some(
      (attendance) =>
        dayjs(attendance.created_at).format("YYYY-MM-DD") === date.format("YYYY-MM-DD") &&
        attendance.attedance === 1
    );
  };

  const CustomPickersDay = (props: PickersDayProps<dayjs.Dayjs>) => {
    const { day, ...other } = props;
    const isAbsent = isDateAbsent(day);
    const isPresent = isDatePresent(day);
  
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
          ...(isPresent && {
            backgroundColor: "success.light",
            color: "white",
            "&:hover": {
              backgroundColor: "darkgreen",
            },
          }),
        }}
      />
    );
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
          {!selectedPerson && (
            <PeopleGrid
              people={people}
              personType={personType}
              onPersonSelect={(selectedPerson) =>
                onPersonChange({
                  value: selectedPerson.id,
                  label: selectedPerson.name,
                  weekDays:
                    personType === "doctor"
                      ? (selectedPerson as Doctor).week_days
                      : (selectedPerson as Employee).weekdays,
                })
              }
              selectedPerson={selectedPerson}
              loading={loading}
            />
          )}
        </Grid>
      </Grid>

      {selectedPerson && (
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography variant="h6" gutterBottom>
              ايام عمل {personType === "doctor" ? "الدكتور" : "الموظف"}{" "}
              {selectedPerson.label}
            </Typography>
            {selectedPerson && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={onClearSelection}
                sx={{ ml: 2 }}
              >
                {personType === "doctor"
                  ? "إعادة اختيار طبيب"
                  : "إعادة اختيار موظف"}
              </Button>
            )}
          </Box>
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
              sx={{ width: "100%", mt: 2,    '& .MuiPickersDay-root': {  // This targets all PickersDays
                borderRadius: '8px',  // or any value you want
              } }}
            />
          </LocalizationProvider>

          {selectedDate && (
            <Box sx={{ mt: 2 }}>
              {isDateAbsent(selectedDate) ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    updateAbsenceStatus(selectedDate.toDate(), selectedPerson,selectedPersonAttendance)
                  }
                >
                  تعديل حالة الغياب
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() =>
                    handleMarkAsAbsent(selectedDate.toDate(), selectedPerson,selectedPersonAttendance)
                  }
                >
                  وضع علامة كغائب
                </Button>
              )}
            </Box>
          )}

        </Paper>
      )}
    </Box>
  );
};

export default AbsencePresentation;
