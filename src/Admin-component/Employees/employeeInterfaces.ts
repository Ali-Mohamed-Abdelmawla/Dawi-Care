// interfaces.ts
export interface Employee {
  id: number;
  name: string;
  national_id: string;
  phone_number: string;
  description: string;
  overtime_salary: string;
  fixed_salary: string;
  worked_days: string;
  weekdays: { day: string }[];
}

export interface EmployeeFormData
  extends Employee {
    working_days: { value: string; label: string }[];

}

export interface EmployeesTableProps {
  employees: Employee[];
  handleEditClick: (employee: Employee) => void;
  handleDeleteClick: (employeeId: number) => void;
}

export interface EmployeeIdCardProps {
  employee: Employee;
}

export interface EditEmployeeFormProps {
  employee: Employee;
  onSubmit: (data: EmployeeFormData) => void;
  onBack: () => void;
  formLoading: boolean;
}