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

interface ColelctionsListProps {
  collections: Collection[];
  showStatus: boolean;
  showMoreLink: string;
}

export const ColelctionsList: FC<ColelctionsListProps> = ({
  collections,
  showStatus,
  showMoreLink,
}) => {
  const { push } = useRouter();

  return (
    <Grid container sx={{ marginTop: "48px" }} spacing={2}>
      {collections.map(({ title, description, _id, status }) => (
        <Grid item key={title} xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {title}
              </Typography>
              {showStatus && (
                <Chip
                  label={status.toUpperCase()}
                  color="success"
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
              <Button
                size="small"
                onClick={() => push(`${showMoreLink}/${_id}`)}
              >
                Learn More
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
