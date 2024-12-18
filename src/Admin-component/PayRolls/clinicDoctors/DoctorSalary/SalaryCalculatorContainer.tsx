// DoctorSalaryCalculatorContainer.tsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DoctorSalaryCalculatorPresentation from "./SalaryCalculatorPresentation";
import { useClinicApi } from "../../useClinicsApi";
import sweetAlertInstance from "../../../../helper/SweetAlert";
import { Doctor } from "../../../Doctors/doctorInterfaces";
import { useAbsenceApi } from "../../../AbsenceSubmission/useAbsenceApi";
import { Service } from "../../ClinicsInterfaces";
import { AttendanceData } from "../../../AbsenceSubmission/AbsenceInterfaces";
import dayjs from '../../../../dateConfig';

interface AttendanceRecord {
  attendanceId: number;
  day: string | null;
  switch_day: string | null;
  attendance: number;
  date: string;
}

const DoctorSalaryCalculatorContainer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [doctor, setDoctor] = useState<Doctor>();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [selectedAttendanceId, setSelectedAttendanceId] = useState<number | null>(null);

  const { addDoctorSalary } = useClinicApi();
  const { getAttendanceByPersonID } = useAbsenceApi();

const transformAttendanceData = (data: AttendanceData): AttendanceRecord => (
  {
  attendanceId: data.attendanceId ?? -1, // Use actual ID from API if it exists
  day: data.day,
  switch_day: null,
  attendance: data.attendance,
  date: data.date
});

// Update your useEffect:
useEffect(() => {
  const locationState = location.state;
  if (locationState) {
    setServices(locationState.services?.map((service: Service) => ({
      ...service,
      quantity: 0
    })) || []);
    setDoctor(locationState.doctor);

    if (locationState.doctor?.id) {
      const fetchAttendance = async () => {
        const attendanceData = await getAttendanceByPersonID(
          locationState.doctor.id,
          "doctor"
        );
        // Transform the attendance data
        const transformedAttendance = attendanceData.map(transformAttendanceData);        
        setAttendance(transformedAttendance);
      };
      fetchAttendance();
    }
  }
  //eslint-disable-next-line react-hooks/exhaustive-deps
}, [location.state]);

  const handleServiceQuantityChange = (serviceId: number, change: number) => {
    setServices(prevServices => {
      const newServices = prevServices.map(service => {
        if (service.id === serviceId) {
          const newQuantity = Math.max(0, (service.quantity || 0) + change);
          return { ...service, quantity: newQuantity };
        }
        return service;
      });

      // Recalculate total amount
      const newTotal = newServices.reduce((sum, service) => 
        sum + (service.quantity || 0) * parseFloat(service.price), 0
      );
      setTotalAmount(newTotal);

      return newServices;
    });
  };

  const handleDateSelection = (date: dayjs.Dayjs | null) => {
    if (!date) return;
    
    const attendanceRecord = attendance.find(
      record => record.date === date.format("YYYY-MM-DD")
    );

    if (attendanceRecord) {
      setSelectedDate(date);
      setSelectedAttendanceId(attendanceRecord.attendanceId);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAttendanceId) {
      sweetAlertInstance.fire({
        icon: "error",
        title: "خطأ",
        text: "برجاء اختيار يوم العمل",
      });
      return;
    }
  
    if (totalAmount <= 0) {
      sweetAlertInstance.fire({
        icon: "error",
        title: "خطأ",
        text: "يجب أن يكون المبلغ أكبر من صفر",
      });
      return;
    }
  
    if (!doctor?.id) {
      sweetAlertInstance.fire({
        icon: "error",
        title: "خطأ",
        text: "لم يتم العثور على بيانات الطبيب",
      });
      return;
    }
  
    try {
      setIsSubmitting(true);
      const response = await addDoctorSalary(
        selectedAttendanceId, 
        totalAmount,
        doctor.id,  // Pass doctorId
        services    // Pass services array
      );
  
      if (response.status === "success") {
        await sweetAlertInstance.fire({
          icon: "success",
          title: "تمت إضافة الراتب بنجاح",
          text: "تمت إضافة راتب طبيب بنجاح",
        });
        navigate(-1);
      } else {
        throw new Error("Failed to add salary");
      }
    } catch (error) {
      console.error("خطأ في إرسال البيانات:", error);
      await sweetAlertInstance.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء أضافة الراتب",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedDate(null);
    setSelectedAttendanceId(null);
    setTotalAmount(0);
    setServices(prevServices => 
      prevServices.map(service => ({ ...service, quantity: 0 }))
    );
  };

  return (
    <DoctorSalaryCalculatorPresentation
      services={services}
      doctor={doctor}
      attendance={attendance}
      selectedDate={selectedDate}
      onDateSelect={handleDateSelection}
      onServiceQuantityChange={handleServiceQuantityChange}
      onSubmit={handleSubmit}
      onReset={handleReset}
      isSubmitting={isSubmitting}
      totalAmount={totalAmount}
    />
  );
};

export default DoctorSalaryCalculatorContainer;