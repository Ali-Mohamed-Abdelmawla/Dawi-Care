// Statistics-interfaces.ts
import { PersonOption } from "../AbsenceSubmission/AbsenceInterfaces";
export interface AttendanceData {
  name: string;
  attendance_data: {
    day: string;
    attendance: number;
    date: string;
  }[];
}

export interface StatisticsPresentationProps {
  attendanceData: AttendanceData | null;
  noDataMessage: string | null;
}

export interface StatisticsPresentationProps {
  selectedPerson: PersonOption | null;
  personType: "doctor" | "employee";
  attendanceData: AttendanceData | null;
  noDataMessage: string | null;
  handlePersonTypeChange: (event: React.SyntheticEvent, newValue: "doctor" | "employee") => void;
  handlePersonChange: (selected: PersonOption | null) => void;
}
//===================================================================================
//==-Interfaces that were made for chart.js-===

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