// PersonSelect.tsx
import React from "react";
import Select, { GroupBase, OptionsOrGroups } from "react-select";
import { PersonOption } from "./AbsenceInterfaces";

interface PersonSelectProps {
    options: OptionsOrGroups<PersonOption, GroupBase<PersonOption>>;
    placeholder: string;
    onChange: (selectedOption: PersonOption | null) => void;
    value: PersonOption | null;
}

const PersonSelect: React.FC<PersonSelectProps> = ({
    options,
    placeholder,
    onChange,
    value,
}) => {
    return (
        <Select<PersonOption, false, GroupBase<PersonOption>>
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
