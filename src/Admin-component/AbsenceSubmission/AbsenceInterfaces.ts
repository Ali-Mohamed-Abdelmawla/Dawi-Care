// AbsenceInterfaces.ts


export interface Employee {
  id: number;
  name: string;
  description: string;
  worked_days: string;
  num_working_days: number;
  weekdays: WeekDay[];
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  week_days: WeekDay[];
}

export interface PersonOption {
  value: number;
  label: string;
  weekDays: WeekDay[];
}

export interface AttendanceData {
  day: string;
  attendance: number;
  date: string;
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
  handleMarkAsAbsent: (date: Date, personInfo: PersonOption) => void;
  getAttendanceByPersonID: (personID: number | undefined, personType: string) => Promise<AttendanceData[] | void>;
  selectedPersonAttendance: AttendanceData[];
  updateAbsenceStatus: (date: Date, personInfo: PersonOption) => void;
  selectedPerson: PersonOption | null;
  personType: 'doctor' | 'employee';
  onPersonChange: (selectedOption: PersonOption | null) => void;
  onPersonTypeChange: (newPersonType: 'doctor' | 'employee') => void;
  handleSwapDaySubmit: (data: SwapDayFormData) => void;


}

export interface SwapDayFormData {
  day: string;
  date: string;
  time: string;
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

export interface getChosenDayIDProps {
  dayInfo: DayInfo;
  personInfo: PersonOption;
}