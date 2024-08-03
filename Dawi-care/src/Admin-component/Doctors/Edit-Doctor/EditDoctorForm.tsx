// EditDoctorForm.tsx

import React, { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import {
  TextField,
  Box,
  Typography,
  Grid,
  Modal,
  Fade,
  Backdrop,
  Button,
} from "@mui/material";
import Select from "react-select";
import LoadingButton from "@mui/lab/LoadingButton";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DownloadIcon from "@mui/icons-material/Download";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import { DoctorFormData, EditDoctorFormProps } from "../doctorInterfaces";
import { specialtyOptions, workingDaysOptions } from "../doctorUtils";
import { useFormValidation } from "../useFormValidation";

 //first-commit
const EditDoctorForm: React.FC<EditDoctorFormProps> = ({
  doctor,
  onSubmit,
  onBack,
  profileImageUrl,
  unionRegistrationUrl,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DoctorFormData>({
    defaultValues: doctor,
  });

  const selectedDays = useWatch({
    control,
    name: "working_days",
  });

  const {
    validateNationalId,
    validatePhoneNumber,
    validateSalary,
    validateFileSize,
    validateFileType,
  } = useFormValidation();

  useEffect(() => {
    setValue("profile_photo", doctor.profile_photo);
    setValue("union_registration", doctor.union_registration);
  }, []);
  useEffect(() => {
    if (selectedDays) {
      const updatedWorkingHours = { ...doctor.working_hours };

      // Remove hours for deselected days
      Object.keys(updatedWorkingHours).forEach((day) => {
        console.log(updatedWorkingHours);
        if (!selectedDays.some((selectedDay) => selectedDay.value === day)) {
          delete updatedWorkingHours[day];
        }
      });

      // Add default hours for newly selected days
      selectedDays.forEach((day) => {
        if (!updatedWorkingHours[day.value]) {
          updatedWorkingHours[day.value] = { start: null };
        }
      });

      console.log(doctor);
      setValue("working_hours", updatedWorkingHours);
    }
  }, [selectedDays, setValue, doctor.working_hours]);

  const [currentProfileImage, setCurrentProfileImage] =
    useState<string>(profileImageUrl);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const onFormSubmit = (data: DoctorFormData) => {
    onSubmit(data);
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: "auto",
        padding: 3,
        ".muirtl-14s5rfu-MuiFormLabel-root-MuiInputLabel-root": { zIndex: "0" },
        ".muirtl-2x8kvt-MuiPickersArrowSwitcher-root-MuiTimeClock-arrowSwitcher":
          {
            left: "5px",
            top: "5px",
          },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
        <Button onClick={onBack} startIcon={<ArrowForwardIcon />}>
          رجوع
        </Button>
        <Typography variant="h4" sx={{ ml: 2 }}>
          تعديل بيانات الطبيب
        </Typography>
      </Box>

      {currentProfileImage && (
        <Box
          sx={{ position: "relative", cursor: "pointer" }}
          onClick={handleOpenModal}
        >
          <Box
            component="img"
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: 2,
            }}
            alt="صورة الطبيب"
            src={currentProfileImage}
          />
        </Box>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "الاسم مطلوب" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="الاسم"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="national_id"
              control={control}
              rules={{ validate: validateNationalId }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="الرقم القومي"
                  fullWidth
                  error={!!errors.national_id}
                  helperText={errors.national_id?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="phone_number"
              control={control}
              rules={{ validate: validatePhoneNumber }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="رقم الهاتف"
                  fullWidth
                  error={!!errors.phone_number}
                  helperText={errors.phone_number?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="profile_photo"
              control={control}
              rules={{
                validate: (value) => {
                  if (typeof value === "string") return true; // Existing file, no validation needed
                  if (!value) return true; // No file selected, no validation needed

                  // Check file size
                  const sizeValidation = validateFileSize(value);
                  if (sizeValidation !== true) return sizeValidation; // Return error message if size validation fails

                  // Check file type
                  return validateFileType(value, [
                    "image/jpeg",
                    "image/png",
                    "image/jpg",
                  ]);
                },
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  type="file"
                  onChange={(e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files && files[0]) {
                      onChange(files[0]);
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const result = e.target?.result as string;
                        setCurrentProfileImage(result);
                      };
                      reader.readAsDataURL(files[0]);
                    }
                  }}
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                  label="الصورة الشخصية"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="union_registration"
              control={control}
              rules={{
                validate: (value) => {
                  if (typeof value === "string") return true; // Existing file, no validation needed
                  if (!value) return true; // No file selected, no validation needed
                  return validateFileType(value, [
                    "image/jpeg",
                    "image/png",
                    "image/jpg",
                    "application/pdf",
                  ]);
                },
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    type="file"
                    onChange={(e) => {
                      const files = (e.target as HTMLInputElement).files;
                      if (files && files[0]) {
                        onChange(files[0]);
                      }
                    }}
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                    InputLabelProps={{ shrink: true }}
                    label="تسجيل النقابة"
                  />
                  {unionRegistrationUrl && (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<DownloadIcon />}
                      onClick={() =>
                        window.open(unionRegistrationUrl, "_blank")
                      }
                      sx={{ mt: 1 }}
                    >
                      تحميل ملف تسجيل النقابة
                    </Button>
                  )}
                </>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="scientific_degree"
              control={control}
              rules={{ required: "الدرجة العلمية مطلوبة" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="الدرجة العلمية"
                  fullWidth
                  error={!!errors.scientific_degree}
                  helperText={errors.scientific_degree?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="fixed_salary"
              control={control}
              rules={{ validate: validateSalary }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="الراتب الثابت"
                  fullWidth
                  error={!!errors.fixed_salary}
                  helperText={errors.fixed_salary?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="specialty"
              control={control}
              rules={{ required: "التخصص مطلوب" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={specialtyOptions}
                  placeholder="اختر التخصص"
                  value={field.value}
                  onChange={(selectedOption) => field.onChange(selectedOption)}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="working_days"
              control={control}
              rules={{ required: "أيام العمل مطلوبة" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={workingDaysOptions}
                  isMulti
                  placeholder="اختر أيام العمل"
                  value={field.value}
                  onChange={(selectedOptions) =>
                    field.onChange(selectedOptions)
                  }
                />
              )}
            />
          </Grid>

          {selectedDays &&
            selectedDays.map((day) => (
              <Grid item xs={12} sm={12} md={6} key={day.value}>
                <Controller
                  name={`working_hours.${day.value}.start`}
                  control={control}
                  defaultValue={doctor.working_hours[day.value]?.start || null}
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
                                actions: [],
                              },
                            }}
                            ampm={false}
                            // displayStaticWrapperAs="desktop"
                            sx={{
                              width: "100%",
                              maxWidth: "400px",
                              "@media (max-width: 600px)": {
                                maxWidth: "300px",
                              },
                            }}
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

        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
          <Button onClick={onBack} variant="outlined">
            رجوع
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            endIcon={<EditTwoToneIcon />}
          >
            تحديث بيانات الطبيب
          </LoadingButton>
        </Box>
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
              boxShadow: 24,
              p: 4,
            }}
          >
            {currentProfileImage && (
              <img
                src={currentProfileImage}
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

export default EditDoctorForm;
