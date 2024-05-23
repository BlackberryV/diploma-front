"use client";

import { CollectionPage } from "@/components/CollectionPage";
import { useCommonStore } from "@/store/commonStore";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

export default function Collection({
  params: { id },
}: {
  params: { id: string };
}) {
  const { collections } = useCommonStore(useShallow((state) => state));

  const pageCollection = useMemo(() => {
    return collections?.find((c) => c._id === id);
  }, [id, collections]);

  return pageCollection ? <CollectionPage collection={pageCollection} /> : null;
}
