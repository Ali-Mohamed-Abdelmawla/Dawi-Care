//personSelect.tsx
import React from 'react';
import Select from 'react-select';
import { PersonOption } from '../../Admin-component/AbsenceSubmission/AbsenceInterfaces';
import { usePersonSelect } from './usePersonSelect';

interface PersonSelectProps {
  personType: 'doctor' | 'employee';
  onChange: (selectedOption: PersonOption | null) => void;
  value: PersonOption | null;
}

const PersonSelect: React.FC<PersonSelectProps> = ({
  personType,
  onChange,
  value,
}) => {
  const { groupedOptions, isLoading, error } = usePersonSelect({ personType });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Select
      options={groupedOptions}
      placeholder={`${personType === 'doctor' ? 'اختر طبيب...' : 'اختر موظف...'}` }
      onChange={onChange}
      value={value}
      isSearchable
      isClearable
      classNamePrefix="react-select"
    />
  );
};

export default PersonSelect;