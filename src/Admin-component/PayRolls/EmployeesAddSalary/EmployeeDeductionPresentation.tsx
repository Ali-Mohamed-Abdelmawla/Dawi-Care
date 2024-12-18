import { ChangeEvent } from "react";
import { Grid, Box, Typography, InputAdornment } from "@mui/material";
import { Employee } from "../../Employees/employeeInterfaces";
import { EmployeeCard } from "./EmployeeCard";
import { useClinicStyles } from "../useClinicStyles";

interface EmployeeDeductionPresentationProps {
  employees: Employee[];
  onEmployeeClick: (employee: Employee) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const EmployeeDeductionPresentation: React.FC<EmployeeDeductionPresentationProps> = ({
  employees,
  onEmployeeClick,
  searchTerm,
  setSearchTerm,
}) => {
  const { StyledTextField, StyledSearchIcon } = useClinicStyles();

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ py: 3, mx: 6, width: "auto" }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        خصومات الموظفين
      </Typography>
      <StyledTextField
        autoFocus
        fullWidth
        variant="outlined"
        placeholder="ابحث عن موظف..."
        value={searchTerm}
        onChange={handleSearchChange}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <StyledSearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Grid container spacing={2}>
        {filteredEmployees.map((employee) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={employee.id}>
            <EmployeeCard employee={employee} onEmployeeClick={onEmployeeClick} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
