// DoctorIdCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Modal,
  Grid,
  Box,
  Chip,
} from "@mui/material";
import { styled } from "@mui/system";
import { Doctor } from "./doctorInterfaces";
import { useState } from "react";
interface DoctorIdCardProps {
  doctor: Doctor;
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

const DoctorIdCard: React.FC<DoctorIdCardProps> = ({ doctor }) => {
  const workDays: string[] = [];
  doctor.week_days?.forEach(weekDay => {
    workDays.push(`${weekDay.day} ${formatTime(weekDay.date)}`);
    
  });
  const [openImage, setOpenImage] = useState(false);

  const handleOpenImage = () => setOpenImage(true);
  const handleCloseImage = () => setOpenImage(false);
  return (
    <StyledCard>
      <Header>
        <Typography variant="h5" component="div">
          بطاقة هوية الطبيب
        </Typography>
      </Header>
      <StyledCardContent>
        <Grid container spacing={0} alignItems="center">
          <Grid item xs={4} m={1}>
            <Avatar
              src={`http://127.0.0.1:8000${doctor.profile_photo}`}
              sx={{ width: 80, height: 80, margin: "auto", cursor: "pointer" }}
              onClick={handleOpenImage}
            />
          </Grid>
          <Grid item xs={7}>
            <Typography variant="h6" component="div">
              {doctor.name}
            </Typography>
            <Typography color="text.secondary">{doctor.specialty}</Typography>
          </Grid>
        </Grid>
        <Box mt={2} px={2} pb={2}>
          <Typography variant="body2" color="text.secondary">
            <strong>الرقم القومي:</strong> {doctor.national_id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>رقم الهاتف:</strong> {doctor.phone_number}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>الدرجة العلمية:</strong> {doctor.scientific_degree}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>الراتب الثابت:</strong> {doctor.fixed_salary} جنيه
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>تاريخ التعيين:</strong>{" "}
            {new Date(doctor.hire_date).toLocaleDateString("ar-EG")}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            <strong>أيام العمل:</strong>
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
      <Modal
        open={openImage}
        onClose={handleCloseImage}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <img
            src={`http://127.0.0.1:8000${doctor.profile_photo}`}
            alt="Doctor Profile"
            style={{ maxWidth: "100%", maxHeight: "80vh" }}
          />
        </Box>
      </Modal>
    </StyledCard>
  );
};

const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':').slice(0, 2).map(Number);
  const period = hours >= 12 ? 'م' : 'ص';
  const adjustedHours = hours % 12 || 12; // Use modulo for conversion, special case for 0 to show as 12
  const formattedMinutes = minutes.toString().padStart(2, '0'); // Ensure minutes are two digits

  return `${adjustedHours}:${formattedMinutes} ${period}`;
};

export default DoctorIdCard;