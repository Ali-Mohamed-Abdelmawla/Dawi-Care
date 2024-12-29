import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  useTheme,
  Card,
  CardContent,
  Stack,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ReactECharts from "echarts-for-react";
import { SalaryData, PersonType } from "../Statistics-Interfaces";
import type { ECElementEvent } from "echarts";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { isWithinInterval, startOfMonth, endOfMonth, parseISO } from "date-fns";

interface GeneralStatisticsProps {
  allSalariesData: SalaryData[];
  people: PersonType[];
}

interface StatCardProps {
  title: string;
  value: number;
  suffix: string;
}

const GeneralStatistics: React.FC<GeneralStatisticsProps> = ({
  allSalariesData,
  people,
}) => {
  const theme = useTheme();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  const handleStartDateChange = (newDate: Date | null) => {
    setDateError(null);
    setStartDate(newDate);
  };

  const handleEndDateChange = (newDate: Date | null) => {
    setDateError(null);
    setEndDate(newDate);
  };

  // Filter salaries based on date range and doctors
  const filteredSalaries = useMemo(() => {
    let filtered = allSalariesData.filter(
      (salary) => salary.doctor_id !== null
    );

    if (startDate && endDate) {
      // Check if end date is before start date
      if (endDate < startDate) {
        setDateError("تاريخ النهاية يجب أن يكون بعد تاريخ البداية");
        return []; // Return empty array if dates are invalid
      }
      filtered = filtered.filter((salary) => {
        const salaryDate = parseISO(salary.created_at);
        return isWithinInterval(salaryDate, {
          start: startOfMonth(startDate),
          end: endOfMonth(endDate),
        });
      });
    }
    return filtered;
  }, [allSalariesData, startDate, endDate]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalProfit = filteredSalaries.reduce(
      (acc, curr) => acc + parseFloat(curr.total_salary),
      0
    );
    const totalPaidForDoctors = filteredSalaries.reduce(
      (acc, curr) => acc + parseFloat(curr.doctor_salary),
      0
    );
    const clinicBalance = filteredSalaries.reduce(
      (acc, curr) => acc + parseFloat(curr.clinic_salary || "0"),
      0
    );
    const profitableMonths = filteredSalaries.filter(
      (salary) => parseFloat(salary.clinic_salary || "0") > 0
    ).length;
    const lossMonths = filteredSalaries.filter(
      (salary) => parseFloat(salary.clinic_salary || "0") < 0
    ).length;

    return {
      totalProfit,
      totalPaidForDoctors,
      clinicBalance,
      profitableMonths,
      lossMonths,
    };
  }, [filteredSalaries]);

  // Prepare data for doctor performance chart
  const doctorPerformanceOptions = useMemo(() => {
    const doctorData = filteredSalaries.reduce(
      (acc, salary) => {
        const doctor = people.find((person) => person.id === salary.doctor_id);
        const existingDoctor = acc.find(
          (d) => d.name === (doctor?.name || "Unknown")
        );

        if (existingDoctor) {
          existingDoctor.salary += parseFloat(salary.doctor_salary);
          existingDoctor.profit += parseFloat(salary.total_salary);
          existingDoctor.clinicBalance += parseFloat(
            salary.clinic_salary || "0"
          );
          existingDoctor.workDays += salary.num_worked_days;
        } else {
          acc.push({
            name: doctor?.name || "Unknown",
            salary: parseFloat(salary.doctor_salary),
            profit: parseFloat(salary.total_salary),
            clinicBalance: parseFloat(salary.clinic_salary || "0"),
            workDays: salary.num_worked_days,
          });
        }
        return acc;
      },
      [] as Array<{
        name: string;
        salary: number;
        profit: number;
        clinicBalance: number;
        workDays: number;
      }>
    );

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        borderRadius: theme.shape.borderRadius,
        textStyle: {
          color: theme.palette.text.primary,
        },
        formatter: (params: ECElementEvent[]) => {
          const visibleParams = params.filter(
            (param) =>
              !param.componentSubType ||
              param.componentSubType === "line" ||
              param.data !== "-"
          );

          const header = `<div style="margin-bottom: 4px">${params[0].name}</div><hr/>`;

          const rows = visibleParams
            .map((param) => {
              let color;
              switch (param.seriesName) {
                case "راتب الطبيب":
                  color = theme.palette.primary.main;
                  break;
                case "ربح/خسارة العيادة":
                  if (param.value == null || typeof param.value !== "number") {
                    color = theme.palette.warning.main;
                  } else {
                    color =
                      param.value >= 0
                        ? theme.palette.success.main
                        : theme.palette.error.main;
                  }
                  break;
                case "العائد من كشوفات الطبيب":
                  color = "#40E0D0"; // turquoise
                  break;
                case "أيام العمل":
                  color = theme.palette.info.main;
                  break;
                default:
                  color = param.color;
              }

              return `<div style="color: ${color}">
                ${param.seriesName}: ${
                typeof param.value === "number"
                  ? param.value.toLocaleString()
                  : param.value
              } 
                ${param.seriesName !== "أيام العمل" ? "EGP" : ""}
              </div>`;
            })
            .join("");

          return `<div style="padding: 3px; font-family: 'Zain';">
            ${header}
            ${rows}
          </div>`;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
      legend: {
        data: [
          "راتب الطبيب",
          "ربح/خسارة العيادة",
          "العائد من كشوفات الطبيب",
          "أيام العمل",
        ],
        bottom: 0,
        selectedMode: true,
        selected: {
          "راتب الطبيب": true,
          "ربح/خسارة العيادة": true,
          "العائد من كشوفات الطبيب": true,
          "أيام العمل": true,
        },
      },
      dataZoom: [
        {
          type: "slider",
          show: doctorData.length > 6,
          xAxisIndex: 0,
          start: 0,
          end: doctorData.length <= 6 ? 100 : (6 / doctorData.length) * 100,
        },
        {
          type: "inside",
          xAxisIndex: 0,
          start: 0,
          end: doctorData.length <= 6 ? 100 : (6 / doctorData.length) * 100,
        },
      ],
      xAxis: {
        type: "category",
        data: doctorData.map((d) => d.name),
        axisLabel: {
          interval: 0,
          fontSize: 15,
          rotate: doctorData.length > 6 ? 45 : 0,
        },
      },
      yAxis: [
        {
          type: "value",
          name: "المبلغ",
          axisLabel: {
            formatter: "{value} EGP",
          },
        },
        {
          type: "value",
          name: "أيام العمل",
          minInterval: 1,
        },
      ],
      series: [
        {
          name: "راتب الطبيب",
          type: "bar",
          data: doctorData.map((d) => d.salary),
          itemStyle: {
            color: theme.palette.primary.main,
          },
          emphasis: {
            focus: "series",
          },
        },
        {
          name: "ربح/خسارة العيادة",
          type: "bar",
          data: doctorData.map((d) => d.clinicBalance),
          itemStyle: {
            color: function (params: ECElementEvent) {
              const value = params.value;
              if (typeof value === "number") {
                return value >= 0
                  ? theme.palette.success.main
                  : theme.palette.error.main;
              }
              return theme.palette.grey[500];
            },
          },
          emphasis: {
            focus: "series",
          },
        },
        {
          name: "العائد من كشوفات الطبيب",
          type: "bar",
          data: doctorData.map((d) => d.profit),
          itemStyle: {
            color: "#40E0D0", // turquoise
          },
          emphasis: {
            focus: "series",
          },
        },
        {
          name: "أيام العمل",
          type: "line",
          yAxisIndex: 1,
          data: doctorData.map((d) => d.workDays),
          itemStyle: {
            color: theme.palette.info.main,
          },
          emphasis: {
            focus: "series",
          },
        },
      ],
    };
  }, [filteredSalaries, people, theme]);

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setDateError(null);
  };

  const StatCard: React.FC<StatCardProps> = ({ title, value, suffix = "" }) => (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.dividerColor.main}`,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" sx={{ mt: 2 }}>
          {typeof value === "number" ? value.toLocaleString() : value}
          {suffix && (
            <Typography component="span" variant="h6" color="text.secondary">
              {" "}
              {suffix}
            </Typography>
          )}
        </Typography>
      </CardContent>
    </Card>
  );

  const datePickerSx = {
    minWidth: 200,
    "& .MuiInputLabel-root": {
      color: theme.palette.text.secondary,
    },
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
  };

  return (
    <Box className="p-4">
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", md: "center" }}
        sx={{ mb: 4 }}
      >
        <Typography variant="h4" sx={{ mb: { xs: 2, md: 0 } }}>
          احصائيات عامة عن العيادات
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
          >
            <DatePicker
              label="تاريخ البداية"
              value={startDate}
              onChange={handleStartDateChange}
              views={["year", "month"]}
              sx={datePickerSx}
              slotProps={{
                textField: {
                  helperText: dateError,
                  error: !!dateError,
                },
              }}
            />
            <DatePicker
              label="تاريخ النهاية"
              value={endDate}
              onChange={handleEndDateChange}
              views={["year", "month"]}
              sx={datePickerSx}
              slotProps={{
                textField: {
                  helperText: dateError,
                  error: !!dateError,
                },
              }}
            />
            <IconButton
              onClick={handleReset}
              color="primary"
              sx={{
                border: `1px solid ${theme.palette.primary.main}`,
                "&:hover": {
                  backgroundColor: theme.palette.primary.main + "1A",
                },
              }}
              title="إعادة تعيين التواريخ"
            >
              <RestartAltIcon />
            </IconButton>
          </Stack>
        </LocalizationProvider>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="إجمالي العائد من كشوفات العيادة"
            value={stats.totalProfit}
            suffix="EGP"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="صافي ربح/خسارة من العيادات"
            value={stats.clinicBalance}
            suffix="EGP"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="إجمالي الراتب المدفوع للأطباء"
            value={stats.totalPaidForDoctors}
            suffix="EGP"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatCard
            title="عدد الأشهر الرابحة"
            value={stats.profitableMonths}
            suffix={stats.profitableMonths > 10 ? "شهر" : "أشهر"}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatCard
            title="عدد الأشهر الخاسرة"
            value={stats.lossMonths}
            suffix={stats.lossMonths > 10 ? "شهر" : "أشهر"}
          />
        </Grid>
      </Grid>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h6" gutterBottom>
          مقارنة أداء الأطباء
        </Typography>
        <ReactECharts
          option={doctorPerformanceOptions}
          style={{ height: "400px" }}
        />
      </Paper>
    </Box>
  );
};
export default GeneralStatistics;

// const generateLargeDataset = () => {
//     const allSalariesData = [];
//     const people = [];

//     const NUM_PEOPLE = 100; // Number of people
//     const NUM_SALARIES = 100; // Number of salary entries

//     // Generate random date between two dates
//     const getRandomDate = (start, end) => {
//         const startDate = new Date(start).getTime();
//         const endDate = new Date(end).getTime();
//         return new Date(startDate + Math.random() * (endDate - startDate));
//     };

//     // Generate mock people data
//     for (let i = 1; i <= NUM_PEOPLE; i++) {
//         people.push({
//             id: i,
//             name: `Doctor ${i}`,
//             national_id: `1234567890${i}`,
//             phone_number: `0101234567${i % 10}`,
//             profile_photo: '',
//             union_registration: `REG${i}`,
//             scientific_degree: 'MD',
//             hire_date: `2020-01-${(i % 31) + 1}`,
//             fixed_salary: Math.random() * 50000,
//             total_salary: Math.random() * 60000,
//             working_hours: {},
//             week_days: [],
//             working_days: [],
//             clinic: {},
//             clinic_id: { value: `${i}`, label: `Clinic ${i}` },
//             doctor_share: Math.random() * 100
//         });
//     }

//     // Generate mock salary data
//     for (let i = 1; i <= NUM_SALARIES; i++) {
//         const doctorId = (i % NUM_PEOPLE) + 1;
//         allSalariesData.push({
//             id: i,
//             doctor_id: doctorId,
//             employee_id: null,
//             total_salary: (Math.random() * 100000).toFixed(2),
//             num_worked_days: Math.floor(Math.random() * 30) + 1,
//             custom_deduction: (Math.random() * 5000).toFixed(2),
//             month: (i % 12) + 1,
//             year: 2020 + Math.floor(i / 120),
//             created_at: getRandomDate('2022-01-01', '2024-12-31').toISOString(),
//             updated_at: new Date().toISOString(),
//             is_payed: Math.random() > 0.5 ? 1 : 0,
//             doctor_salary: (Math.random() * 70000).toFixed(2),
//             clinic_salary: (Math.random() * 5000 - 2500).toFixed(2) // Profit or loss
//         });
//     }

//     return { allSalariesData, people };
// };
