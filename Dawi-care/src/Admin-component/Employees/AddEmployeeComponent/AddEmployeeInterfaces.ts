// types.ts

export interface EmployeeFormData {
  name: string;
  national_id: number;
  phone_number: string;
  description: string;
  overtime_salary: number;
  fixed_salary: number;
  working_days: { value: string; label: string }[];
}

export interface AddEmployeeFormProps {

  onSubmit: (data: EmployeeFormData) => void;
  loading: boolean;

}

