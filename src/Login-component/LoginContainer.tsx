import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useLogin from "./useLoginApi";
import LoginForm from "./LoginForm";
import { Container, Box, Alert } from "@mui/material";

import { LoginFormInputs } from "./LoginInterfaces";

const LoginContainer: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  const { loading, error, login } = useLogin();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const responseData = await login(data);
    if (responseData !== "error") {
      if (responseData.data.role === "admin") {
        navigate("/SystemAdmin", {
          state: { adminData: responseData.data },
        });
      }
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <LoginForm
          register={register}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          loading={loading}
        />
        {error && <Alert severity="error">{error}</Alert>}
      </Container>
    </Box>
  );
};

export default LoginContainer;
