import React, { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { DoneService } from "../ClinicsInterfaces";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type { ECElementEvent } from "echarts";

// Interfaces
interface Service {
  id: number;
  name: string;
}

interface Doctor {
  id: number;
  name: string;
}

interface ClinicStatsDashboardProps {
  doneServices: DoneService[];
  services: Service[];
  doctors: Doctor[];
}

// Helper function to format currency
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
  }).format(value);

const ClinicStatsDashboard: React.FC<ClinicStatsDashboardProps> = ({
  doneServices,
  services,
  doctors,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [view, setView] = useState<"service" | "doctor">("service");
  const currentMonth = new Date();
  const currentMonthBeginning = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const currentMonthEnding = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );
  const [startDate, setStartDate] = useState<Date | null>(currentMonthBeginning);
  const [endDate, setEndDate] = useState<Date | null>(currentMonthEnding);

  // Memoized maps for efficient lookups
  const serviceNameMap = useMemo(
    () =>
      services.reduce((acc, service) => {
        acc[service.id] = service.name;
        return acc;
      }, {} as Record<number, string>),
    [services]
  );

  const doctorNameMap = useMemo(
    () =>
      doctors.reduce((acc, doctor) => {
        acc[doctor.id] = doctor.name;
        return acc;
      }, {} as Record<number, string>),
    [doctors]
  );

  // Filter doneServices based on the selected date range
  const filteredDoneServices = useMemo(() => {
    if (!startDate || !endDate) return doneServices;
    return doneServices.filter((service) => {
      const serviceDate = new Date(service.created_at);
      return serviceDate >= startDate && serviceDate <= endDate;
    });
  }, [doneServices, startDate, endDate]);

  // Aggregate Data
  const aggregatedStats = useMemo(() => {
    const totalRevenue = filteredDoneServices.reduce(
      (sum, service) => sum + parseFloat(service.total_cost),
      0
    );

    const serviceStats = filteredDoneServices.reduce((acc, service) => {
      const name = serviceNameMap[service.service_id] || "غير محدد";
      acc[name] = acc[name] || { count: 0, revenue: 0 };
      acc[name].count += service.count;
      acc[name].revenue += parseFloat(service.total_cost);
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

    const doctorStats = filteredDoneServices.reduce((acc, service) => {
      const name = doctorNameMap[service.doctor_id] || "غير محدد";
      acc[name] = acc[name] || { count: 0, revenue: 0 };
      acc[name].count += service.count;
      acc[name].revenue += parseFloat(service.total_cost);
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

    const mostProfitableService = Object.entries(serviceStats).reduce(
      (max, [name, stats]) =>
        stats.revenue > max.revenue ? { name, ...stats } : max,
      { name: "", count: 0, revenue: 0 }
    );

    const leastProfitableService = Object.entries(serviceStats).reduce(
      (min, [name, stats]) =>
        stats.revenue < min.revenue ? { name, ...stats } : min,
      { name: "", count: 0, revenue: 0 }
    );

    const mostEarningDoctor = Object.entries(doctorStats).reduce(
      (max, [name, stats]) =>
        stats.revenue > max.revenue ? { name, ...stats } : max,
      { name: "", count: 0, revenue: 0 }
    );

    const leastEarningDoctor = Object.entries(doctorStats).reduce(
      (min, [name, stats]) =>
        stats.revenue < min.revenue ? { name, ...stats } : min,
      { name: "", count: 0, revenue: 0 }
    );

    return {
      totalRevenue,
      serviceStats,
      doctorStats,
      mostProfitableService,
      leastProfitableService,
      mostEarningDoctor,
      leastEarningDoctor,
    };
  }, [filteredDoneServices, serviceNameMap, doctorNameMap]);

  // Generate graph options based on current view
  const getGraphOptions = () => {
    let xAxisData: string[] = [];
    let revenueData: number[] = [];
    let countData: number[] = [];

    switch (view) {
      case "service":
        xAxisData = Object.keys(aggregatedStats.serviceStats);
        revenueData = Object.values(aggregatedStats.serviceStats).map(
          (s) => s.revenue
        );
        countData = Object.values(aggregatedStats.serviceStats).map(
          (s) => s.count
        );
        break;
      case "doctor":
      default:
        xAxisData = Object.keys(aggregatedStats.doctorStats);
        revenueData = Object.values(aggregatedStats.doctorStats).map(
          (s) => s.revenue
        );
        countData = Object.values(aggregatedStats.doctorStats).map(
          (s) => s.count
        );
    }

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
          const [revenue, servicesNumber] = params;

          const servicesValue =
            typeof servicesNumber.value === "number" ? servicesNumber.value : 0;

          return `
            <div style="padding: 3px; font-family: 'Zain';">
              <div>${revenue.name}</div>
              <hr/>
              <div style="color: ${theme.palette.primary.main}">
              ${revenue.seriesName}: ${revenue.value} جنيه
              </div>
              <div>
              ${servicesNumber.seriesName}: ${servicesNumber.value} ${
            servicesValue > 10 ? "خدمه" : "خدمات"
          }
              </div>
            </div>
          `;
        },
      },
      legend: {
        data: ["الإيرادات", "عدد الخدمات"],
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: xAxisData,
          axisLabel: {
            rotate: isMobile ? 45 : 0,
            interval: 0,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "الإيرادات",
          axisLabel: {
            formatter: "{value} جنيه",
          },
        },
        {
          type: "value",
          name: "عدد الخدمات",
          axisLabel: {
            formatter: "{value}",
          },
        },
      ],
      series: [
        {
          name: "الإيرادات",
          type: "bar",
          yAxisIndex: 0,
          data: revenueData,
        },
        {
          name: "عدد الخدمات",
          type: "line",
          yAxisIndex: 1,
          data: countData,
        },
      ],
    };
  };

  // Function to reset the date range
  const resetDateRange = () => {
    setStartDate(currentMonthBeginning);
    setEndDate(currentMonthEnding);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Date Pickers */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2, gap: 2 }}>
          <DatePicker
            label="من تاريخ"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
          />
          <DatePicker
            label="إلى تاريخ"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
          />
          <Button variant="outlined" onClick={resetDateRange}>
            إعادة تعيين التاريخ
          </Button>
        </Box>
      </LocalizationProvider>

      {/* View Switcher */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {["service", "doctor"].map((viewType) => (
          <Button
            key={viewType}
            variant={view === viewType ? "contained" : "outlined"}
            onClick={() => setView(viewType as "service" | "doctor")}
            sx={{
              m: 0.5,
              textTransform: "none",
              width: isMobile ? "100%" : "auto",
            }}
          >
            {viewType === "service"
              ? "بناءً على الخدمات"
              : "بناءً على الأطباء"}
          </Button>
        ))}
      </Box>

      {/* Graph */}
      <Box sx={{ height: 400, width: "100%" }}>
        <ReactECharts
          option={getGraphOptions()}
          style={{ height: "100%", width: "100%" }}
        />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mt: 3 }}>
        {/* Total Revenue Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                الإيرادات الكلية
              </Typography>
              <Typography variant="h4" color="primary">
                {formatCurrency(aggregatedStats.totalRevenue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Most Profitable Service Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                الخدمة الأكثر ربحاً
              </Typography>
              <Typography variant="body1">
                <strong>{aggregatedStats.mostProfitableService.name}</strong>
              </Typography>
              <Typography variant="h6" color="success.main">
                {formatCurrency(aggregatedStats.mostProfitableService.revenue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Most Earning Doctor Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                الطبيب الأعلى دخلاً
              </Typography>
              <Typography variant="body1">
                <strong>{aggregatedStats.mostEarningDoctor.name}</strong>
              </Typography>
              <Typography variant="h6" color="success.main">
                {formatCurrency(aggregatedStats.mostEarningDoctor.revenue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Most Popular Service Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                الخدمة الأكثر شعبية
              </Typography>
              <Typography variant="body1">
                <strong>
                  {
                    Object.entries(aggregatedStats.serviceStats).reduce(
                      (max, [name, stats]) =>
                        stats.count > max.count ? { name, ...stats } : max,
                      { name: "", count: 0, revenue: 0 }
                    ).name
                  }
                </strong>
              </Typography>
              <Typography variant="h6" color="primary">
                عدد الخدمات: {" "}
                {
                  Object.entries(aggregatedStats.serviceStats).reduce(
                    (max, [name, stats]) =>
                      stats.count > max.count ? { name, ...stats } : max,
                    { name: "", count: 0, revenue: 0 }
                  ).count
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClinicStatsDashboard;
