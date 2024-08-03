// UserIdCard.tsx
import React from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { styled } from "@mui/system";
import { User } from "./userInterfaces";
import { formatDate, roles } from "./UserUtils";
interface UserIdCardProps {
  user: User;
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

const UserIdCard: React.FC<UserIdCardProps> = ({ user }) => {
  return (
    <StyledCard>
      <Header>
        <Typography variant="h5" component="div">
          بطاقة هوية المستخدم
        </Typography>
      </Header>
      <StyledCardContent>
        <Grid container spacing={0} alignItems="center">
          <Grid item xs={7} m={2}>
            <Typography variant="h6" component="div">
              {user.name}
            </Typography>
            <Typography color="text.secondary">{user.role}</Typography>
          </Grid>
        </Grid>
        <Box mt={2} ml={2} px={2} pb={2}>
          <Typography variant="body2" color="text.secondary">
            <strong>البريد الالكتروني:</strong> {user.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>تاريخ انشاء الحساب:</strong> {formatDate(user.created_at)}
          </Typography>

        </Box>
      </StyledCardContent>
    </StyledCard>
  );
};

export default UserIdCard;
