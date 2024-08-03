// interfaces.ts
export interface Doctor {
    id: number;
    name: string;
    national_id: string;
    phone_number: string;
    profile_photo: string;
    union_registration: string;
    scientific_degree: string;
    fixed_salary: number;
    specialty: string;
    worked_days: string;
    hire_date: string;
  }
  
  export interface DoctorFormData extends Omit<Doctor, 'specialty' | 'worked_days'> {
    specialty: { value: string; label: string };
    working_days: { value: string; label: string }[];
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
    doctor: Doctor;
    onSubmit: (data: DoctorFormData) => void;
    onBack: () => void;
    profileImageUrl: string;
    unionRegistrationUrl: string;
  }