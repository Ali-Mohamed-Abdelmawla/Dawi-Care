// AddEmployeeForm.tsx

import React from "react";
import { Control, Controller, UseFormHandleSubmit } from "react-hook-form";
import { TextField, Box, Typography, Grid, useTheme } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import AddBoxTwoToneIcon from "@mui/icons-material/AddBoxTwoTone";
import { EmployeeFormData , AddEmployeeFormProps } from "./AddEmployeeInterfaces";
import Select from "react-select";
import { workingDaysOptions } from "../EmployeeUtils";

interface CustomAddEmployeeFormProps extends AddEmployeeFormProps {
  control: Control<EmployeeFormData>;
  handleSubmit: UseFormHandleSubmit<EmployeeFormData>;
}


const AddEmployeeForm: React.FC<CustomAddEmployeeFormProps> = ({
  control,
  handleSubmit,
  onSubmit,
  loading,
}) => {
  const theme = useTheme();
  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        pb={1}
        sx={{ borderBottom: 1, borderColor: theme.palette.dividerColor.main }}
      >
        إضافة موظف
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
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
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              rules={{ required: "التوصيف الوظيفي مطلوبة" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="التوصيف الوظيفي"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
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
                />
              )}
            />
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <Controller
              name="overtime_salary"
              control={control}
              rules={{
                required: "راتب الساعات الاضافيه مطلوب",
                pattern: {
                  value: /^\d+$/,
                  message: "يجب إدخال أرقام فقط",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="راتب الساعات الاضافيه"
                  type="text"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid> */}

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
        </Grid>

        <LoadingButton
          endIcon={<AddBoxTwoToneIcon />}
          loading={loading}
          loadingPosition="end"
          variant="contained"
          type="submit"
          sx={{ mt: 2 }}
        >
          <span>إضافة الموظف</span>
        </LoadingButton>
      </form>
    </Box>
  );
};

export default AddEmployeeForm;
