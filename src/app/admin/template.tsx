"use client";

import { useCommonStore } from "@/store/commonStore";
import { Container, Tab, Tabs } from "@mui/material";
import { redirect, usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

const tabs = [
  { value: "collections", label: "collections' requests" },
  { value: "fields", label: "create fields form" },
  { value: "access-rights", label: "access rights" },
];

export default function AdminTemplate({ children }: PropsWithChildren) {
  const [value, setValue] = useState<string>();
  const { push } = useRouter();

  const { isAdmin } = useCommonStore(useShallow((state) => state));

  const pathname = usePathname();

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    push(`/admin/${newValue}`);
    setValue(newValue);
  };

  useEffect(() => {
    const pageName = pathname.split("/")[2];

    const currentTabValue = tabs.find(({ value }) => value === pageName)?.value;

    currentTabValue && setValue(currentTabValue);
  }, [pathname]);

  useEffect(() => {
    if (!isAdmin) redirect("/collections");
  }, [isAdmin]);

  if (!value) return null;

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        centered
        indicatorColor="primary"
        aria-label="admin-panel-tabs"
        sx={{ marginTop: "24px" }}
      >
        {tabs.map(({ value, label }) => (
          <Tab value={value} label={label} key={value} />
        ))}
      </Tabs>
      {children}
    </>
  );
}
