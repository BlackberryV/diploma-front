"use client";

import * as React from "react";

import Grid from "@mui/material/Grid";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddCircle from "@mui/icons-material/AddCircle";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useCommonStore } from "@/store/commonStore";
import { useShallow } from "zustand/react/shallow";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { createCollection } from "@/api/common";

const createCollectionSchema = Yup.object().shape({
  field: Yup.string().required("Required"),
  title: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  monobankJarWidgetId: Yup.string().required("Required"),
  monobankJarLink: Yup.string().required("Required"),
});

interface CreateCollectionForm {
  title: string;
  description: string;
  field: string;
  dueDate: dayjs.Dayjs;
  monobankJarWidgetId: string;
  monobankJarLink: string;
}

export default function CreateCollectionPage() {
  const { fields, user, fetchCollections, collections } = useCommonStore(
    useShallow((state) => state)
  );

  const [error, setError] = useState<string>();

  const formik = useFormik<CreateCollectionForm>({
    initialValues: {
      title: "",
      description: "",
      field: "",
      dueDate: dayjs(new Date()),
      monobankJarLink: "",
      monobankJarWidgetId: "",
    },
    validateOnChange: true,
    validationSchema: createCollectionSchema,
    onSubmit: async ({ dueDate, ...values }, { resetForm }) => {
      if (!dueDate || !user) return;

      const updatedValues = {
        dueDate: dueDate.toISOString(),
        author: user._id,
        ...values,
      };

      await createCollection({ ...updatedValues, author: user._id });

      await fetchCollections();

      resetForm();
    },
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      error && setError(undefined);
      formik.handleChange(e);
    },
    [formik, error]
  );

  return (
    <Container component="main" maxWidth="xs" sx={{ marginBottom: "48px" }}>
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
          <AddCircle />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create collection
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={formik.handleSubmit}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="title"
                name="title"
                required
                fullWidth
                id="title"
                label="Title"
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
            </Grid>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                error={!!(formik.touched.field && formik.errors.field)}
              >
                <InputLabel id="demo-simple-select-label" required>
                  Collection field
                </InputLabel>
                <Select
                  labelId="project-field"
                  id="field"
                  name="field"
                  onChange={(e) => {
                    formik.handleChange(e);
                    error && setError(undefined);
                  }}
                  value={formik.values.field}
                  error={!!(formik.touched.field && formik.errors.field)}
                  required
                  label="Collection field"
                >
                  {fields?.map(({ _id, title }) => (
                    <MenuItem value={_id} key={_id}>
                      {title}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.title && formik.errors.title && (
                  <FormHelperText>{formik.errors.title}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ width: "100%" }}
                  label="Select Date *"
                  value={formik.values.dueDate}
                  onChange={(date) => formik.setFieldValue("dueDate", date)}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                minRows={5}
                maxRows={10}
                multiline
                id="description"
                label="Describe your project"
                name="description"
                autoComplete="description"
                onChange={handleChange}
                value={formik.values.description}
                error={
                  !!(formik.touched.description && formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                    ? formik.errors.description
                    : null
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="monobankJarLink"
                name="monobankJarLink"
                required
                fullWidth
                id="monobankJarLink"
                label="Monobank jar link"
                autoFocus
                onChange={handleChange}
                value={formik.values.monobankJarLink}
                error={
                  !!(
                    formik.touched.monobankJarLink &&
                    formik.errors.monobankJarLink
                  )
                }
                helperText={
                  formik.touched.monobankJarLink &&
                  formik.errors.monobankJarLink
                    ? formik.errors.monobankJarLink
                    : null
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="monobankJarWidgetId"
                name="monobankJarWidgetId"
                required
                fullWidth
                id="monobankJarWidgetId"
                label="Monobank jar id"
                autoFocus
                onChange={handleChange}
                value={formik.values.monobankJarWidgetId}
                error={
                  !!(
                    formik.touched.monobankJarWidgetId &&
                    formik.errors.monobankJarWidgetId
                  )
                }
                helperText={
                  formik.touched.monobankJarWidgetId &&
                  formik.errors.monobankJarWidgetId
                    ? formik.errors.monobankJarWidgetId
                    : null
                }
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create collection
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
