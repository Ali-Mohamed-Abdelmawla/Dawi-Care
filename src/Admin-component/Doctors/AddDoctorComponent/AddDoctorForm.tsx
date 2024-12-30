// AddDoctorForm.tsx

import React from "react";
import {
  Control,
  Controller,
  UseFormHandleSubmit,
  useWatch,
} from "react-hook-form";
import {
  TextField,
  Box,
  Typography,
  Grid,
  Modal,
  Fade,
  Backdrop,
  useTheme,
  InputAdornment,
} from "@mui/material";
import Select from "react-select";
import LoadingButton from "@mui/lab/LoadingButton";
import AddBoxTwoToneIcon from "@mui/icons-material/AddBoxTwoTone";

import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { DoctorFormData } from "./types";
import { workingDaysOptions } from "./constants";
import { validateFileSize, validateFileType } from "./utils";

import { NewClinic } from "../../PayRolls/ClinicsInterfaces";
import AvatarUpload from "../../../helper/AvatarUpload/AvatarUpload";

interface AddDoctorFormProps {
  clinics: NewClinic[];
  control: Control<DoctorFormData>;
  handleSubmit: UseFormHandleSubmit<DoctorFormData>;
  onSubmit: (data: DoctorFormData) => void;
  loading: boolean;
  profileImageUrl: string | null;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  openModal: boolean;
  handleProfileImageChange: (file: File) => void;
}

