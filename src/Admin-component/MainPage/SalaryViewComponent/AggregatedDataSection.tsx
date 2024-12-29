import React, { useMemo } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  Stack, 
  useTheme,
  alpha 
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ar } from "date-fns/locale";
import { SalaryData } from "../Statistics-Interfaces";
import { startOfMonth, endOfMonth } from 'date-fns';

interface PeriodStatisticsProps {
  data: SalaryData[] | null;
  personType: string;
}

export const PeriodStatistics: React.FC<PeriodStatisticsProps> = ({
  data,
  personType,
}) => {
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const theme = useTheme();

  const statistics = useMemo(() => {
    if (!data || !startDate || !endDate) return null;

    const periodStart = startOfMonth(startDate);
    const periodEnd = endOfMonth(endDate);

    const filteredData = data.filter((salary) => {
      const salaryDate = new Date(salary.year, salary.month - 1);
      return salaryDate >= periodStart && salaryDate <= periodEnd;
    });

    if (filteredData.length === 0) return null;

    const totalSalary = filteredData.reduce(
      (sum, salary) =>
        sum +
        parseFloat(
          personType === "employee" ? salary.total_salary : salary.doctor_salary
        ),
      0
    );

    const totalWorkDays = filteredData.reduce(
      (sum, salary) => sum + salary.num_worked_days,
      0
    );

    const salaryWithDates = filteredData.map((salary) => ({
      ...salary,
      date: new Date(salary.year, salary.month - 1),
      salaryAmount: parseFloat(
        personType === "employee" ? salary.total_salary : salary.doctor_salary
      ),
    }));

    const highestSalary = salaryWithDates.reduce((max, current) =>
      current.salaryAmount > max.salaryAmount ? current : max
    );

    const lowestSalary = salaryWithDates.reduce((min, current) =>
      current.salaryAmount < min.salaryAmount ? current : min
    );

    const averageSalary = totalSalary / filteredData.length;

    return {
      totalSalary,
      totalWorkDays,
      highestSalary,
      lowestSalary,
      averageSalary,
      periodMonths: filteredData.length,
    };
  }, [data, startDate, endDate, personType]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card
      sx={{
        mt: 3,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[3],
        border: `1px solid ${theme.palette.divider}`,
        transition: theme.transitions.create(['box-shadow']),
        '&:hover': {
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 3,
            borderBottom: `1px solid ${theme.palette.dividerColor.main}`,
            pb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: theme.typography.fontWeightBold,
            }}
          >
            {personType === "employee" ? "إحصائيات فترة معينه للموظف" : "إحصائيات فترة معينه للطبيب"}
            
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              px: 1,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            (اختر فتره معينه للبدأ)
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ar}>
            <DatePicker
              label="تاريخ البداية"
              value={startDate}
              onChange={setStartDate}
              views={["year", "month"]}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.light,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  },
                },
              }}
            />
            <DatePicker
              label="تاريخ النهاية"
              value={endDate}
              onChange={setEndDate}
              views={["year", "month"]}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.light,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Stack>

        {statistics && (
          <Grid
            container
            spacing={{ xs: 1.5, md: 2 }}
            sx={{
              mt: 1,
            }}
          >
            <Grid item xs={12} md={4}>
              <StatCard
                title="إجمالي الراتب"
                value={formatCurrency(statistics.totalSalary)}
                type="primary"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="عدد أيام العمل"
                value={statistics.totalWorkDays.toString()}
                Specification={statistics.totalWorkDays > 10 ? "يوم" : "أيام"}
                type="secondary"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="متوسط الراتب الشهري"
                value={formatCurrency(statistics.averageSalary)}
                type="info"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StatCard
                title="أعلى راتب"
                value={formatCurrency(statistics.highestSalary.salaryAmount)}
                subtitle={`في شهر ${formatDate(statistics.highestSalary.date)}`}
                type="success"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StatCard
                title="أقل راتب"
                value={formatCurrency(statistics.lowestSalary.salaryAmount)}
                subtitle={`في شهر ${formatDate(statistics.lowestSalary.date)}`}
                type="warning"
              />
            </Grid>
          </Grid>
        )}

        {!statistics && startDate && endDate && (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
              borderRadius: 1,
            }}
          >
            <Typography color="text.secondary">
              لا توجد بيانات في الفترة المحددة
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  Specification?: string;
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  Specification,
  type = 'primary'
}) => {
  const theme = useTheme();

  const getBackgroundColor = () => {
    const colors = {
      primary: alpha(theme.palette.primary.main, 0.04),
      secondary: alpha(theme.palette.secondary.main, 0.04),
      success: alpha(theme.palette.success.main, 0.04),
      warning: alpha(theme.palette.warning.main, 0.04),
      info: alpha(theme.palette.info.main, 0.04),
    };
    return colors[type];
  };

  const getValueColor = () => {
    const colors = {
      primary: theme.palette.primary.main,
      secondary: theme.palette.secondary.main,
      success: theme.palette.success.main,
      warning: theme.palette.warning.main,
      info: theme.palette.info.main,
    };
    return colors[type];
  };

  return (
    <Box
      sx={{
        p: 2.5,
        bgcolor: getBackgroundColor(),
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[2],
        transition: theme.transitions.create(['box-shadow', 'transform']),
        border: `1px solid ${alpha(getValueColor(), 0.1)}`,
        '&:hover': {
          boxShadow: theme.shadows[3],
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Typography
        variant="subtitle2"
        color="text.secondary"
        gutterBottom
        sx={{ 
          fontWeight: theme.typography.fontWeightMedium,
          fontSize: '0.875rem',
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="h6"
        component="div"
        sx={{
          color: getValueColor(),
          fontWeight: theme.typography.fontWeightBold,
          my: 1,
        }}
      >
        {value} {Specification}
      </Typography>
      {subtitle && (
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            mt: 0.5,
            fontSize: '0.75rem',
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default PeriodStatistics;