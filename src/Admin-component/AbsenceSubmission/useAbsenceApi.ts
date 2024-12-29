// import { useNavigate } from "react-router-dom";
import axiosInstance from "../../helper/auth/axios";
import sweetAlertInstance from "../../helper/SweetAlert";
import { 
  AttendanceData,
  PersonOption,
  SwapDayFormData 
} from "./AbsenceInterfaces";
import { 
  formatDateWithArabicDay, 
} from "./absenceHelperFunctions";
import dayjs from '../../dateConfig';


export const useAbsenceApi = () => {
  const accessToken = sessionStorage.getItem("accessToken");

  const getAttendanceByPersonID = async (
    id: number | undefined,
    personType: string
  ): Promise<AttendanceData[]> => {
    try {
      const endpoint = personType === "doctor"
        ? `/api/get_doctor_attendence/${id}`
        : `/api/get_employee_attendence/${id}`;
        
      const response = await axiosInstance.get(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      
      return response.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const submitAbsence = async (
    date: Date, 
    personInfo: PersonOption,
    personType: string,
    attendanceId:number | undefined
  ) => {
    try {
      console.log("attendance Id: ",attendanceId);
      const dayInfo = formatDateWithArabicDay(date);

      const result = await sweetAlertInstance.fire({
        title: "هل انت متاكد ؟",
        text: `سيتم تسجيل غياب ${personType === "doctor" ? "الطبيب" : "الموظف"} "${
          personInfo.label
        }" يوم "${dayInfo.arabicDayName}" الموافق "${dayInfo.formattedDate}" `,
        icon: "warning",
        confirmButtonText: "نعم",
        cancelButtonText: "لا",
        showCancelButton: true,
      });

      if (!result.isConfirmed) return;

      const response = await axiosInstance.post(
        `/api/attendencezero/${attendanceId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          params: {
            created_at: dayInfo.formattedDate,
          },
        }
      );

      return {
        status: "success",
        data: response.data,
        message: response.data.message
      };
    } catch (error) {
      console.log(error);
      return {
        status: "error",
        data: error
      };
    }
  };

  const updateAbsenceStatus = async (
    date: Date, 
    personInfo: PersonOption,
    personType: string,
    attendanceId:number | undefined
  ) => {
    try {
      const dayInfo = formatDateWithArabicDay(date);
      console.log("attendance Id: ",attendanceId);

      const result = await sweetAlertInstance.fire({
        title: "هل انت متاكد ؟",
        text: `سيتم تعديل حالة غياب ${
          personType === "doctor" ? "الطبيب" : "الموظف"
        } "${personInfo.label}" يوم "${dayInfo.arabicDayName}" الموافق "${
          dayInfo.formattedDate
        }" `,
        icon: "warning",
        confirmButtonText: "نعم",
        cancelButtonText: "لا",
        showCancelButton: true,
      });

      if (!result.isConfirmed) return;

      const response = await axiosInstance.post(
        `/api/deleteattendence/${attendanceId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          params: {
            date: dayInfo.formattedDate,
          },
        }
      );

      return {
        status: "success",
        data: response.data
      };
    } catch (error) {
      return {
        status: "error",
        data: error
      };
    }
  };

  const handleSwapDay = async (
    data: SwapDayFormData,
    selectedPerson: PersonOption,
    personType: string
  ) => {
    console.log(data);
    try {
      const response = await axiosInstance.post(
        `/api/switchday/${selectedPerson.value}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          params: {
            day: data.day.value,
            type: personType,
            switchDayDate: dayjs(data.date).format("YYYY-MM-DD"),
            switchedDayDate: data.absentDate.value,
            date: data.time
          },
        }
      );

      return {
        status: "success",
        data: response.data
      };
    } catch (error) {
      return {
        status: "error",
        data: error
      };
    }
  };

  return {
    getAttendanceByPersonID,
    submitAbsence,
    updateAbsenceStatus,
    handleSwapDay,
  };
};