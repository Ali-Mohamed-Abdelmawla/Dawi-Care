import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useClinicDetails } from './useClinicDetails';
import ClinicDetailsContainer from './ClinicDetailsContainer';

// const ClinicDetailsPage: React.FC = () => {
//   const {
//     clinic, 
//     doctors, 
//     doneServices, 
//     searchTerm,
//     handleDoctorSelect, 
//     handleSearch
//   } = useClinicDetails();

//   if (!clinic) {
//     return (
//       <Box 
//         display="flex" 
//         justifyContent="center" 
//         alignItems="center" 
//         height="100vh"
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <ClinicDetailsContainer
//       clinic={clinic}
//       doctors={doctors}
//       doneServices={doneServices}
//       searchTerm={searchTerm}
//       onDoctorSelect={handleDoctorSelect}
//       onSearchChange={handleSearch}
//     />
//   );
// };

// export default ClinicDetailsPage;


const ClinicDetailsPage: React.FC = () => {
  const {
    clinic, 
    doctors, 
    doneServices, 
    searchTerm,
    handleDoctorSelect, 
    handleSearch,
    handleServiceEdit,
    handleServiceDelete
  } = useClinicDetails();

  if (!clinic) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ClinicDetailsContainer
      clinic={clinic}
      doctors={doctors}
      doneServices={doneServices}
      searchTerm={searchTerm}
      onDoctorSelect={handleDoctorSelect}
      onSearchChange={handleSearch}
      onServiceEdit={handleServiceEdit}
      onServiceDelete={handleServiceDelete}
    />
  );
};

export default ClinicDetailsPage