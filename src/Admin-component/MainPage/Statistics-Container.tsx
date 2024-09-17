// Statistics-Container.tsx

import React from "react";
import StatisticsPresentation from "./StatisticsPage";
import useStatisticsApi from "./useStatisticsApi";

const StatisticsContainer: React.FC = () => {
  const {
    selectedPerson,
    personType,
    attendanceData,
    noDataMessage,
    handlePersonTypeChange,
    handlePersonChange,
  } = useStatisticsApi();

  return (
    <StatisticsPresentation
      selectedPerson={selectedPerson}
      personType={personType}
      attendanceData={attendanceData}
      noDataMessage={noDataMessage}
      handlePersonTypeChange={handlePersonTypeChange}
      handlePersonChange={handlePersonChange}
    />
  );
};

export default StatisticsContainer;