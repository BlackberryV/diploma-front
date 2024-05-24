import {
  Collection,
  CollectionStatus,
  ExtendedCollection,
  updateCollection,
} from "@/api/common";
import {
  Grid,
  Typography,
  Chip,
  Button,
  Box,
  Link,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { FC, useEffect, useMemo, useState } from "react";
import { LinearProgress, LinearProgressProps } from "@mui/material";
import * as Yup from "yup";
import * as React from "react";
import { useCommonStore } from "@/store/commonStore";
import { useShallow } from "zustand/react/shallow";
import { useFormik } from "formik";
import { getStatusChipColor } from "@/helpers/collections";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

interface ColectionPageProps {
  collection: ExtendedCollection;
  isAdmin?: boolean;
  isUser?: boolean;
}

export const CollectionPage: FC<ColectionPageProps> = ({
  collection,
  isAdmin,
  isUser,
}) => {
  const {
    dueDate,
    description,
    status,
    title,
    monobankJar,
    monobankJarLink,
    author,
    field,
    rejectReason,
  } = collection;

  const { back } = useRouter();

  const { fetchCollections } = useCommonStore(useShallow((state) => state));

  const handleStatusChange = async (
    status: CollectionStatus,
    rejectReason?: string
  ) => {
    await updateCollection({
      ...collection,
      status,
      rejectReason: rejectReason || null,
    });
    await fetchCollections();
  };

  const formik = useFormik<{ rejectReason: string }>({
    initialValues: {
      rejectReason: "",
    },
    validateOnChange: true,
    validationSchema: Yup.object().shape({
      rejectReason: Yup.string().required("Required"),
    }),
    onSubmit: async ({ rejectReason }, { resetForm }) => {
      handleStatusChange(CollectionStatus.REJECTED, rejectReason);
      resetForm();
    },
  });

  return (
    <Grid container spacing={4} marginTop={2}>
      <Grid item xs={12}>
        <Grid container display="flex" justifyContent="space-between">
          <Grid item>
            <Button variant="outlined" onClick={back}>
              Back to list
            </Button>
          </Grid>
          {isAdmin && (
            <Grid item>
              <Grid
                container
                spacing={2}
                flexDirection="column"
                alignItems="end"
              >
                {status === CollectionStatus.PUBLISHED ? (
                  <>
                    <Grid item>
                      <Button
                        variant="contained"
                        onClick={() =>
                          handleStatusChange(CollectionStatus.PENDING)
                        }
                        color="secondary"
                        sx={{
                          minWidth: "150px",
                        }}
                      >
                        unpublish
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          handleStatusChange(CollectionStatus.CLOSED)
                        }
                        color="secondary"
                        sx={{
                          minWidth: "150px",
                        }}
                      >
                        close
                      </Button>
                    </Grid>
                  </>
                ) : (
                  <>
                    {status !== CollectionStatus.REJECTED &&
                      status !== CollectionStatus.CLOSED && (
                        <Grid item>
                          <Box component="form" onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2}>
                              <Grid item>
                                <TextField
                                  autoComplete="rejectReason"
                                  name="rejectReason"
                                  required
                                  fullWidth
                                  id="rejectReason"
                                  label="Reject reason"
                                  autoFocus
                                  size="small"
                                  onChange={formik.handleChange}
                                  value={formik.values.rejectReason}
                                  error={
                                    !!(
                                      formik.touched.rejectReason &&
                                      formik.errors.rejectReason
                                    )
                                  }
                                  helperText={
                                    formik.touched.rejectReason &&
                                    formik.errors.rejectReason
                                      ? formik.errors.rejectReason
                                      : null
                                  }
                                />
                              </Grid>
                              <Grid item>
                                <Button
                                  variant="contained"
                                  type="submit"
                                  color="error"
                                  sx={{
                                    minWidth: "150px",
                                  }}
                                >
                                  reject
                                </Button>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                      )}
                    <Grid item>
                      <Button
                        variant="contained"
                        onClick={() =>
                          handleStatusChange(CollectionStatus.PUBLISHED)
                        }
                        color="success"
                        sx={{
                          minWidth: "150px",
                        }}
                      >
                        publish
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Typography component="h1" variant="h4">
              {title}
            </Typography>
          </Grid>
          {(isAdmin || status === CollectionStatus.CLOSED) && (
            <Grid item>
              <Chip
                label={status.toUpperCase()}
                color={getStatusChipColor(status)}
                sx={{ fontWeight: 700 }}
              />
            </Grid>
          )}
          {(isUser || isAdmin) && rejectReason && (
            <Grid item>
              <Typography component="h3" variant="subtitle1">
                Reject reason: {rejectReason}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography component="h3" variant="subtitle1">
          Due date: {new Date(dueDate).toDateString()}
        </Typography>
        <Typography component="h3" variant="subtitle1">
          Field: {field.title}
        </Typography>
      </Grid>
      {monobankJar && (
        <>
          <Grid item xs={12} md={6}>
            <Typography component="h3" variant="subtitle1">
              Target amount: {(monobankJar.goal / 100).toLocaleString()} UAN
            </Typography>
            <Typography component="h3" variant="subtitle1">
              Current amount: {(monobankJar.amount / 100).toLocaleString()} UAN
            </Typography>
            <LinearProgressWithLabel
              variant="buffer"
              value={
                (monobankJar.amount / 100 / (monobankJar.goal / 100)) * 100
              }
            />
            <Link href={monobankJarLink} target="_blank">
              Click here to help
            </Link>
          </Grid>
        </>
      )}
      <Grid item xs={12}>
        <Typography component="article" variant="body1" color="text.secondary">
          {description}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography component="article" variant="body2" color="text.primary">
          Author: {author.name} {author.surname}
        </Typography>
        {isAdmin && (
          <Typography component="article" variant="body2" color="text.primary">
            Contact email: {author.email}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};
