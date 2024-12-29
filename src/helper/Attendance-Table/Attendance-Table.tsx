import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  IconButton,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { AttendanceData } from "../../Admin-component/AbsenceSubmission/AbsenceInterfaces";
// Updated Interface


interface AttendanceTableProps {
  attendanceData: AttendanceData[];
}

// Styled Components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  textAlign: "center",
  border: "1px solid lightblue",
  position: "sticky",
  top: 0,
  zIndex: 10,
}));

const AttendanceCell = styled(TableCell)<{ attedance: number | null }>(
  ({ theme, attedance }) => ({
    backgroundColor:
      attedance === 1
        ? theme.palette.success.main
        : attedance === 0
        ? theme.palette.error.main
        : theme.palette.common.white,
    color:
      attedance === 1 || attedance === 0
        ? theme.palette.common.black
        : theme.palette.text.primary,
    textAlign: "center",
    border: attedance === 1 || attedance === 0 ? "1px solid black" : "",
  })
);

const DayHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.common.white,
  textAlign: "center",
  border: "1px solid lightblue",
  fontWeight: "bold",
}));

// Arabic week days in order (Sunday to Saturday)
const weekDays = [
  "رقم الأسبوع",
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

// Date formatting utility
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-EG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const YearlyAttendanceTable: React.FC<AttendanceTableProps> = ({
  attendanceData,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedYears, setExpandedYears] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedMonths, setExpandedMonths] = useState<{
    [key: string]: { [key: string]: boolean };
  }>({});

  const yearlyData = useMemo(() => {
    const sortedData = [...attendanceData].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const groupedData: {
      [year: string]: {
        [month: string]: {
          totalDays: number;
          presentDays: number;
          weeks: {
            weekNumber: number;
            days: (AttendanceData | null)[];
          }[];
        };
      };
    } = {};

    sortedData.forEach((item) => {
      const date = new Date(item.created_at);
      const yearKey = date.getFullYear().toString();
      const monthKey = `${date.getMonth() + 1}`;
      const weekNumber = Math.ceil(date.getDate() / 7);
      const dayOfWeek = date.getDay();

      if (!groupedData[yearKey]) groupedData[yearKey] = {};
      if (!groupedData[yearKey][monthKey]) {
        groupedData[yearKey][monthKey] = {
          totalDays: 0,
          presentDays: 0,
          weeks: [],
        };
      }

      groupedData[yearKey][monthKey].totalDays++;
      if (item.attedance === 1) {
        groupedData[yearKey][monthKey].presentDays++;
      }

      let weekEntry = groupedData[yearKey][monthKey].weeks.find(
        (w) => w.weekNumber === weekNumber
      );

      if (!weekEntry) {
        weekEntry = {
          weekNumber,
          days: new Array(7).fill(null),
        };
        groupedData[yearKey][monthKey].weeks.push(weekEntry);
      }

      weekEntry.days[dayOfWeek] = item;
    });

    return groupedData;
  }, [attendanceData]);

  const toggleYearExpansion = (year: string) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  const toggleMonthExpansion = (year: string, month: string) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [year]: {
        ...prev[year],
        [month]: !prev[year]?.[month],
      },
    }));
  };

  const renderWeekRows = (
    year: string,
    month: string,
    monthData: {
      totalDays: number;
      presentDays: number;
      weeks: { weekNumber: number; days: (AttendanceData | null)[] }[];
    }
  ) => {
    const isMonthExpanded = expandedMonths[year]?.[month];

    if (!isMonthExpanded) return null;

    return monthData.weeks.map(
      (week: { weekNumber: number; days: (AttendanceData | null)[] }) => (
        <React.Fragment key={week.weekNumber}>
          <TableRow>
            <TableCell sx={{ backgroundColor: "#f1f1f1" }}>
              الأسبوع {week.weekNumber}
            </TableCell>
            {week.days.map((item, dayIndex) => (
              <AttendanceCell
                key={dayIndex}
                attedance={item?.attedance ?? null}
              >
                {item ? (
                  <>
                    {formatDate(item.created_at)}
                    <br />
                    {item.attedance === 1 ? "حاضر" : "غائب"}
                  </>
                ) : (
                  "-"
                )}
              </AttendanceCell>
            ))}
          </TableRow>
        </React.Fragment>
      )
    );
  };

  const renderMonthDetails = (
    year: string,
    month: string,
    monthData: {
      totalDays: number;
      presentDays: number;
      weeks: { weekNumber: number; days: (AttendanceData | null)[] }[];
    }
  ) => {
    const isMonthExpanded = expandedMonths[year]?.[month];
    const attendancePercentage =
      monthData.totalDays > 0
        ? ((monthData.presentDays / monthData.totalDays) * 100).toFixed(2)
        : "0";

    return (
      <React.Fragment key={`${year}-${month}`}>
        <TableRow>
          <TableCell colSpan={8} sx={{ backgroundColor: "darkturquoise" }}>
            <IconButton
              size="small"
              onClick={() => toggleMonthExpansion(year, month)}
            >
              {isMonthExpanded ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
            الشهر {month} - نسبة الحضور: {attendancePercentage}%
          </TableCell>
        </TableRow>
        {isMonthExpanded && (
          <>
            <TableRow>
              {weekDays.map((day) => (
                <DayHeaderCell key={day}>{day}</DayHeaderCell>
              ))}
            </TableRow>
            {renderWeekRows(year, month, monthData)}
          </>
        )}
      </React.Fragment>
    );
  };

  const yearKeys = Object.keys(yearlyData);
  const displayedYears = yearKeys.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead></TableHead>
          <TableBody>
            {displayedYears.map((year) => (
              <React.Fragment key={year}>
                <TableRow>
                  <StyledTableCell colSpan={8}>
                    <IconButton
                      size="small"
                      onClick={() => toggleYearExpansion(year)}
                    >
                      {expandedYears[year] ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                    السنة {year}
                  </StyledTableCell>
                </TableRow>
                {expandedYears[year] &&
                  Object.entries(yearlyData[year]).map(([month, monthData]) =>
                    renderMonthDetails(year, month, monthData)
                  )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={yearKeys.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="عدد السنوات في الصفحة"
      />
    </Box>
  );
};

export default YearlyAttendanceTable;
