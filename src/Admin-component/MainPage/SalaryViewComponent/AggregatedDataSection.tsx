import React, { useMemo } from 'react';
import { 
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ar } from 'date-fns/locale';
import { SalaryData } from '../Statistics-Interfaces';

interface PeriodStatisticsProps {
  data: SalaryData[] | null;
}

export const PeriodStatistics: React.FC<PeriodStatisticsProps> = ({ data }) => {
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  const statistics = useMemo(() => {
    if (!data || !startDate || !endDate) return null;

    const filteredData = data.filter(salary => {
      const salaryDate = new Date(salary.year, salary.month - 1);
      return salaryDate >= startDate && salaryDate <= endDate;
    });

    if (filteredData.length === 0) return null;

    const totalSalary = filteredData.reduce(
      (sum, salary) => sum + parseFloat(salary.total_salary),
      0
    );

    const totalWorkDays = filteredData.reduce(
      (sum, salary) => sum + salary.num_worked_days,
      0
    );

    const salaryWithDates = filteredData.map(salary => ({
      ...salary,
      date: new Date(salary.year, salary.month - 1),
      salaryAmount: parseFloat(salary.total_salary)
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
      periodMonths: filteredData.length
    };
  }, [data, startDate, endDate]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-EG', { 
      year: 'numeric', 
      month: 'long' 
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6">إحصائيات فترة معينه</Typography>
          <Typography variant="caption" color="text.secondary">
            (اختر فتره معينه للبدأ)
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ar}>
            <DatePicker
            label="تاريخ البداية"
            value={startDate}
            onChange={setStartDate}
            views={['year', 'month']}
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
            <DatePicker
            label="تاريخ النهاية"
            value={endDate}
            onChange={setEndDate}
            views={['year', 'month']}
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
          </LocalizationProvider>
        </Stack>

        {statistics && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <StatCard
                title="إجمالي الراتب"
                value={formatCurrency(statistics.totalSalary)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="عدد أيام العمل"
                value={statistics.totalWorkDays.toString()}
                subtitle="يوم"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="متوسط الراتب الشهري"
                value={formatCurrency(statistics.averageSalary)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StatCard
                title="أعلى راتب"
                value={formatCurrency(statistics.highestSalary.salaryAmount)}
                subtitle={`في شهر ${formatDate(statistics.highestSalary.date)}`}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StatCard
                title="أقل راتب"
                value={formatCurrency(statistics.lowestSalary.salaryAmount)}
                subtitle={`في شهر ${formatDate(statistics.lowestSalary.date)}`}
              />
            </Grid>
          </Grid>
        )}

        {!statistics && startDate && endDate && (
          <Typography color="text.secondary" textAlign="center">
            لا توجد بيانات في الفترة المحددة
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle }) => (
  <Box
    sx={{
      p: 2,
      bgcolor: 'background.paper',
      borderRadius: 1,
      boxShadow: 1,
    }}
  >
    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h6" component="div">
      {value}
    </Typography>
    {subtitle && (
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    )}
  </Box>
);