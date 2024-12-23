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
import Select, {
  components,
  StylesConfig,
  ActionMeta,
  MultiValue,
  OptionProps,
} from "react-select";
import LoadingButton from "@mui/lab/LoadingButton";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DownloadIcon from "@mui/icons-material/Download";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import { DoctorFormData, EditDoctorFormProps } from "../doctorInterfaces";
import { workingDaysOptions } from "../doctorUtils";
import { NewClinic } from "../../PayRolls/ClinicsInterfaces";
import { useFormValidation } from "../useFormValidation";
import dayjs from "../../../dateConfig";
import { DayOption } from "../doctorInterfaces";


const styles: StylesConfig<DayOption, true> = {
  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, backgroundColor: "#e0e0e0" } : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, fontWeight: "bold", color: "#333", paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: "none" } : base;
  },
};

const Option = ({ children, ...props }: OptionProps<DayOption, true>) => {
  const isSelected = props.isSelected;
  const isFixed = props.data.isFixed;

  return (
    <components.Option {...props}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {children}
        {isSelected && isFixed && (
          <span style={{ fontSize: "0.8em", color: "#666" }}>(يوم أصلي)</span>
        )}
      </div>
    </components.Option>
  );
};

const orderOptions = (values: readonly DayOption[]) => {
  return values
    .filter((v) => v.isFixed)
    .concat(values.filter((v) => !v.isFixed));
};

//first-commit
const EditDoctorForm: React.FC<EditDoctorFormProps> = ({
  clinics,
  doctor,
  onSubmit,
  onBack,
  profileImageUrl,
  unionRegistrationUrl,
  formLoading,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<DoctorFormData>({
    defaultValues: doctor,
  });

  // Convert week_days to working_days format with IDs
  const originalDays = doctor.week_days.map((weekDay) => ({
    value: weekDay.day || weekDay.switch_day || "",
    label: weekDay.day || weekDay.switch_day || "",
    isFixed: true,
    id: weekDay.id,
  }));

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
    setValue("working_days", originalDays);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedDays) {
      const updatedWorkingHours = { ...doctor.working_hours };

      // Handle working hours for both fixed and new days
      selectedDays.forEach((day: DayOption) => {
        if (day.isFixed) {
          // For fixed days, maintain original time
          const existingTime = doctor.week_days.find(
            (wd) => wd.id === day.id
          )?.date;
          if (existingTime) {
            const [hours, minutes] = existingTime.split(":");
            updatedWorkingHours[day.value] = {
              start: dayjs().hour(parseInt(hours)).minute(parseInt(minutes)),
            };
          }
        } else if (!updatedWorkingHours[day.value]) {
          // For new days, initialize with null time
          updatedWorkingHours[day.value] = { start: null };
        }
      });

      setValue("working_hours", updatedWorkingHours);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDays, setValue]);

  const [currentProfileImage, setCurrentProfileImage] =
    useState<string>(profileImageUrl);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleWorkingDaysChange = (
    newValue: MultiValue<DayOption>,
    actionMeta: ActionMeta<DayOption>
  ) => {
    switch (actionMeta.action) {
      case "remove-value":
      case "pop-value":
        if (actionMeta.removedValue.isFixed) {
          return; // Prevent removal of fixed days
        }
        break;
      case "clear":
        newValue = selectedDays.filter((v: DayOption) => v.isFixed);
        break;
    }

    setValue("working_days", orderOptions(newValue));
  };

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
              render={({ field: { onChange }, fieldState: { error } }) => (
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
              render={({ field: { onChange }, fieldState: { error } }) => (
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
                  type="number"
                  inputProps={{ step: "0.01" }}
                  error={!!errors.fixed_salary}
                  helperText={errors.fixed_salary?.message}
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
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="clinic_id"
              control={control}
              rules={{ required: "التخصص مطلوب" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={clinics.map((clinic: NewClinic) => ({
                    label: clinic?.name,
                    value: String(clinic?.id),
                  }))}
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
              defaultValue={originalDays}
              rules={{ required: "أيام العمل مطلوبة" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={workingDaysOptions}
                  isMulti
                  styles={styles}
                  placeholder="اختر أيام العمل"
                  components={{ MultiValue: components.MultiValue, Option }}
                  value={field.value}
                  onChange={handleWorkingDaysChange}
                  isClearable={selectedDays?.some((v: DayOption) => !v.isFixed)}
                />
              )}
            />
          </Grid>

          {selectedDays &&
            selectedDays.map((day: DayOption, Index: number) => (
              <Grid item xs={12} sm={12} md={6} key={day.value}>
                <Box sx={{ mb: 2 }}>
                  <Controller
                    name={`working_days.${Index}`}
                    control={control}
                    defaultValue={day}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={workingDaysOptions.filter(
                          (option) =>
                            !selectedDays.some(
                              (d) =>
                                d.value === option.value &&
                                d.value !== day.value
                            )
                        )}
                        // isDisabled={day.isOriginal}
                        value={workingDaysOptions.find(
                          (option) => option.value === day.value
                        )}
                        onChange={(newDay) => {
                          if (newDay) {
                            // Update working_days array
                            const updatedDays = selectedDays.map((d) =>
                              d.value === day.value
                                ? {
                                    ...d,
                                    value: newDay.value,
                                    label: newDay.label,
                                  }
                                : d
                            );
                            setValue("working_days", updatedDays);

                            // Move time to new day key in working_hours
                            const currentTime = getValues(
                              `working_hours.${day.value}.start`
                            );
                            const updatedHours = {
                              ...getValues("working_hours"),
                            };
                            delete updatedHours[day.value];
                            updatedHours[newDay.value] = { start: currentTime };
                            setValue("working_hours", updatedHours);
                          }
                        }}
                      />
                    )}
                  />
                </Box>
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
                      <Box sx={{ width: "100%" }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {`وقت بدء العمل ليوم ${day.label}`}
                        </Typography>
                        <StaticTimePicker
                          value={field.value}
                          onChange={(newValue) => field.onChange(newValue)}
                          slotProps={{
                            actionBar: { actions: [] },
                          }}
                          ampm={false}
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
            loading={formLoading}
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
              boxShadow: 15,
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
