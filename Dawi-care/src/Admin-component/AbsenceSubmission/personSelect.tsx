// PersonSelect.tsx
import React from "react";
import Select, { GroupBase, OptionsOrGroups } from "react-select";
import { DoctorOption, EmployeeOption } from "./AbsenceInterfaces";

interface PersonSelectProps {
  options: OptionsOrGroups<DoctorOption | EmployeeOption, GroupBase<DoctorOption | EmployeeOption>>;
  placeholder: string;
  onChange: (selectedOption: DoctorOption | EmployeeOption | null) => void;
  value: DoctorOption | EmployeeOption | null;
}

const PersonSelect: React.FC<PersonSelectProps> = ({ options, placeholder, onChange, value }) => {
  return (
    <Select<DoctorOption | EmployeeOption, false, GroupBase<DoctorOption | EmployeeOption>>
      options={options}
      placeholder={placeholder}
      isSearchable
      isClearable
      onChange={onChange}
      value={value}
      styles={{
        control: (provided) => ({
          ...provided,
          marginBottom: "20px",
        }),
      }}
    />
  );
};

export default PersonSelect;