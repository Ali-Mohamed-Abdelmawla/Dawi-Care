import React, { useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  Box, 
  Chip,
} from '@mui/material';
import { BadgeDollarSign } from 'lucide-react';
import { Employee } from '../../Employees/employeeInterfaces';
import { generatePastelColor } from '../../../helper/PastelColorGenerator/colors';

interface EmployeeCardProps {
  employee: Employee;
  onEmployeeClick: (employee: Employee) => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ 
  employee, 
  onEmployeeClick 
}) => {
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
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.02)" },
        position: "relative",
        overflow: "visible",
        mx: 'auto',
        my: 2
      }}
    >
      <Box sx={{ backgroundColor: bannerColor, height: "60px" }} />
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
              border: "4px solid white",
              bgcolor: bannerColor,
              color: 'black',
              fontSize: '2rem'
            }}
          >
            {getAvatarText()}
          </Avatar>
          
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            {employee.name}
          </Typography>
          
          <Chip
            icon={<BadgeDollarSign />}
            label={`الراتب الثابت: ${employee.fixed_salary} ج.م`}
            size="small"
            sx={{ mb: 1 }}
          />
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            رقم الهاتف: {employee.phone_number || 'غير محدد'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            عدد أيام العمل: {employee.weekdays.filter(day => !day.switch_day).length}
          </Typography>
          
        </Box>
      </CardContent>
    </Card>
  );
};