"use client";

import { createField, deleteFieldById } from "@/api/common";
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
import { ChangeEvent, useCallback, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCommonStore } from "@/store/commonStore";
import { useShallow } from "zustand/react/shallow";
import DeleteIcon from "@mui/icons-material/Delete";

const createFieldSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
});

export default function FieldsPage() {
  const [error, setError] = useState<string>();
  const { fetchFields, fields } = useCommonStore(useShallow((state) => state));

  const formik = useFormik({
    initialValues: {
      title: "",
    },
    validateOnChange: true,
    validationSchema: createFieldSchema,
    onSubmit: async (values, { resetForm }) => {
      await createField(values);
      await fetchFields();

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

  const handleDeleteField = useCallback(
    async (id: string) => {
      await deleteFieldById(id);
      fetchFields();
    },
    [fetchFields]
  );

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
            <Typography component="h1" variant="h5">
              Create field
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
                label="Field title"
                name="title"
                autoComplete="field-title"
                autoFocus
                onChange={handleChange}
                value={formik.values.title}
                error={!!(formik.touched.title && formik.errors.title)}
                helperText={
                  formik.touched.title && formik.errors.title
                    ? formik.errors.title
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
                submit
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
            {fields?.map(({ title, _id }) => (
              <ListItem
                key={_id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteField(_id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={title} />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Container>
  );
}
