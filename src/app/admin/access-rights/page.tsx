"use client";

import {
  User,
  createField,
  deleteFieldById,
  getUsers,
  updateUserRole,
} from "@/api/common";
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
  List,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCommonStore } from "@/store/commonStore";
import { useShallow } from "zustand/react/shallow";
import DeleteIcon from "@mui/icons-material/Delete";

const createFieldSchema = Yup.object().shape({
  email: Yup.string().email("Невалідна пошта").required("Обов'язкове поле"),
});

export default function AccessRights() {
  const [error, setError] = useState<string>();
  const [users, setUsers] = useState<User[]>();

  const { user } = useCommonStore(useShallow((state) => state));

  const updateUsersList = useCallback(async () => {
    const { data } = await getUsers();

    const excludeCurrentAdmin = data?.filter(
      ({ _id, roles }) => _id !== user?._id && roles.includes("ADMIN")
    );

    setUsers(excludeCurrentAdmin);
  }, [user?._id]);

  const handleSetUserRole = useCallback(
    async (id: string, role: string) => {
      await updateUserRole(id, role);
      await updateUsersList();
    },
    [updateUsersList]
  );

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validateOnChange: true,
    validationSchema: createFieldSchema,
    onSubmit: async (values, { resetForm }) => {
      await handleSetUserRole(values.email, "ADMIN");
      resetForm();
    },
  });

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      error && setError(undefined);
      formik.handleChange(e);
    },
    [formik, error]
  );

  useEffect(() => {
    updateUsersList();
  }, [updateUsersList]);

  return (
    <Container component="main" maxWidth="md" sx={{ marginTop: "48px" }}>
      <Grid container spacing={4}>
        <CssBaseline />

        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5" textAlign="center">
              Видача прав адміністрування користувачам за поштою
            </Typography>
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              noValidate
              sx={{ mt: 1, width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                label="Пошта"
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={formik.isSubmitting}
              >
                Видати права
              </Button>

              {error && (
                <Typography component="p" variant="button" color="error">
                  {error}
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <List sx={{ padding: 0 }}>
            {users?.map(({ name, surname, email, _id }) => (
              <ListItem
                key={_id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleSetUserRole(email, "USER")}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${name} ${surname}`}
                  secondary={email}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Container>
  );
}
