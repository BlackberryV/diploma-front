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
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { FC } from "react";

export const CollectionComponent: FC<{
  collection: Collection;
  showMoreLink: string;
  isAdminPanel?: boolean;
  showMoreLinkText: string;
}> = ({
  collection: { description, title, status, rejectReason, _id },
  showMoreLink,
  isAdminPanel,
  showMoreLinkText,
}) => {
  const { push } = useRouter();

  return (
    <Grid item key={title} xs={12} sm={6}>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Grid
            container
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              marginBottom: "12px",
            }}
          >
            {(isAdminPanel || status === CollectionStatus.CLOSED) && (
              <Grid item marginBottom={0}>
                <Chip
                  label={status.toUpperCase()}
                  color={getStatusChipColor(status)}
                  sx={{ fontWeight: 700, marginBottom: "12px" }}
                  size="small"
                />
              </Grid>
            )}
            {isAdminPanel && rejectReason && (
              <Grid item xs={12}>
                <Typography
                  component="h3"
                  variant="subtitle1"
                  color="error"
                  sx={{ fontWeight: 700 }}
                >
                  Reject reason: {rejectReason}
                </Typography>
              </Grid>
            )}
          </Grid>
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
            {showMoreLinkText}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};
