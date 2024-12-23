// types.ts
import { Doctor } from "../Doctors/doctorInterfaces";

export interface NewClinic {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  service: { id:number; name: string; price: string }[];
}

export interface Service {
  id: number;
  name: string;
  price: string;
  quantity: number;
}

export interface ClinicFormData {
  name: string;
  image: string;
}

export interface DoctorWage extends Doctor {
  salary: number;
  centerPercentage: number;
  totalIncome: number;
}

export interface ClinicDetailsPresentationProps {
  clinic: NewClinic;
  doctors: DoctorWage[];
  onDoctorSelect: (doctor: DoctorWage) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  doneServices: DoneService[]; // New prop

}

export interface ClinicsListPresentationProps {
  clinics: NewClinic[];
  doctors: Doctor[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onClinicClick: (clinic: NewClinic, searchTerm: string) => void;
  onDeleteClinic: (clinicId: number) => void;
  onEditClinic: (clinic: NewClinic) => void;
}

export interface DoctorRevenueEntryProps {
  doctor: DoctorWage;
  onSave: (
    doctorId: number,
    totalRevenue: number,
    doctorShare: number,
    centerShare: number
  ) => void;
  open: boolean;
  onClose: () => void;
}

export interface AddClinicPresentationProps {
  loading: boolean;
  onSubmit: () => void;
}

export interface EditClinicPresentationProps {
  loading: boolean;
  onSubmit: () => void;
}

export interface AddClinicFormData {
  clinicName: string;
  service: Array<{ name: string; cost: string }>;
}

export interface EditClinicFormData {
  id: number;
  clinicName: string;
  service: Array<{ name: string; price: string }>;
}

export interface DoneService {
  id: number;
  service_id: number;
  doctor_id: number;
  clinic_id: number;
  created_at: string;
  total_cost: string;
  count: number;
}

export type InternalServiceData = {
  name: string;
  price: string;
  isNew?: boolean;
};

export type InternalFormData = Omit<EditClinicFormData, 'service'> & {
  service: InternalServiceData[];
};