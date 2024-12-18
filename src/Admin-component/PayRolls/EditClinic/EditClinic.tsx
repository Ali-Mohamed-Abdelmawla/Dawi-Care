// EditClinicPresentation.tsx
import React from "react";
import {
  Box,
  Typography,
  useTheme,
  Grid,
  TextField,
  Button,
  IconButton,
  FormControl,
  FormHelperText,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Add, Remove } from "@mui/icons-material";
import {
  useFieldArray,
  Control,
  UseFormRegister,
  Controller,
} from "react-hook-form";
import {
  EditClinicFormData,
  EditClinicPresentationProps,
} from "../ClinicsInterfaces";

interface CustomEditClinicPresentationProps extends EditClinicPresentationProps {
  control: Control<EditClinicFormData>;
  register: UseFormRegister<EditClinicFormData>;
}

const EditClinicPresentation: React.FC<CustomEditClinicPresentationProps> = ({
  loading,
  control,
  onSubmit,
}) => {
  const theme = useTheme();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "service",
  });

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        pb={1}
        sx={{ borderBottom: 1, borderColor: theme.palette.divider }}
      >
        تعديل عيادة
      </Typography>
      <Box component="form" onSubmit={onSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="clinicName"
              control={control}
              rules={{ required: "اسم العيادة مطلوب" }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <TextField
                    {...field}
                    label="اسم العيادة"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                  {error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>
          {fields.map((field, index) => (
            <Grid
              item
              xs={12}
              key={field.id}
              container
              spacing={2}
              alignItems="center"
            >
              <Grid item xs={5}>
                <Controller
                  name={`service.${index}.name` as const}
                  control={control}
                  rules={{ required: "اسم الخدمة مطلوب" }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error}>
                      <TextField
                        {...field}
                        label="اسم الخدمة"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                      {error && <FormHelperText>{error.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={5}>
                <Controller
                  name={`service.${index}.price` as const}
                  control={control}
                  rules={{ required: "تكلفة الخدمة مطلوبة" }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error}>
                      <TextField
                        {...field}
                        label="تكلفة الخدمة"
                        type="number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                      {error && <FormHelperText>{error.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton 
                  onClick={() => remove(index)} 
                  color="error"
                  disabled={fields.length === 1}
                >
                  <Remove />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              startIcon={<Add />}
              onClick={() => append({ name: "", price: "" })}
            >
              إضافة خدمة
            </Button>
          </Grid>
          <Grid item xs={12}>
            <LoadingButton
              loading={loading}
              loadingPosition="end"
              endIcon={<Add />}
              type="submit"
              variant="contained"
              color="primary"
            >
              حفظ التعديلات
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default EditClinicPresentation;