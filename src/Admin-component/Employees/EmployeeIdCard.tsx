// EmployeeIdCard.tsx
import React from "react";
import { Card, CardContent, Typography, Grid, Box, Chip } from "@mui/material";
import { styled } from "@mui/system";
import { Employee } from "./employeeInterfaces";
interface EmployeeIdCardProps {
  employee: Employee;
}

const StyledCard = styled(Card)({
  maxWidth: 600,
  width: "300px",
  margin: "auto",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  borderRadius: 16,
  overflow: "hidden",
});

const Header = styled(Box)({
  backgroundColor: "#1976d2",
  color: "#ffffff",
  padding: "16px",
  textAlign: "center",
});

const StyledCardContent = styled(CardContent)({
  padding: 0,
});

const DaysContainer = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: "4px",
  marginTop: "8px",
});

const EmployeeIdCard: React.FC<EmployeeIdCardProps> = ({ employee }) => {
  const workDays: string[] = [];
  employee.weekdays?.forEach((weekDay) => {
    console.log(weekDay)
    workDays.push(`${weekDay.day}`);
  });
  return (
    <StyledCard>
      <Header>
        <Typography variant="h5" component="div">
          بطاقة هوية الموظف
        </Typography>
      </Header>
      <StyledCardContent>
        <Grid container spacing={0} alignItems="center">
          <Grid item m={2} xs={7}>
            <Typography variant="h6" component="div">
              {employee.name}
            </Typography>
            <Typography color="text.secondary">
              {employee.description}
            </Typography>
          </Grid>
        </Grid>
        <Box mt={2} ml={2} px={2} pb={2}>
          <Typography variant="body2" color="text.secondary">
            <strong>الرقم القومي:</strong> {employee.national_id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>رقم الهاتف:</strong> {employee.phone_number}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>الراتب الثابت:</strong> {employee.fixed_salary} جنيه
          </Typography>
          {/* <Typography variant="body2" color="text.secondary">
            <strong>راتب الساعات الاضافيه:</strong> {employee.overtime_salary}{" "}
            جنيه
          </Typography> */}
          <Typography variant="body2" color="text.secondary">
            <strong>ايام العمل:</strong>
          </Typography>
          <DaysContainer>
            {workDays.map((day, index) => (
              <Chip
                key={index}
                label={day}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </DaysContainer>
        </Box>
      </StyledCardContent>
    </StyledCard>
  );
};

export default EmployeeIdCard;
