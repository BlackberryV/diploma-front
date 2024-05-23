"use client";

import { CollectionStatus } from "@/api/common";
import { ColelctionsList } from "@/components/CollectionsList";
import { useCommonStore } from "@/store/commonStore";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

export default function CollectionsPage() {
  const { collections } = useCommonStore(useShallow((state) => state));

  const publishedCollections = useMemo(
    () => collections?.filter((c) => c.status === CollectionStatus.PENDING),
    [collections]
  );

  return publishedCollections ? (
    <ColelctionsList
      collections={publishedCollections}
      showStatus={false}
      showMoreLink={"/collections"}
    />
  ) : null;
}
