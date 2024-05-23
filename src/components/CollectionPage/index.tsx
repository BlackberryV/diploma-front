import {
  Collection,
  CollectionStatus,
  ExtendedCollection,
  updateCollection,
} from "@/api/common";
import { Grid, Typography, Chip, Button, Box, Link } from "@mui/material";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { LinearProgress, LinearProgressProps } from "@mui/material";

import * as React from "react";

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
  } = collection;

  const { back } = useRouter();

  const handleStatusChange = (
    status: CollectionStatus,
    rejectMessage?: string
  ) => {
    updateCollection({ ...collection, status, rejectMessage });
  };

  return (
    <Grid container spacing={2} marginTop={2}>
      <Grid item marginBottom={4} xs={12}>
        <Grid container display="flex" justifyContent="space-between">
          <Grid item>
            <Button variant="outlined" onClick={back}>
              Back to list
            </Button>
          </Grid>
          {isAdmin && (
            <Grid item>
              <Grid container spacing={2}>
                {status === CollectionStatus.PUBLISHED ? (
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={() =>
                        handleStatusChange(CollectionStatus.PENDING)
                      }
                      color="secondary"
                    >
                      unpublish
                    </Button>
                  </Grid>
                ) : (
                  <>
                    <Grid item>
                      <Button
                        variant="contained"
                        onClick={() =>
                          handleStatusChange(CollectionStatus.REJECTED)
                        }
                        color="error"
                      >
                        reject
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        onClick={() =>
                          handleStatusChange(CollectionStatus.PUBLISHED)
                        }
                        color="success"
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
          <Grid item>
            <Chip
              label={status.toUpperCase()}
              color="warning"
              sx={{ fontWeight: 700 }}
            />
          </Grid>
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
