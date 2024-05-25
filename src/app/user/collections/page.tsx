"use client";

import { ColelctionsList } from "@/components/CollectionsList";
import { useCommonStore } from "@/store/commonStore";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

export default function UsersCollections() {
  const { collections, user } = useCommonStore(useShallow((state) => state));

  const userCollections = useMemo(
    () => collections?.filter(({ author: { _id } }) => _id === user?._id),
    [collections, user?._id]
  );

  return userCollections ? (
    <ColelctionsList
      collections={userCollections}
      showMoreLink={"/user/collections"}
      isAdminPanel
      showMoreLinkText="Редагувати"
    />
  ) : null;
}
