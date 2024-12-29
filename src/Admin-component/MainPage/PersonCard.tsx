import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
} from "@mui/material";
import { BriefcaseBusiness, BadgeDollarSign } from "lucide-react";
import { format } from "date-fns";
import { generatePastelColor } from "../../helper/PastelColorGenerator/colors";
import { Doctor } from "../Doctors/doctorInterfaces";
import { Employee } from "../Employees/employeeInterfaces";
import theme from "../../Apptheme";
import { deploy_url } from "../../helper/DeployUrl";

interface PersonCardProps {
  person: Doctor | Employee;
  personType: "doctor" | "employee";
  onSelect: (person: Doctor | Employee) => void;
}

export const PersonCard: React.FC<PersonCardProps> = ({
  person,
  personType,
  onSelect,
}) => {
  // Memoize the banner color based on the person's unique identifier
  const bannerColor = useMemo(() => {
    return generatePastelColor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [person.id]); // Assuming your person object has an id field

  const renderSpecificInfo = () => {
    if (personType === "doctor") {
      const doctor = person as Doctor;
      return (
        <Chip
          icon={<BriefcaseBusiness size={20} />}
          label={doctor.clinic?.name || "لا توجد عياده محدده"}
          size="small"
          sx={{ mb: 1 }}
        />
      );
    } else {
      const employee = person as Employee;
      return (
        <Chip
          icon={<BadgeDollarSign />}
          label={`الراتب الثابت: ${employee.fixed_salary}`}
          size="small"
          sx={{ mb: 1 }}
        />
      );
    }
  };

  const getProfilePhotoUrl = () => {
    if (personType === "doctor") {
      const doctor = person as Doctor;
      console.log(doctor.profile_photo);
      return `${deploy_url}${doctor.profile_photo}`;
    }
    return `${person.name.charAt(0).toUpperCase()}`;
  };

  return (
    <Card
      onClick={() => onSelect(person)}
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
          backgroundColor: bannerColor,
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
            src={getProfilePhotoUrl()}
            alt={person.name.charAt(0).toUpperCase()}
            sx={{
              width: 80,
              height: 80,
              border: "3px solid white",
              bgcolor: bannerColor,
              color: "black",
              boxShadow: 2,
            }}
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {person.name}
          </Typography>
          {renderSpecificInfo()}
          <Typography variant="body2" color="text.secondary">
            رقم الهاتف: {person.phone_number}
          </Typography>
          {personType === "doctor" && (
            <Typography variant="body2" color="text.secondary">
              تاريخ التعيين:{" "}
              {format(new Date((person as Doctor).hire_date), "MMM dd, yyyy")}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
