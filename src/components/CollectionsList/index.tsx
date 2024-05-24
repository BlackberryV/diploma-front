import { Collection } from "@/api/common";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Chip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { CollectionComponent } from "../Collection";

interface ColelctionsListProps {
  collections: Collection[];
  showMoreLink: string;
  isAdminPanel?: boolean;
}

export const ColelctionsList: FC<ColelctionsListProps> = ({
  collections,
  showMoreLink,
  isAdminPanel,
}) => {
  return (
    <Grid container sx={{ marginTop: "48px" }} spacing={2}>
      {collections.length !== 0 ? (
        collections.map((collection) => (
          <CollectionComponent
            key={collection._id}
            collection={collection}
            showMoreLink={showMoreLink}
            isAdminPanel={isAdminPanel}
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
