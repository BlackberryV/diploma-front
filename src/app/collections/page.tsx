"use client";

import { CollectionStatus } from "@/api/common";
import { ColelctionsList } from "@/components/CollectionsList";
import { useCommonStore } from "@/store/commonStore";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

export default function CollectionsPage() {
  const { collections, fields } = useCommonStore(useShallow((state) => state));

  const [filterField, setFilterField] = useState<string>();
  const [filterStatus, setFilterStatus] = useState<string>();

  const filteredCollections = useMemo(() => {
    return collections
      ?.filter(({ status }) => {
        if (filterStatus) {
          return filterStatus === status;
        }

        return (
          status === CollectionStatus.PUBLISHED ||
          status === CollectionStatus.CLOSED
        );
      })
      .filter(({ field }) => (filterField ? field._id === filterField : true));
  }, [collections, filterField, filterStatus]);

  return filteredCollections ? (
    <Grid container sx={{ marginTop: "48px" }} spacing={2}>
      <Grid item xs={3}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label" required>
            Collection field
          </InputLabel>
          <Select
            labelId="project-field"
            id="field"
            name="field"
            onChange={(e) => setFilterField(e.target.value)}
            value={filterField}
            label="Collection field"
          >
            <MenuItem value={undefined}>
              <em>None</em>
            </MenuItem>
            {fields?.map(({ _id, title }) => (
              <MenuItem value={_id} key={_id}>
                {title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={3}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label" required>
            Collection status
          </InputLabel>
          <Select
            labelId="status"
            id="status"
            name="status"
            onChange={(e) => setFilterStatus(e.target.value)}
            value={filterStatus}
            label="Collection status"
          >
            <MenuItem value={undefined}>
              <em>None</em>
            </MenuItem>
            <MenuItem
              value={CollectionStatus.PUBLISHED}
              key={CollectionStatus.PUBLISHED}
            >
              Діючі
            </MenuItem>
            <MenuItem
              value={CollectionStatus.CLOSED}
              key={CollectionStatus.CLOSED}
            >
              Завершені
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <ColelctionsList
        collections={filteredCollections}
        showMoreLink={"/collections"}
        showMoreLinkText="Показати більше"
      />
    </Grid>
  ) : null;
}
