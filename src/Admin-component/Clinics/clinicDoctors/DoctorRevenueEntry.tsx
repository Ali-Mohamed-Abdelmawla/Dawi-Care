// DoctorRevenueEntry.tsx
import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Box } from '@mui/material';
import { DoctorRevenueEntryProps } from '../ClinicsInterfaces';
import { StyledModal, StyledPaper } from '../StyledClinicsComponents';




export const DoctorRevenueEntry: React.FC<DoctorRevenueEntryProps> = ({ doctor, onSave, open, onClose }) => {
  const [totalRevenue, setTotalRevenue] = useState<string>('');
  const [doctorShare, setDoctorShare] = useState<string>('');
  const [centerShare, setCenterShare] = useState<string>('');

  const handleSave = () => {
    onSave(
      doctor.id,
      parseFloat(totalRevenue),
      parseFloat(doctorShare),
      parseFloat(centerShare)
    );
    onClose();
  };

  return (
    <StyledModal open={open} onClose={onClose}>
      <StyledPaper elevation={3}>
        <Typography variant="h6" gutterBottom>
          إدخال بيانات الإيرادات للدكتور {doctor.name}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="الإيراد الكلي"
              type="number"
              value={totalRevenue}
              onChange={(e) => setTotalRevenue(e.target.value)}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="حصة الطبيب"
              type="number"
              value={doctorShare}
              onChange={(e) => setDoctorShare(e.target.value)}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="حصة المركز الطبي"
              type="number"
              value={centerShare}
              onChange={(e) => setCenterShare(e.target.value)}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button variant="contained" color="primary" onClick={handleSave} style={{ marginLeft: '10px' }}>
                حفظ
              </Button>
              <Button variant="outlined" onClick={onClose}>
                إلغاء
              </Button>
            </Box>
          </Grid>
        </Grid>
      </StyledPaper>
    </StyledModal>
  );
};