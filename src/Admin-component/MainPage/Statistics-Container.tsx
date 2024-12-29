import React, { useState } from "react";
import StatisticsPresentation from "./StatisticsPage";
import useStatisticsApi from "./useStatisticsApi";
import { useDoctorApi } from "../Doctors/useDoctorApi";
import { useEmployeeApi } from "../Employees/useEmployeeApi";
import { PersonType, SalaryData } from "./Statistics-Interfaces";

const StatisticsContainer: React.FC = () => {
  const {
    selectedPerson,
    personType,
    viewType,
    attendanceData,
    salaryData,
    setSalaryData, // Add this to your useStatisticsApi hook
    noDataMessage,
    handleViewTypeChange,
    handlePersonTypeChange,
    handlePersonChange,
    allSalaries,
  } = useStatisticsApi();

  const [loading, setLoading] = useState<boolean>(false);
  const { getAllDoctors } = useDoctorApi();
  const { getAllEmployees } = useEmployeeApi();

  const [people, setPeople] = useState<PersonType[]>([]);
  const [allSalaryData, setAllSalaryData] = useState<SalaryData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  React.useEffect(() => {
    const fetchPeople = async () => {
      setPeople([]);
      try {
        setLoading(true);
        const data =
          viewType === "clinics" || personType === "doctor"
            ? await getAllDoctors()
            : await getAllEmployees();

        const fetchedSalaries = await allSalaries();
        setPeople(data);
        setAllSalaryData(fetchedSalaries);
      } catch (error) {
        console.error(`Error fetching ${personType}s:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchPeople();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personType]);

  const handleSalaryUpdate = (updatedSalary: SalaryData) => {
    if (salaryData) {
      const updatedSalaries = salaryData.map((salary) =>
        salary.id === updatedSalary.id ? updatedSalary : salary
      );
      setSalaryData(updatedSalaries);
    }
  };

  const filteredPeople = React.useMemo(() => {
    return people.filter((person) =>
      person.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [people, searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <StatisticsPresentation
      selectedPerson={selectedPerson}
      personType={personType}
      viewType={viewType}
      attendanceData={attendanceData}
      salaryData={salaryData}
      noDataMessage={noDataMessage}
      handleViewTypeChange={handleViewTypeChange}
      handlePersonTypeChange={handlePersonTypeChange}
      searchQuery={searchQuery}
      handleSearchChange={handleSearchChange}
      handlePersonChange={handlePersonChange}
      handleSalaryUpdate={handleSalaryUpdate}
      people={filteredPeople}
      loading={loading}
      allSalaryData={allSalaryData}
    />
  );
};

export default StatisticsContainer;
