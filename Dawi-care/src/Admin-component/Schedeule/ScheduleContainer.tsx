// ScheduleContainer.tsx
import { useEffect } from 'react';
import SchedulePresentation from './SchedulePresentation';
import { specialtyOptions } from '../Doctors/doctorUtils';
import { useScheduleApi } from './useSchedeuleApi';



const ScheduleContainer = () => {
  const { appointments, getAllAppointments } = useScheduleApi();

  useEffect(() => {
    getAllAppointments();
  }, []);

  return (
    <SchedulePresentation
      specialtyOptions={specialtyOptions}
      appointments={appointments}
    />
  );
};

export default ScheduleContainer;