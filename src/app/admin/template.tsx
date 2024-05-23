"use client";

import { Container, Tab, Tabs } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";

const tabs = [
  { value: "collections", label: "collections' requests" },
  { value: "fields", label: "create fields form" },
  { value: "access-rights", label: "access rights" },
];

export default function AdminTemplate({ children }: PropsWithChildren) {
  const [value, setValue] = useState<string>();
  const { push } = useRouter();

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
