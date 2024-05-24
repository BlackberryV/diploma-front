import { Collection, CollectionStatus } from "@/api/common";
import { getStatusChipColor } from "@/helpers/collections";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  CardActions,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { FC } from "react";

export const CollectionComponent: FC<{
  collection: Collection;
  showMoreLink: string;
  isAdminPanel?: boolean;
}> = ({
  collection: { description, title, status, _id },
  showMoreLink,
  isAdminPanel,
}) => {
  const { push } = useRouter();

  return (
    <Grid item key={title} xs={12} sm={6}>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          {(isAdminPanel || status === CollectionStatus.CLOSED) && (
            <Chip
              label={status.toUpperCase()}
              color={getStatusChipColor(status)}
              sx={{ fontWeight: 700, marginBottom: "12px" }}
              size="small"
            />
          )}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => push(`${showMoreLink}/${_id}`)}>
            Learn More
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};