const AddDoctorForm: React.FC<AddDoctorFormProps> = ({
  clinics,
  control,
  handleSubmit,
  onSubmit,
  loading,
  profileImageUrl,
  handleCloseModal,
  openModal,
  handleProfileImageChange,
}) => {
  const theme = useTheme();

  const selectedDays = useWatch({
    control,
    name: "working_days",
  });

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: "auto",
        padding: 3,
        ".muirtl-14s5rfu-MuiFormLabel-root-MuiInputLabel-root": { zIndex: "0" },
        ".muirtl-1u21k29-MuiPickersLayout-root": {
          border: "1px solid #00000024",
          padding: "15px",
          borderRadius: "6px",
          backgroundColor: "#bee9e8",
        },
        ".muirtl-2x8kvt-MuiPickersArrowSwitcher-root-MuiTimeClock-arrowSwitcher":
          {
            left: "5px",
            top: "5px",
          },
        ".muirtl-1wniyei-MuiTypography-root": {
          backgroundColor: "#bee9e8",
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #00000024",
        },
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        pb={1}
        sx={{ borderBottom: 1, borderColor: theme.palette.dividerColor.main }}
      >
        إضافة طبيب
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <AvatarUpload<DoctorFormData>
              name="profile_photo"
              control={control}
              currentImageUrl={profileImageUrl}
              onFileChange={handleProfileImageChange}
              rules={{
                required: "الصورة الشخصية مطلوبة",
                validate: {
                  fileSize: validateFileSize,
                  fileType: (file: File) =>
                    validateFileType(file, [
                      "image/jpeg",
                      "image/png",
                      "image/jpg",
                    ]),
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: "الاسم مطلوب" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="الاسم"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="national_id"
              control={control}
              rules={{
                required: "الرقم القومي مطلوب",
                pattern: {
                  value: /^\d+$/,
                  message: "يجب إدخال أرقام فقط",
                },
                minLength: {
                  value: 14,
                  message: "الرقم القومي يجب أن يكون 14 رقمًا",
                },
                maxLength: {
                  value: 14,
                  message: "الرقم القومي يجب أن يكون 14 رقمًا",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="الرقم القومي"
                  type="text"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="phone_number"
              control={control}
              rules={{
                required: "رقم الهاتف مطلوب",
                pattern: {
                  value: /^\d+$/,
                  message: "يجب إدخال أرقام فقط",
                },
                minLength: {
                  value: 11,
                  message: "أدخل رقم هاتف صالح (11-15 رقمًا)",
                },
                maxLength: {
                  value: 15,
                  message: "أدخل رقم هاتف صالح (11-15 رقمًا)",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="رقم الهاتف"
                  type="text"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="union_registration"
              control={control}
              defaultValue={null}
              rules={{
                required: "تسجيل النقابة مطلوب",
                validate: {
                  fileType: (file) =>
                    validateFileType(file, [
                      "image/jpeg",
                      "image/png",
                      "image/jpg",
                      "application/pdf",
                    ]),
                },
              }}
              render={({ field: { onChange }, fieldState: { error } }) => (
                <TextField
                  type="file"
                  onChange={(e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files && files[0]) {
                      onChange(files[0]);
                    }
                  }}
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                  label="تسجيل النقابة"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="scientific_degree"
              control={control}
              defaultValue=""
              rules={{ required: "الدرجة العلمية مطلوبة" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="الدرجة العلمية"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="fixed_salary"
              control={control}
              rules={{
                required: "الراتب الثابت مطلوب",
                pattern: {
                  value: /^\d+$/,
                  message: "يجب إدخال أرقام فقط",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="الراتب الثابت"
                  type="text"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="doctor_share"
              control={control}
              rules={{
                required: "نسبة الطبيب مطلوبة",
                pattern: {
                  value: /^\d+$/,
                  message: "يجب إدخال أرقام فقط",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="حصة الطبيب من كشوفات العياده"
                  type="text"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <div> % </div>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="clinic_id"
              control={control}
              rules={{ required: "التخصص مطلوب" }}
              render={({ field, fieldState: { error } }) => (
                <Box>
                  <Select
                    {...field}
                    options={clinics?.map((clinic: NewClinic) => ({
                      label: clinic.name,
                      value: String(clinic.id),
                    }))}
                    placeholder="اختر التخصص"
                  />
                  {error && (
                    <Typography color="error">{error.message}</Typography>
                  )}
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="working_days"
              control={control}
              rules={{ required: "أيام العمل مطلوبة" }}
              render={({ field, fieldState: { error } }) => (
                <Box>
                  <Select
                    {...field}
                    options={workingDaysOptions}
                    isMulti
                    placeholder="اختر أيام العمل"
                  />
                  {error && (
                    <Typography color="error">{error.message}</Typography>
                  )}
                </Box>
              )}
            />
          </Grid>

          {selectedDays &&
            selectedDays.map((day) => (
              <Grid item xs={12} sm={6} key={day.value}>
                <Controller
                  name={`working_hours.${day.value}.start`}
                  control={control}
                  defaultValue={null} // Set default value here
                  rules={{ required: `وقت بدء العمل ليوم ${day.label} مطلوب` }}
                  render={({ field, fieldState: { error } }) => (
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="ar"
                    >
                      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Box sx={{ width: "100%" }}>
                          <Typography variant="subtitle1" gutterBottom>
                            {`وقت بدء العمل ليوم ${day.label}`}
                          </Typography>
                          <StaticTimePicker
                            value={field.value}
                            onChange={(newValue) => field.onChange(newValue)}
                            slotProps={{
                              actionBar: {
                                actions: [], // This removes all action buttons
                              },
                            }}
                            ampm={false}
                          />
                          {error && (
                            <Typography color="error" variant="caption">
                              {error.message}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    </LocalizationProvider>
                  )}
                />
              </Grid>
            ))}
        </Grid>

        <LoadingButton
          endIcon={<AddBoxTwoToneIcon />}
          loading={loading}
          loadingPosition="end"
          variant="contained"
          type="submit"
          sx={{ mt: 2 }}
        >
          <span>إضافة الطبيب</span>
        </LoadingButton>
      </form>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 15,
              p: 4,
            }}
          >
            {profileImageUrl && (
              <img
                src={profileImageUrl}
                alt="صورة الطبيب"
                style={{ maxWidth: "100%", maxHeight: "80vh" }}
              />
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default AddDoctorForm;
