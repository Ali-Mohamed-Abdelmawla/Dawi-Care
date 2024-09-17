// useScheduleApi.ts
import { useState } from "react";
import axiosInstance from "../../helper/auth/axios";
import { AppointmentsData, Doctor } from './SchedeuleInterfaces';

export const useScheduleApi = () => {
  const [appointments, setAppointments] = useState<AppointmentsData>({});
  const accessToken = sessionStorage.getItem("accessToken");

  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':').slice(0, 2).map(Number);
    const period = hours >= 12 ? 'م' : 'ص';
    const adjustedHours = hours % 12 || 12; // Use modulo for conversion, special case for 0 to show as 12
    const formattedMinutes = minutes.toString().padStart(2, '0'); // Ensure minutes are two digits
  
    return `${adjustedHours}:${formattedMinutes} ${period}`;
  };
  const getAllAppointments = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get("/api/All_doctors", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const doctors: Doctor[] = response.data;
      const formattedAppointments: AppointmentsData = {};

      doctors.forEach((doctor) => {
        if (!formattedAppointments[doctor.specialty]) {
          formattedAppointments[doctor.specialty] = {};
        }

        doctor.week_days.forEach((weekDay) => {
          if (!formattedAppointments[doctor.specialty][weekDay.day]) {
            formattedAppointments[doctor.specialty][weekDay.day] = [];
          }

          formattedAppointments[doctor.specialty][weekDay.day].push({
            doctorName: doctor.name,
            time: formatTime(weekDay.date),
          });
        });
      });

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };


  return { appointments, getAllAppointments };
};