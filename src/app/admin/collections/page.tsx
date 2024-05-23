"use client";

import { ColelctionsList } from "@/components/CollectionsList";
import { useCommonStore } from "@/store/commonStore";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { useShallow } from "zustand/react/shallow";

export default function AdminCollections() {
  const { collections } = useCommonStore(useShallow((state) => state));

  return (
    <ColelctionsList
      collections={collections || []}
      showStatus={true}
      showMoreLink="/admin/collections"
    />
  );
}
