// useScheduleApi.ts
import { useState } from "react";
import axiosInstance from "../../helper/auth/axios";
import { AppointmentsData, Doctor } from "./SchedeuleInterfaces";
import { useClinicApi } from "../PayRolls/useClinicsApi";
import { NewClinic } from "../PayRolls/ClinicsInterfaces";

export const useScheduleApi = () => {
  const [appointments, setAppointments] = useState<AppointmentsData>({});
  const [clinics, setClinics] = useState<NewClinic[]>([]);
  const { getClinicList } = useClinicApi();

  const accessToken = sessionStorage.getItem("accessToken");

  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(":").slice(0, 2).map(Number);
    const period = hours >= 12 ? "م" : "ص";
    const adjustedHours = hours % 12 || 12; // Use modulo for conversion, special case for 0 to show as 12
    const formattedMinutes = minutes.toString().padStart(2, "0"); // Ensure minutes are two digits

    return `${adjustedHours}:${formattedMinutes} ${period}`;
  };

  const getAllAppointments = async (): Promise<void> => {
    // fetching clinics
    const fetchedClinics = await getClinicList();
    setClinics(fetchedClinics);

    // fetching doctors and constructing appointments
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
        if (!formattedAppointments[doctor.clinic?.name]) {
          formattedAppointments[doctor.clinic?.name] = {};
        }

        doctor.week_days.forEach((weekDay) => {
          if (!formattedAppointments[doctor.clinic?.name][weekDay.day]) {
            formattedAppointments[doctor.clinic?.name][weekDay.day] = [];
          }

          formattedAppointments[doctor.clinic?.name][weekDay.day].push({
            doctorName: doctor.name,
            time: formatTime(weekDay.date),
          });
          console.log(formattedAppointments);
        });
      });

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };
  console.log( "state",appointments);
  return { appointments, getAllAppointments, clinics };
};
