// AbsenceInterfaces.ts

import { NewClinic } from "../PayRolls/ClinicsInterfaces";

export interface Employee {
  id: number;
  name: string;
  description: string;
  worked_days: string;
  num_working_days: number;
  weekdays: WeekDay[];
  phoneNumber: string;
  hire_date: string;
}

export interface Doctor {
  id: number;
  name: string;
  clinic: NewClinic;
  phoneNumber: string;
  hire_date: string;
  profile_photo: string;
  week_days: WeekDay[];
}

export interface PersonOption {
  value: number;
  label: string;
  weekDays: WeekDay[] | null;
}

export interface AttendanceData {
  id: number;
  day: string;
  attedance: number;
  date: string;
  created_at:string;
  day_id:number;
  doctor_id:number | null;
  employee_id: number | null;
  revenue: number | null;
}

export interface DayInfo {
  formattedDate: string;
  arabicDayName: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface AbsencePresentationProps {
  handleMarkAsAbsent: (date: Date, personInfo: PersonOption,selectedPersonAttendance: AttendanceData[]) => void;
  updateAbsenceStatus: (date: Date, personInfo: PersonOption,selectedPersonAttendance: AttendanceData[]) => void;
  getAttendanceByPersonID: (personID: number | undefined, personType: string) => Promise<AttendanceData[] | void>;
  selectedPersonAttendance: AttendanceData[];
  selectedPerson: PersonOption | null;
  personType: 'doctor' | 'employee';
  onPersonChange: (selectedOption: PersonOption | null) => void;
  onPersonTypeChange: (newPersonType: 'doctor' | 'employee') => void;
  handleSwapDaySubmit: (data: SwapDayFormData) => void;
  people: Doctor[] | Employee[];
  onClearSelection: () => void
  loading: boolean
}

export interface SwapDayFormData {
  day: {value: string, label: string};
  date: string;
  time: string;
  absentDate: {value: string, label: string};
}

export interface WeekDay {
  id: number;
  day: string | null;
  date: string;
  attendance: string;
  doctor_id?: number;
  employee_id?: number;
  switch_day: string | null;
  created_at: string;
  switch_day_date: string;
  switched_day_date: string;
}

export interface TwoColumnDaysUIProps {
  weekDays: WeekDay[];
  showSwitchedDays: boolean;
  setShowSwitchedDays: (show: boolean) => void;
  personType:'doctor' | 'employee'
}

export interface DayListProps {
  days: WeekDay[];
  title: string;
  personType:'doctor' | 'employee'

}