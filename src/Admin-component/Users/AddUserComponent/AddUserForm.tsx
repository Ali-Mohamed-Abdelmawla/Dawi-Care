import { useState } from "react";
import {
  Control,
  Controller,
  UseFormHandleSubmit,
  useWatch,
} from "react-hook-form";
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Typography,
  Grid,
  FormControl,
  FormHelperText,
  useTheme,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import AddBoxTwoToneIcon from "@mui/icons-material/AddBoxTwoTone";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { UserFormData, AddUserFormProps } from "./AddUserInterfaces";

interface CustomAddUserFormProps extends AddUserFormProps {
  control: Control<UserFormData>;
  handleSubmit: UseFormHandleSubmit<UserFormData>;
}

const AddUserForm: React.FC<CustomAddUserFormProps> = ({
  control,
  handleSubmit,
  onSubmit,
  loading,
}) => {
  const theme = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const password = useWatch({ control, name: "password", defaultValue: "" });

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        pb={1}
        sx={{ borderBottom: 1, borderColor: theme.palette.dividerColor.main }}
      >
        إضافة مستخدم
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Name Field */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: "الاسم مطلوب" }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <TextField
                    {...field}
                    label="الاسم"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                  {error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>

          {/* Email Field */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: "البريد الالكتروني مطلوب",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "يجب إدخال بريد إلكتروني صالح",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <TextField
                    {...field}
                    label="البريد الالكتروني"
                    type="email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                  {error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>

          {/* Password Field */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: "كلمة المرور مطلوبة",
                minLength: {
                  value: 8,
                  message: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل",
                },
                validate: {
                  hasLowerCase: (value) =>
                    /[a-z]/.test(value) ||
                    "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل",
                  hasUpperCase: (value) =>
                    /[A-Z]/.test(value) ||
                    "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل",
                  hasNumber: (value) =>
                    /\d/.test(value) ||
                    "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل",
                  hasSpecialChar: (value) =>
                    /[@$!%*?&]/.test(value) ||
                    "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل (@$!%*?&)",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <TextField
                    {...field}
                    label="كلمة المرور"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>

          {/* Confirm Password Field */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="confirm_password"
              control={control}
              defaultValue=""
              rules={{
                required: "تأكيد كلمة المرور مطلوب",
                validate: (value) =>
                  value === password || "كلمات المرور غير متطابقة",
              }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <TextField
                    {...field}
                    label="تأكيد كلمة المرور"
                    type={showConfirmPassword ? "text" : "password"}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
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
          <span>إضافة المستخدم</span>
        </LoadingButton>
      </form>
    </Box>
  );
};

export default AddUserForm;
