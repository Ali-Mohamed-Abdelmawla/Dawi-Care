import { useMemo } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { SalaryData } from "../Statistics-Interfaces";

interface UseSalaryDataParams {
  data: SalaryData[] | null;
  selectedYear: number;
  selectedMonth: number;
}

export const useSalaryData = ({ data, selectedYear, selectedMonth }: UseSalaryDataParams) => {
  return useMemo(() => {
    if (!data || data.length === 0)
      return {
        chartData: [],
        currentMonthSalary: null,
        latestSalary: null,
        previousSalary: null,
        salaryChangePercentage: 0,
      };

    // Sort data chronologically
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a.year, a.month - 1);
      const dateB = new Date(b.year, b.month - 1);
      return dateA.getTime() - dateB.getTime();
    });

    // Find the selected month's salary
    const selectedMonthSalary = data.find(
      (salary) => salary.year === selectedYear && salary.month === selectedMonth
    );

    // Find the previous month's salary
    let previousMonth = selectedMonth - 1;
    let previousYear = selectedYear;
    if (previousMonth < 1) {
      previousMonth = 12;
      previousYear -= 1;
    }

    const previousMonthSalary = data.find(
      (salary) => salary.year === previousYear && salary.month === previousMonth
    ) || null;

    // Calculate salary change percentage
    const salaryChangePercentage = previousMonthSalary && selectedMonthSalary
      ? ((parseFloat(selectedMonthSalary.doctor_salary || selectedMonthSalary.total_salary) -
          parseFloat(previousMonthSalary.doctor_salary || previousMonthSalary.total_salary)) /
          parseFloat(previousMonthSalary.doctor_salary || previousMonthSalary.total_salary)) *
        100
      : 0;

    // Prepare chart data
    const chartData = sortedData.map((salary) => ({
      date: format(new Date(salary.year, salary.month - 1), "MMM yyyy", {
        locale: ar,
      }),
      salary: parseFloat(salary.doctor_salary || salary.total_salary),
      days: salary.num_worked_days,
      timestamp: new Date(salary.year, salary.month - 1).getTime(),
    }));

    return {
      chartData,
      selectedMonthSalary,
      previousMonthSalary,
      salaryChangePercentage,
    };
  }, [data, selectedYear, selectedMonth]);
};