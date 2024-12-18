// usePersonSelect.ts
import { useState, useEffect } from "react";
import axiosInstance from "../auth/axios";
import { Doctor, Employee, PersonOption } from "../../Admin-component/AbsenceSubmission/AbsenceInterfaces";

interface UsePersonSelectProps {
  personType: "doctor" | "employee";
}

interface UsePersonSelectReturn {
  groupedOptions: { label: string; options: PersonOption[] }[];
  isLoading: boolean;
  error: string | null;
}

export const usePersonSelect = ({
  personType,
}: UsePersonSelectProps): UsePersonSelectReturn => {
  const [data, setData] = useState<Doctor[] | Employee[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = sessionStorage.getItem("accessToken");
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const endpoint =
          personType === "doctor" ? "/api/All_doctors" : "/api/All_Employee";
        const response = await axiosInstance.get(endpoint, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        setData(response.data);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personType]);

  const groupedOptions = data
    ? data.reduce((acc, item) => {
        const group =
          personType === "doctor"
            ? (item as Doctor).clinic?.name
            : (item as Employee).description;
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push({
          value: item.id,
          label: item.name,
          weekDays:
            personType === "doctor"
              ? (item as Doctor).week_days
              : (item as Employee).weekdays,
        });
        return acc;
      }, {} as Record<string, PersonOption[]>)
    : {};

  const formattedOptions = Object.entries(groupedOptions).map(
    ([label, options]) => ({
      label,
      options,
    })
  );

  return { groupedOptions: formattedOptions, isLoading, error };
};
