"use client";

import { getUserById, login } from "@/api/common";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
} from "@mui/material";
import { ChangeEvent, useCallback, useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useFormik } from "formik";
import { AxiosError } from "axios";
import { STORAGE, useLocalStorageStore } from "@/store";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import { useCommonStore } from "@/store/commonStore";
import { useShallow } from "zustand/react/shallow";

const signInSchema = Yup.object().shape({
  email: Yup.string().email("Email must be valid").required("Required"),
  password: Yup.string()
    .min(6, "Password must be longer than 6 characters")
    .required("Required"),
});

export default function LoginPage() {
  const { push } = useRouter();
  const [error, setError] = useState<string>();
  const { fetchUserById, user } = useCommonStore(useShallow((state) => state));

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validateOnChange: true,
    validationSchema: signInSchema,
    onSubmit: (values) => {
      login(values)
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
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleChange}
            value={formik.values.email}
            error={!!(formik.touched.email && formik.errors.email)}
            helperText={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : null
            }
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
            value={formik.values.password}
            error={!!(formik.touched.password && formik.errors.password)}
            helperText={
              formik.touched.password && formik.errors.password
                ? formik.errors.password
                : null
            }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={formik.isSubmitting}
          >
            Sign In
          </Button>

          {error && (
            <Typography component="p" variant="button" color="error">
              {error}
            </Typography>
          )}

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/registration" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
