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
  Chip,
  Link,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddCircle from "@mui/icons-material/AddCircle";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useCommonStore } from "@/store/commonStore";
import { useShallow } from "zustand/react/shallow";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { CollectionStatus, updateCollection } from "@/api/common";
import { redirect, useRouter } from "next/navigation";
import { getStatusChipColor } from "@/helpers/collections";

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

export default function CreateCollectionPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { fields, user, fetchCollections, collections } = useCommonStore(
    useShallow((state) => state)
  );
  const { push } = useRouter();

  const pageCollection = useMemo(() => {
    return collections?.find((c) => c._id === id);
  }, [id, collections]);

  const [error, setError] = useState<string>();

  const formik = useFormik<CreateCollectionForm>({
    initialValues: {
      title: pageCollection?.title || "",
      description: pageCollection?.description || "",
      field: pageCollection?.field._id || "",
      dueDate: dayjs(pageCollection?.dueDate || new Date()),
      monobankJarLink: pageCollection?.monobankJarLink || "",
      monobankJarWidgetId: pageCollection?.monobankJarWidgetId || "",
    },
    validateOnChange: true,
    validationSchema: createCollectionSchema,
    onSubmit: async ({ dueDate, ...values }, { resetForm }) => {
      if (!dueDate || !user || !pageCollection) return;

      const updatedValues = {
        dueDate: dueDate.toISOString(),
        author: user._id,
        ...values,
        ...(pageCollection.status === CollectionStatus.REJECTED
          ? { status: CollectionStatus.PENDING }
          : {}),
      };

      await updateCollection({ ...updatedValues, _id: pageCollection._id });

      await fetchCollections();

      push("/user/collections");
    },
  });

  const isEditAvailable = useMemo(
    () =>
      pageCollection?.status !== CollectionStatus.PUBLISHED &&
      pageCollection?.status !== CollectionStatus.CLOSED,
    [pageCollection?.status]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      error && setError(undefined);
      formik.handleChange(e);
    },
    [formik, error]
  );

  useEffect(() => {
    if (!user) redirect("/collections");
  }, [user]);

  if (!pageCollection) return null;

  const { status, rejectReason, _id } = pageCollection;

  return pageCollection ? (
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <Grid
            container
            alignItems={"center"}
            justifyContent={"center"}
            spacing={2}
          >
            <Grid item>
              <Chip
                label={status.toUpperCase()}
                color={getStatusChipColor(status)}
                sx={{
                  fontWeight: 700,
                  width: "fit-content",
                }}
                size="medium"
              />
            </Grid>
            {status === CollectionStatus.CLOSED && (
              <Grid item>
                <Link href={`/user/report/${_id}`}>Додати звіт</Link>
              </Grid>
            )}
          </Grid>

          {rejectReason && (
            <Typography
              component="h3"
              variant="subtitle1"
              color="error"
              sx={{ fontWeight: 700 }}
            >
              Причина відмови: {rejectReason}
            </Typography>
          )}
        </Box>
        <Typography component="h1" variant="h5">
          Оновити дані про збір
        </Typography>
        {(status === CollectionStatus.PUBLISHED ||
          status === CollectionStatus.CLOSED) && (
          <Typography
            component="h3"
            variant="subtitle1"
            sx={{ fontWeight: 700 }}
            textAlign="center"
          >
            Статус збору не дозволяє змінювати дані
          </Typography>
        )}
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
                label="Назва"
                autoFocus
                onChange={handleChange}
                value={formik.values.title}
                error={!!(formik.touched.title && formik.errors.title)}
                disabled={!isEditAvailable}
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
                  disabled={!isEditAvailable}
                  onChange={(e) => {
                    formik.handleChange(e);
                    error && setError(undefined);
                  }}
                  value={formik.values.field}
                  error={!!(formik.touched.field && formik.errors.field)}
                  required
                  label="Категорія"
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
                  disabled={!isEditAvailable}
                  sx={{ width: "100%" }}
                  label="Кінцева дата *"
                  value={formik.values.dueDate}
                  onChange={(date) => formik.setFieldValue("dueDate", date)}
                  format="DD/MM/YYYY"
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled={!isEditAvailable}
                required
                fullWidth
                minRows={5}
                maxRows={10}
                multiline
                id="description"
                label="Опис"
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
                disabled={!isEditAvailable}
                autoComplete="monobankJarLink"
                name="monobankJarLink"
                required
                fullWidth
                id="monobankJarLink"
                label="Посилання на банку mono"
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
                disabled={!isEditAvailable}
                autoComplete="monobankJarWidgetId"
                name="monobankJarWidgetId"
                required
                fullWidth
                id="monobankJarWidgetId"
                label="ID банки mono"
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
            disabled={!isEditAvailable}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Оновити збір
          </Button>
        </Box>
      </Box>
    </Container>
  ) : null;
}
