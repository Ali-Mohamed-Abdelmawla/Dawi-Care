// types.ts
import {Doctor} from "../Doctors/doctorInterfaces";
export interface Clinic {
    value: string;
    label: string;
    imageUrl?: string; // إضافة حقل اختياري للصورة
  }
  
  export interface DoctorWage extends Doctor {

    salary: number;
    centerPercentage: number;
    totalIncome: number;
  }

export interface ClinicDetailsPresentationProps {
  clinic: Clinic;
  doctors: DoctorWage[];
  onDoctorSelect: (doctor: DoctorWage) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export interface ClinicsListPresentationProps {
  clinics: Clinic[];
  doctors: Doctor[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onClinicClick: (clinic: Clinic, searchTerm: string) => void;
}

  export interface DoctorRevenueEntryProps {
    doctor: DoctorWage;
    onSave: (doctorId: number, totalRevenue: number, doctorShare: number, centerShare: number) => void;
    open: boolean;
    onClose: () => void;
  }