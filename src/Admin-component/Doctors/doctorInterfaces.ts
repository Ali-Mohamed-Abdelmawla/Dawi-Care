// interfaces.ts
import { WeekDay } from "../AbsenceSubmission/AbsenceInterfaces";
import { Dayjs } from "dayjs";

export interface Doctor {
    id: number;
    name: string;
    national_id: string;
    phone_number: string;
    profile_photo: string;
    union_registration: string;
    scientific_degree: string;
    specialty: string;
    hire_date: string;
    week_days: WeekDay[];
    fixed_salary: number | null;
    total_salary: number | null;
    working_hours: Record<string, { start: Dayjs | null }>;

  }
  


  export interface DoctorFormData extends Omit<Doctor, 'specialty' > {
  specialty: { value: string; label: string };
  working_days: { value: string | null; label: string | null }[];
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
    doctor: DoctorFormData;
    onSubmit: (data: DoctorFormData) => void;
    onBack: () => void;
    profileImageUrl: string;
    unionRegistrationUrl: string;
    formLoading: boolean;
  }