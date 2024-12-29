import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
  useTheme,
} from "@mui/material";
import { BadgeDollarSign, BriefcaseBusiness } from "lucide-react";
import { Employee } from "../../Employees/employeeInterfaces";
import { generatePastelColor } from "../../../helper/PastelColorGenerator/colors";

interface EmployeeCardProps {
  employee: Employee;
  onEmployeeClick: (employee: Employee) => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onEmployeeClick,
}) => {
  const theme = useTheme();
  // Memoize the banner color based on the employee's unique identifier
  const bannerColor = useMemo(() => {
    return generatePastelColor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee.id]);

  const getAvatarText = () => {
    return employee.name.charAt(0).toUpperCase();
  };

  return (
    <Card
      onClick={() => onEmployeeClick(employee)}
      sx={{
        cursor: "pointer",
        transition: "all 0.2s",
        "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
        position: "relative",
        overflow: "visible",
        border: `1px solid ${theme.palette.dividerColor.main}`,
      }}
    >
      <Box
        sx={{
          background: bannerColor,
          height: "60px",
          borderRadius: "11px 11px 0 0",
          border: `1px solid ${theme.palette.dividerColor.main}`,
        }}
      />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: -5,
          }}
        >
          <Avatar
            alt={employee.name}
            sx={{
              width: 80,
              height: 80,
              fontSize: "22px",
              border: "3px solid white",
              bgcolor: bannerColor,
              color: "black",
              boxShadow: 2,
            }}
          >
            {getAvatarText()}
          </Avatar>

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            {employee.name}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Chip
              icon={<BadgeDollarSign />}
              label={`الراتب الثابت: ${employee.fixed_salary} ج.م`}
              size="small"
              sx={{ mb: 1,mr:1 }}

            />
            <Chip
              icon={<BriefcaseBusiness size={16} />}
              label={employee.description || "لا يوجد وصف وظيفي لهذا الموظف"}
              size="small"
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            رقم الهاتف: {employee.phone_number || "غير محدد"}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            عدد أيام العمل:{" "}
            {employee.weekdays.filter((day) => !day.switch_day).length}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
