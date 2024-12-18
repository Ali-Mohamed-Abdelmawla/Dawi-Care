// MonthYearSelector.tsx
import React from "react";
import { Box, IconButton, Typography, Paper } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface MonthYearSelectorProps {
  availableYears: number[];
  availableMonths: number[];
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
}

export const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
  availableYears,
  availableMonths,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
}) => {
  const handlePreviousYear = () => {
    const currentIndex = availableYears.indexOf(selectedYear);
    if (currentIndex > 0) {
      onYearChange(availableYears[currentIndex - 1]);
    }
  };

  const handleNextYear = () => {
    const currentIndex = availableYears.indexOf(selectedYear);
    if (currentIndex < availableYears.length - 1) {
      onYearChange(availableYears[currentIndex + 1]);
    }
  };

  const handlePreviousMonth = () => {
    const currentIndex = availableMonths.indexOf(selectedMonth);
    if (currentIndex > 0) {
      onMonthChange(availableMonths[currentIndex - 1]);
    }
  };

  const handleNextMonth = () => {
    const currentIndex = availableMonths.indexOf(selectedMonth);
    if (currentIndex < availableMonths.length - 1) {
      onMonthChange(availableMonths[currentIndex + 1]);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
        }}
      >
        {/* Year Selector */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={handlePreviousYear}
            disabled={selectedYear === availableYears[0]}
            size="small"
          >
            <ChevronRight size={20} />
          </IconButton>
          <Typography variant="h6" sx={{ minWidth: "100px", textAlign: "center" }}>
            {selectedYear}
          </Typography>
          <IconButton
            onClick={handleNextYear}
            disabled={selectedYear === availableYears[availableYears.length - 1]}
            size="small"
          >
            <ChevronLeft size={20} />
          </IconButton>
        </Box>

        {/* Month Selector */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={handlePreviousMonth}
            disabled={selectedMonth === availableMonths[0]}
            size="small"
          >
            <ChevronRight size={20} />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ minWidth: "120px", textAlign: "center" }}
          >
            {format(new Date(2024, selectedMonth - 1), "MMMM", { locale: ar })}
          </Typography>
          <IconButton
            onClick={handleNextMonth}
            disabled={selectedMonth === availableMonths[availableMonths.length - 1]}
            size="small"
          >
            <ChevronLeft size={20} />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};