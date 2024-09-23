// types.ts
import { Dayjs } from "dayjs";

export interface DoctorFormData {
    name: string;
    national_id: number;
    phone_number: number;
    profile_photo: File | null;
    union_registration: File | null;
    scientific_degree: string;
    fixed_salary: number;
    specialty: { value: string; label: string };
    working_days: { value: string; label: string }[];
    working_hours: Record<string, { start: Dayjs | null }>;


  }
  
  export interface Option {
    value: string;
    label: string;
  }