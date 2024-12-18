//absenceHelperFunctions.tsx
import { getChosenDayIDProps } from "./AbsenceInterfaces";

export function formatDateWithArabicDay(date: Date | string): {
  formattedDate: string;
  arabicDayName: string;
} {
  const d = new Date(date);

  // Ensure the date is valid
  if (isNaN(d.getTime())) {
    throw new Error("Invalid date");
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(d.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  // Array of Arabic day names
  const arabicDays = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  const arabicDayName = arabicDays[d.getDay()];

  return { formattedDate, arabicDayName };
}

//===============================================================================

export function getChosenDayID(
  dayInfo: getChosenDayIDProps["dayInfo"],
  personInfo: getChosenDayIDProps["personInfo"]
): number | null {
  if (!personInfo.weekDays) {
    console.log("No weekdays available");
    return null;
  }

  for (const element of personInfo.weekDays) {
    if (dayInfo.arabicDayName === element.day) {
      console.log(element.id);
      return element.id;
    }
  }

  // If no match is found
  console.log("No matching day found");
  return null;
}