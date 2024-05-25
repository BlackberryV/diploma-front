import { Collection } from "@/api/common";
import { Grid, Typography } from "@mui/material";
import { FC } from "react";
import { CollectionComponent } from "../Collection";

interface ColelctionsListProps {
  collections: Collection[];
  showMoreLink: string;
  showMoreLinkText: string;
  isAdminPanel?: boolean;
}

export const ColelctionsList: FC<ColelctionsListProps> = ({
  collections,
  ...props
}) => {
  return (
    <Grid container sx={{ marginTop: "48px" }} spacing={2}>
      {collections.length !== 0 ? (
        collections.map((collection) => (
          <CollectionComponent
            key={collection._id}
            collection={collection}
            {...props}
          />
        ))
      ) : (
        <Grid item>
          <Typography>Жодних зборів не було знайдено за запитом.</Typography>
        </Grid>
      )}
    </Grid>
  );
};
