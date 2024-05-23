"use client";

import { useCommonStore } from "@/store/commonStore";
import { redirect } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export default function PublicTemplate({ children }: PropsWithChildren) {
  const { user } = useCommonStore(useShallow((state) => state));

  useEffect(() => {
    if (user) redirect("/");
  }, [user]);

  return children;
}
