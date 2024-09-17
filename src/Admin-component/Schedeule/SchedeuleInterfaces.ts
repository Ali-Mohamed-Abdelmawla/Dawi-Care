// types.ts
export interface Option {
    value: string;
    label: string;
  }
  
  export interface Doctor {
    id: number;
    name: string;
    specialty: string;
    week_days: WeekDay[];
  }
  
  export interface WeekDay {
    id: number;
    day: string;
    date: string;
    attendance: number;
  }
  
  export interface AppointmentsData {
    [specialty: string]: {
      [day: string]: Appointment[];
    };
  }
  
  export interface Appointment {
    doctorName: string;
    time: string;
  }

  export interface SchedulePresentationProps {
    specialtyOptions: Option[];
    appointments: AppointmentsData;
  }
  
  export const weekDays = [
    'الأحد',
    'الاثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
    'السبت'
  ];