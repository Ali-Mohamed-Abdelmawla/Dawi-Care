// EditEmployeeForm.tsx
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { EmployeeFormData, EditEmployeeFormProps } from "../employeeInterfaces";
import { useFormValidation } from "../useFormValidation";
import Select from 'react-select'
import { workingDaysOptions } from "../EmployeeUtils";

const EditEmployeeForm: React.FC<EditEmployeeFormProps> = ({
  employee,
  onSubmit,
  onBack,
  formLoading
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<EmployeeFormData>({
    defaultValues: employee,
  });

  useEffect(() => {

    if (employee) {
      setValue("name", employee.name);
      setValue("national_id", employee.national_id);
      setValue("phone_number", employee.phone_number);
      setValue("fixed_salary", employee.fixed_salary);
      setValue("description", employee.description);
      setValue("overtime_salary", employee.overtime_salary);
      console.log(employee);

    }
  }, [employee, setValue]);
  const {
    validateNationalId,
    validatePhoneNumber,
    validateSalary,
  } = useFormValidation();

  const onFormSubmit = (data: EmployeeFormData) => {
    onSubmit(data);
  };

  return (
    <>
      <Box sx={{ maxWidth: 800, margin: "auto", padding: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
          <IconButton onClick={onBack} sx={{ marginRight: 1 }}>
            <ArrowForwardIcon />
          </IconButton>
          <Typography variant="h4">تعديل بيانات الموظف</Typography>
        </Box>


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
                name="description"
                control={control}
                rules={{ required: "التوصيف الوظيفي مطلوب" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="التوصيف الوظيفي"
                    fullWidth
                    error={!!errors.description}
                    helperText={errors.description?.message}
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

            
            {/* <Grid item xs={12} sm={6}>
              <Controller
                name="overtime_salary"
                control={control}
                rules={{ validate: validateSalary }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="راتب الساعات الاضافيه"
                    fullWidth
                    error={!!errors.overtime_salary}
                    helperText={errors.overtime_salary?.message}
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
              تحديث بيانات الموظف
            </LoadingButton>
          </Box>
        </form>
      </Box>

    </>
  );
};

export default EditEmployeeForm;
