// types.ts
import { NewClinic } from "../PayRolls/ClinicsInterfaces";
export interface Option {
    value: string;
    label: string;
  }
  
  export interface Doctor {
    id: number;
    name: string;
    clinic: NewClinic;
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
    clinics: NewClinic[];
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