import React, { useEffect, useState } from "react";
import axiosInstance from "../../helper/auth/axios";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AttendanceRecord {
  id: number;
  attendance: number;
  day_id: number;
  created_at: string;
}

interface DoctorDay {
  id: number;
  day: string;
  revenue: number | null;
  doctor_id: number;
  doctor_name: string;
  created_at: string;
  attendanceofweekday: AttendanceRecord[];
}

interface DoctorStats {
  [doctorName: string]: {
    [day: string]: {
      present: number;
      absent: number;
    };
  };
}

const Statistics: React.FC = () => {
  const [doctorStats, setDoctorStats] = useState<DoctorStats>({});

  useEffect(() => {
    axiosInstance.get("/api/getattendance")
      .then((response) => {
        const data: DoctorDay[] = response.data;
        const stats: DoctorStats = {};

        data?.forEach((doctorDay) => {
          if (!stats[doctorDay.doctor_name]) {
            stats[doctorDay.doctor_name] = {};
          }
          stats[doctorDay.doctor_name][doctorDay.day] = {
            present: doctorDay.attendanceofweekday.filter(record => record.attendance === 1).length,
            absent: doctorDay.attendanceofweekday.filter(record => record.attendance === 0).length
          };
        });

        setDoctorStats(stats);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const getChartData = (doctorName: string) => {
    const days = Object.keys(doctorStats[doctorName]);
    return {
      labels: days,
      datasets: [
        {
          label: 'حاضر',
          data: days.map(day => doctorStats[doctorName][day].present),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'غائب',
          data: days.map(day => doctorStats[doctorName][day].absent),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'إحصائيات الحضور والغياب',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'عدد المرات'
        }
      },
      x: {
        title: {
          display: true,
          text: 'أيام الأسبوع'
        }
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>إحصائيات الحضور</Typography>
      <Grid container spacing={3}>
        {Object.keys(doctorStats).map((doctorName) => (
          <Grid item xs={12} md={6} key={doctorName}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>{doctorName}</Typography>
              <Bar data={getChartData(doctorName)} options={chartOptions} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Statistics;