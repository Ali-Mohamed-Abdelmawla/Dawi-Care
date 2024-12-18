import { PersonOption } from "../AbsenceSubmission/AbsenceInterfaces";
import { Doctor } from "../Doctors/doctorInterfaces";
import { Employee } from "../Employees/employeeInterfaces";

export type PersonType = Doctor | Employee;

export interface AttendanceData {
  name: string;
  attendance_data: {
    day: string;
    attendance: number;
    date: string;
  }[];
}

export interface SalaryData {
  id: number;
  doctor_id: number | null;
  employee_id: number | null;
  total_salary: string;
  num_worked_days: number;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
  is_payed: number;
  doctor_salary: string;
  clinic_salary: string;
}

export interface StatisticsPresentationProps {
  selectedPerson: PersonOption | null;
  personType: "doctor" | "employee";
  viewType: "statistics" | "salary";
  attendanceData: AttendanceData | null;
  salaryData: SalaryData[] | null;
  noDataMessage: string | null;
  handleViewTypeChange: (
    newValue: "statistics" | "salary"
  ) => void;
  handlePersonTypeChange: (
    event: React.SyntheticEvent,
    newValue: "doctor" | "employee"
  ) => void;
  searchQuery: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePersonChange: (selected: PersonOption | null) => void;
  handleSalaryUpdate: (updatedSalary: SalaryData) => void;
  people: PersonType[];
  loading: boolean;
}
//===================================================================================
//==-Interfaces that were made for chart.js-==

// export interface PersonAttendance {
//   name: string;
//   attendance_data: AttendanceData[];
// }

// export interface PersonStats {
//   [personName: string]: {
//     [day: string]: {
//       present: number;
//       absent: number;
//     };
//   };
// }

// export interface ChartData {
//   labels: string[];
//   datasets: {
//     label: string;
//     data: number[];
//     backgroundColor: string;
//   }[];
// }

// export interface ChartOptions {
//   responsive: boolean;
//   plugins: {
//     legend: {
//       position: 'top' | 'bottom' | 'left' | 'right';
//     };
//     title: {
//       display: boolean;
//       text: string;
//     };
//   };
//   scales: {
//     y: {
//       beginAtZero: boolean;
//       title: {
//         display: boolean;
//         text: string;
//       };
//     };
//     x: {
//       title: {
//         display: boolean;
//         text: string;
//       };
//     };
//   };
// }
