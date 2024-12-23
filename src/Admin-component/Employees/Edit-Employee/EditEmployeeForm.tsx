// EditEmployeeForm.tsx
import React, { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
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
import Select, { StylesConfig, ActionMeta, MultiValue } from "react-select";
import { workingDaysOptions } from "../EmployeeUtils";

export interface EmployeeDayOption {
  value: string;
  label: string;
  isFixed?: boolean;
  id?: number;
}

const styles: StylesConfig<EmployeeDayOption, true> = {
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

const EditEmployeeForm: React.FC<EditEmployeeFormProps> = ({
  employee,
  onSubmit,
  onBack,
  formLoading,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<EmployeeFormData>({
    defaultValues: employee,
  });

  const selectedDays = useWatch({
    control,
    name: "working_days",
  });

  useEffect(() => {
    if (employee) {
      setValue("name", employee.name);
      setValue("national_id", employee.national_id);
      setValue("phone_number", employee.phone_number);
      setValue("fixed_salary", employee.fixed_salary);
      setValue("description", employee.description);
      console.log(employee);
    }
  }, [employee, setValue]);
  const { validateNationalId, validatePhoneNumber, validateSalary } =
    useFormValidation();

  const handleWorkingDaysChange = (
    newValue: MultiValue<EmployeeDayOption>,
    actionMeta: ActionMeta<EmployeeDayOption>
  ) => {
    const currentValue = getValues("working_days");

    switch (actionMeta.action) {
      case "remove-value":
      case "pop-value":
        if (actionMeta.removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        newValue = currentValue.filter((v: EmployeeDayOption) => v.isFixed);
        break;
    }

    setValue("working_days", orderOptions(newValue));
  };

  const orderOptions = (values: readonly EmployeeDayOption[]) => {
    return values
      .filter((v) => v.isFixed)
      .concat(values.filter((v) => !v.isFixed));
  };

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

            <Grid item xs={12}>
              <Controller
                name="working_days"
                control={control}
                rules={{ required: "أيام العمل مطلوبة" }}
                render={({ field }) => (
                  <Box>
                    <Select
                      {...field}
                      options={workingDaysOptions}
                      isMulti
                      styles={styles}
                      placeholder="اختر أيام العمل"
                      onChange={handleWorkingDaysChange}
                      isClearable={field.value?.some(
                        (v: EmployeeDayOption) => !v.isFixed
                      )}
                      value={field.value}
                    />
                    {errors.working_days && (
                      <Typography color="error">
                        {errors.working_days.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />
            </Grid>
            {selectedDays &&
              selectedDays.map(
                (day: EmployeeDayOption, index: number) => (
                  (

                    <Grid item xs={12} sm={12} md={6} key={day.value}>
                      <Box sx={{ mb: 2 }}>
                        <Controller
                          name={`working_days.${index}`}
                          control={control}
                          defaultValue={day}
                          render={({ field }) => (
                            <>
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
                                value={workingDaysOptions.find(
                                  (option) => option.value === day.value
                                )}
                                onChange={(newDay) => {
                                  if (newDay) {
                                    const updatedDays = selectedDays.map(
                                      (d: EmployeeDayOption) =>
                                        d.value === day.value
                                          ? {
                                              ...d,
                                              value: newDay.value,
                                              label: newDay.label,
                                              isFixed: d.isFixed,
                                            }
                                          : d
                                    );
                                    setValue("working_days", updatedDays);
                                  }
                                }}
                              />
                              {/* <Box
                            sx={{
                              mt: 1,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={day.isFixed}
                              onChange={(e) => {
                                const updatedDays = selectedDays.map((d) =>
                                  d.value === day.value
                                    ? { ...d, isFixed: e.target.checked }
                                    : d
                                );
                                setValue("working_days", updatedDays);
                              }}
                            />
                            <Typography variant="caption" sx={{ ml: 1 }}>
                              يوم ثابت
                            </Typography>
                          </Box> */}
                            </>
                          )}
                        />
                      </Box>
                    </Grid>
                  )
                )
              )}
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
