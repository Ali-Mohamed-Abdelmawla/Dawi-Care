import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Grid,
  Chip,
  MenuItem,
  Select,
  SelectChangeEvent,
  Pagination
} from '@mui/material';
import { Minus, ArrowUpDown } from 'lucide-react';

export interface Deduction {
  id: number;
  deduction: string;
  description: string;
  salary_id: number;
  created_at: string;
  updated_at: string;
}

interface DeductionsListCardProps {
  deductions: Deduction[];
}

export const DeductionsListCard: React.FC<DeductionsListCardProps> = ({ deductions }) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Extract unique years and months
  const { availableYears, availableMonths } = useMemo(() => {
    const years = new Set<string>();
    const months = new Set<string>();
    years.add('all');
    months.add('all');
    deductions.forEach(deduction => {
      const date = new Date(deduction.created_at);
      years.add(String(date.getFullYear()));
      months.add(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
    });
    return {
      availableYears: Array.from(years).sort().reverse(),
      availableMonths: Array.from(months).sort().reverse(),
    };
  }, [deductions]);

  // Filter and sort deductions
  const processedDeductions = useMemo(() => {
    return deductions
      .filter(deduction => {
        const deductionDate = new Date(deduction.created_at);
        const year = String(deductionDate.getFullYear());
        const month = `${year}-${String(deductionDate.getMonth() + 1).padStart(2, '0')}`;
        return (selectedYear === 'all' || year === selectedYear) &&
               (selectedMonth === 'all' || month === selectedMonth);
      })
      .sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [deductions, sortOrder, selectedYear, selectedMonth]);

  const itemsPerPage = 6;
  const pageCount = Math.ceil(processedDeductions.length / itemsPerPage);
  const paginatedDeductions = processedDeductions.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const totalDeductions = processedDeductions.reduce((sum, deduction) => 
    sum + parseFloat(deduction.deduction), 0);

  const handleSortOrderChange = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleYearChange = (event: SelectChangeEvent<string>) => {
    setSelectedYear(event.target.value);
    setSelectedMonth('all');
    setCurrentPage(1);
  };

  const handleMonthChange = (event: SelectChangeEvent<string>) => {
    setSelectedMonth(event.target.value);
    setCurrentPage(1);
  };

  return (
    <Card sx={{ width: '100%', boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" color="primary">الخصومات</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Select
              value={selectedYear}
              onChange={handleYearChange}
              sx={{ minWidth: 120 }}
            >
              {availableYears.map(year => (
                <MenuItem key={year} value={year}>
                  {year === 'all' ? 'جميع السنوات' : year}
                </MenuItem>
              ))}
            </Select>
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              sx={{ minWidth: 120 }}
              disabled={selectedYear === 'all'}
            >
              {availableMonths
                .filter(month => month.startsWith(selectedYear) || month === 'all')
                .map(month => (
                  <MenuItem key={month} value={month}>
                    {month === 'all' ? 'جميع الشهور' : month}
                  </MenuItem>
              ))}
            </Select>
            <Chip
              icon={<ArrowUpDown />}
              label={sortOrder === 'asc' ? 'تصاعدي' : 'تنازلي'}
              onClick={handleSortOrderChange}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<Minus />}
              label={`إجمالي الخصومات: ${totalDeductions.toFixed(2)} ج.م`}
              color="error"
              variant="outlined"
            />
          </Box>
        </Box>
        {processedDeductions.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center">لا توجد خصومات</Typography>
        ) : (
          <>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {paginatedDeductions.map(deduction => (
                <Grid item xs={12} sm={6} key={deduction.id}>
                  <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
                    <Typography variant="h6" color="error" sx={{ mb: 1 }}>
                      {deduction.deduction} ج.م
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 1, wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                      {deduction.description}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ alignSelf: 'flex-end' }}>
                      {new Date(deduction.created_at).toLocaleDateString('ar-EG')}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination
                count={pageCount}
                page={currentPage}
                onChange={(_, value) => setCurrentPage(value)}
                color="primary"
                variant="outlined"
                shape="rounded"
              />
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};
