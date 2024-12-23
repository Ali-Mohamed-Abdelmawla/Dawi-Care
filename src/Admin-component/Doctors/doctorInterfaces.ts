// interfaces.ts
import { WeekDay } from "../AbsenceSubmission/AbsenceInterfaces";
import { NewClinic } from "../PayRolls/ClinicsInterfaces";
import dayjs from '../../dateConfig';

export interface DayOption {
  value: string;
  label: string;
  isFixed?: boolean;
  id?: number;
}
export interface Doctor {
  id: number;
  name: string;
  national_id: string;
  phone_number: string;
  profile_photo: string;
  union_registration: string;
  scientific_degree: string;
  hire_date: string;
  // week_days: WeekDay[];
  // working_days: { value: string | null; label: string | null }[];
  fixed_salary: number | null;
  total_salary: number | null;
  working_hours: Record<string, { start: dayjs.Dayjs | null }>;
  week_days: WeekDay[];
  working_days: DayOption[];
  clinic: NewClinic;
  clinic_id: { value: string; label: string } | 0;
  doctor_share: number;
}

export interface DoctorFormData extends Omit<Doctor, "clinic"> {
  clinic: number;
}

export interface DoctorsTableProps {
  doctors: Doctor[];
  handleEditClick: (doctor: Doctor) => void;
  handleDeleteClick: (doctorId: number) => void;
}

export interface DoctorIdCardProps {
  doctor: Doctor;
}

export interface EditDoctorFormProps {
  clinics: NewClinic[];
  doctor: DoctorFormData;
  onSubmit: (data: DoctorFormData) => void;
  onBack: () => void;
  profileImageUrl: string;
  unionRegistrationUrl: string;
  formLoading: boolean;
}
