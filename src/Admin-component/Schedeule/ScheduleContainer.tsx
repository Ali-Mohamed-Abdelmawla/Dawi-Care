// ScheduleContainer.tsx
import { useEffect } from 'react';
import SchedulePresentation from './SchedulePresentation';
import { useScheduleApi } from './useSchedeuleApi';



const ScheduleContainer = () => {
  const { clinics, appointments, getAllAppointments } = useScheduleApi();

  useEffect(() => {
    getAllAppointments();
    // disabling the linter here because this is a useEffect and we don't want it to trigger on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SchedulePresentation
      clinics={clinics}
      appointments={appointments}
    />
  );
};

export default ScheduleContainer;