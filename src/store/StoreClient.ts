"use client";

import { useEffect } from "react";
import jwt from "jsonwebtoken";
import { STORAGE, useLocalStorageStore } from "./localStorageStore";
import { useCommonStore } from "./commonStore";
import { useShallow } from "zustand/react/shallow";

export const StoreClient = () => {
  const { fetchUserById, user, fetchFields, fetchCollections } = useCommonStore(
    useShallow((state) => state)
  );

  useEffect(() => {
    const token = useLocalStorageStore
      .getState()
      .get<string | null>(STORAGE.TOKEN);
    if (!token) return;

    const { id } = jwt.decode(token) as { id: string };

    fetchUserById(id);
  }, [fetchUserById]);

  useEffect(() => {
    const isAdmin = user && user.roles.includes("ADMIN");

    useCommonStore.setState({ isAdmin });
  }, [user]);

  useEffect(() => {
    fetchFields();
    fetchCollections();
  }, [fetchFields, fetchCollections]);

  return null;
};
