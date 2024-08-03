// types.ts
import {Doctor} from "../Doctors/doctorInterfaces";
export interface Clinic {
    value: string;
    label: string;
    imageUrl?: string; // إضافة حقل اختياري للصورة
  }
  
  export interface DoctorWage extends Doctor {
    id: number;
    name: string;
    salary: number;
    centerPercentage: number;
    totalIncome: number;
  }

  export interface ClinicDetailsPresentationProps {
    clinic: Clinic;
    doctors: DoctorWage[];
    onDoctorSelect: (doctor: DoctorWage) => void;
  }

  export interface ClinicsListPresentationProps {
    clinics: Clinic[];
    onClinicClick: (clinic: Clinic) => void; // Change this line
  }

  export interface DoctorRevenueEntryProps {
    doctor: DoctorWage;
    onSave: (doctorId: number, totalRevenue: number, doctorShare: number, centerShare: number) => void;
    open: boolean;
    onClose: () => void;
  }