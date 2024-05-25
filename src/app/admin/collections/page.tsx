"use client";

import { ColelctionsList } from "@/components/CollectionsList";
import { useCommonStore } from "@/store/commonStore";
import { useShallow } from "zustand/react/shallow";

export default function AdminCollections() {
  const { collections } = useCommonStore(useShallow((state) => state));

  return (
    <ColelctionsList
      collections={collections || []}
      showMoreLink="/admin/collections"
      isAdminPanel
      showMoreLinkText="Перевірити"
    />
  );
}
