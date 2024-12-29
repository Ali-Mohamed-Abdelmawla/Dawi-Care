import { ChangeEvent, useState } from "react";
import { Grid, Box, Typography, InputAdornment, Pagination } from "@mui/material";
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
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setPage(1);
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
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
      <Grid container spacing={3}>
        {paginatedEmployees.map((employee) => (
          <Grid item xs={12} sm={6} md={4} key={employee.id}>
            <EmployeeCard employee={employee} onEmployeeClick={onEmployeeClick} />
          </Grid>
        ))}
      </Grid>
        <Grid container justifyContent="center" sx={{ mt: 4, mb: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_,value)=>{setPage(value);}}
            color="primary"
            size="large"
            variant="outlined"
            shape= "rounded"
          />
        </Grid>
    </Box>
  );
};