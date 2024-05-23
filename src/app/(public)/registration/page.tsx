"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import * as Yup from "yup";
import Container from "@mui/material/Container";
import { login, registration } from "@/api/common";
import { useLocalStorageStore, STORAGE } from "@/store";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useMemo } from "react";
import jwt from "jsonwebtoken";
import { useCommonStore } from "@/store/commonStore";
import { useShallow } from "zustand/react/shallow";

const signUpSchema = Yup.object().shape({
  email: Yup.string().email("Email must be valid").required("Required"),
  password: Yup.string()
    .min(6, "Password must be longer than 6 characters")
    .required("Required"),
  name: Yup.string().required("Required"),
  surname: Yup.string().required("Required"),
});

export default function RegistrationPage() {
  const { push } = useRouter();
  const [error, setError] = React.useState<string>();
  const { fetchUserById } = useCommonStore(useShallow((state) => state));

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
      surname: "",
    },
    validateOnChange: true,
    validationSchema: signUpSchema,
    onSubmit: (values) => {
      registration(values)
        .then(async ({ data: { token } }) => {
          useLocalStorageStore.getState().push(STORAGE.TOKEN, token);
          const { id } = jwt.decode(token) as { id: string };

          await fetchUserById(id);

          push("/");
        })
        .catch(
          (error: AxiosError) =>
            error.response?.request.response &&
            setError(JSON.parse(error.response?.request.response).message)
        );
    },
  });

  const { surnameError, nameError, emailError, passwordError } = useMemo(() => {
    const { email, name, surname, password } = formik.errors;

    return {
      emailError: formik.touched.email && email ? email : null,
      passwordError: formik.touched.password && password ? password : null,
      nameError: formik.touched.name && name ? name : null,
      surnameError: formik.touched.surname && surname ? surname : null,
    };
  }, [formik.errors, formik.touched]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      error && setError(undefined);
      formik.handleChange(e);
    },
    [formik, error]
  );

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={formik.handleSubmit}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="name"
                required
                fullWidth
                id="name"
                label="First Name"
                autoFocus
                error={!!nameError}
                helperText={nameError}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="surname"
                label="Last Name"
                name="surname"
                autoComplete="family-name"
                error={!!surnameError}
                helperText={surnameError}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={!!emailError}
                helperText={emailError}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                error={!!passwordError}
                helperText={passwordError}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
