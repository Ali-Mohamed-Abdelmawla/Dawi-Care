import React, { useState, useMemo, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { SalaryData } from "./Statistics-Interfaces";
import { useSalaryData } from "./SalaryViewComponent/useSalaryData";
import { CurrentMonthCard } from "./SalaryViewComponent/CurrentMonthCard";
import { SalaryChart } from "./SalaryViewComponent/SalaryChart";
import useStatisticsApi from "./useStatisticsApi";
import { SalaryInfoCard } from "./SalaryViewComponent/SalaryInfoCard";
import { MonthYearSelector } from "./SalaryViewComponent/MonthYearSelector";
import { DeductionsListCard } from "./SalaryViewComponent/DeductionsListCard";
import { Deduction } from "./SalaryViewComponent/DeductionsListCard";
import { PeriodStatistics } from "./SalaryViewComponent/AggregatedDataSection";

interface SalaryViewProps {
  data: SalaryData[] | null;
  onDataUpdate?: (newData: SalaryData) => void;
  personType: string;
}

export const SalaryView: React.FC<SalaryViewProps> = ({
  data,
  onDataUpdate,
  personType,
}) => {
  const { totalSalaryEquation, markAsPaid, showDeductionBySalaryId } = useStatisticsApi();
  const [isCalculating, setIsCalculating] = useState<number | null>(null);
  const [deductions, setDeductions] = useState<Deduction[] | null>(null);

  const { availableYears, availableMonths, initialYear, initialMonth } = useMemo(() => {
    if (!data?.length) {
      return {
        availableYears: [],
        availableMonths: [],
        initialYear: new Date().getFullYear(),
        initialMonth: new Date().getMonth() + 1,
      };
    }

    const years = [...new Set(data.map((item) => item.year))].sort((a, b) => b - a);
    const months = [...new Set(data.map((item) => item.month))].sort((a, b) => a - b);

    const mostRecent = data.reduce((latest, current) => {
      if (!latest) return current;
      if (current.year > latest.year) return current;
      if (current.year === latest.year && current.month > latest.month) return current;
      return latest;
    });

    return {
      availableYears: years,
      availableMonths: months,
      initialYear: mostRecent.year,
      initialMonth: mostRecent.month,
    };
  }, [data]);

  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

  const { chartData, selectedMonthSalary, previousMonthSalary, salaryChangePercentage } = useSalaryData({
    data,
    selectedYear,
    selectedMonth,
  });

  const fetchDeductions = async (salaryId: number) => {
    try {
      const response = await showDeductionBySalaryId(salaryId);
      setDeductions(response);
    } catch (error) {
      console.error("Error fetching deductions:", error);
      setDeductions(null);
    }
  };

  const handleMarkAsPaid = async (salaryId: number) => {
    try {
      await markAsPaid(salaryId);
      if (data && onDataUpdate) {
        const updatedSalary = data.find((s) => s.id === salaryId);
        if (updatedSalary) {
          onDataUpdate({
            ...updatedSalary,
            is_payed: 1,
          });
        }
      }
    } catch (error) {
      console.error("Error marking salary as paid:", error);
    }
  };

  const recalculateSalary = async (salaryId: number) => {
    setIsCalculating(salaryId);
    try {
      const response = await totalSalaryEquation(salaryId);
      if (onDataUpdate) onDataUpdate(response);
    } catch (error) {
      console.error("Error recalculating salary:", error);
    } finally {
      setIsCalculating(null);
    }
  };

  useEffect(() => {
    if (selectedMonthSalary) fetchDeductions(selectedMonthSalary.id);
      //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonthSalary]);

  if (!data) {
    return (
      <Typography variant="h6" textAlign="center">
        جاري التحميل
      </Typography>
    );
  }

  if (data.length === 0) {
    return (
      <Typography variant="h6" textAlign="center">
        لا توجد بيانات
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <MonthYearSelector
        availableYears={availableYears}
        availableMonths={availableMonths}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {selectedMonthSalary && (
            <CurrentMonthCard
              currentMonthSalary={selectedMonthSalary}
              previousSalary={previousMonthSalary}
              salaryChangePercentage={salaryChangePercentage}
              personType={personType}
              onMarkAsPaid={handleMarkAsPaid}
            />
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          {selectedMonthSalary && personType !== "employee" && (
            <SalaryInfoCard
              salary={selectedMonthSalary}
              title="تفاصيل الشهر المحدد"
              onMarkAsPaid={handleMarkAsPaid}
              isCalculating={isCalculating === selectedMonthSalary.id}
              onRecalculate={recalculateSalary}
            />
          )}
        </Grid>

        <Grid item xs={12}>
          <SalaryChart chartData={chartData} />
        </Grid>

        <Grid item xs={12}>
        <PeriodStatistics data = {data} />
        </Grid>

        <Grid item xs={12}>
          {personType === "employee" && deductions && (
            <DeductionsListCard deductions={deductions} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};