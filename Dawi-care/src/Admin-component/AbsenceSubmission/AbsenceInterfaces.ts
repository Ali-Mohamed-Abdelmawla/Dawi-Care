//absenceInterfaces.ts
export interface WeekDay {
  id: number;
  day: string;
  revenue: number | null;
  date: string;
  attendance: number;
  doctor_id: number;
  created_at: string;
}

export interface Employee {
  id: number;
  name: string;
  description: string;
  worked_days: string;
  num_working_days: number;
  emlpoyee_week_day: WeekDay[];
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  week_days: WeekDay[];
}

export interface EmployeeOption {
  value: number;
  label: string;
  weekDays: WeekDay[];
}

export interface DoctorOption {
  value: number;
  label: string;
  weekDays: WeekDay[];
}

export interface doctorInfo {
  weekDays: WeekDay[];
  value: number;
  label: string;
}

export interface AttendanceData {
  day: string;
  attendance: number;
  date: string;
}

export interface AbsencePresentationProps {
  doctors: Doctor[] | null;
  employees: Employee[] | null;
  handleMarkAsAbsent: (
    date: Date,
    doctorInfo: doctorInfo,
    personType: string
  ) => void;
  getAttendanceByDoctorID: (
    doctorID: number | undefined,
    personType: string
  ) => Promise<AttendanceData[]>;
  selectedDoctorAttendance: AttendanceData[];
  updateAbsenceStatus: (
    date: Date,
    doctorInfo: doctorInfo,
    personType: string
  ) => void;
}

export interface getChosenDayIDProps {
  dayInfo: {
    formattedDate: string;
    arabicDayName: string;
  };
  doctorInfo: {
    value: number;
    label: string;
    weekDays: WeekDay[];
  };
}
