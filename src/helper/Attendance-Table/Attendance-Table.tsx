import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface AttendanceCellProps extends React.ComponentProps<typeof TableCell> {
  attendance: number;
}

const AttendanceCell = styled(TableCell)<AttendanceCellProps>(
  ({ theme, attendance }) => ({
    backgroundColor:
      attendance === 1 ? theme.palette.success.main : theme.palette.error.main,
    color: theme.palette.common.black,
    textAlign: 'center',
  })
);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: theme.palette.common.white,
  textAlign: 'center',
}));

const WeekCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.common.white,
  width: 100,
  fontWeight: 'bold',
  textAlign: 'center',
}));

const DayCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.light,
  width: 150,
  color: theme.palette.common.white,
  textAlign: 'center',
}));

interface AttendanceData {
  day: string;
  attendance: number;
  date: string;
}

interface AttendanceTableProps {
  attendanceData: AttendanceData[];
}

const weekDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

const AttendanceTable: React.FC<AttendanceTableProps> = ({ attendanceData }) => {
  // Sort the attendance data by date
  const sortedData = [...attendanceData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group the data by weeks
  const groupedData: { [week: number]: AttendanceData[] } = {};
  sortedData.forEach((item) => {
    const date = new Date(item.date);
    const weekNumber = Math.ceil(date.getDate() / 7);
    if (!groupedData[weekNumber]) {
      groupedData[weekNumber] = [];
    }
    groupedData[weekNumber].push(item);
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell colSpan={2}>الأسبوع</StyledTableCell>
            {weekDays.map((day) => (
              <StyledTableCell key={day}>{day}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(groupedData).map(([week, data]) => (
            <React.Fragment key={week}>
              {data.map((item, index) => {
                const date = new Date(item.date);
                const dayOfWeek = date.getDay();
                return (
                  <TableRow key={item.date}>
                    {index === 0 && (
                      <WeekCell rowSpan={data.length}>الأسبوع {week}</WeekCell>
                    )}
                    <DayCell>{item.date}</DayCell>
                    {weekDays.map((day, dayIndex) => {
                      return dayIndex === dayOfWeek ? (
                        <AttendanceCell key={day} attendance={item.attendance}>
                          {item.attendance === 1 ? 'حاضر' : 'غائب'}
                        </AttendanceCell>
                      ) : (
                        <TableCell key={day} />
                      );
                    })}
                  </TableRow>
                );
              })}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttendanceTable;
