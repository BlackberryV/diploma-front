import {
  Collection,
  ExtendedCollection,
  Field,
  User,
  getCollections,
  getFields,
  getJarByLongId,
  getUserById,
} from "@/api/common";
import { create } from "zustand";
import { useLocalStorageStore } from "../localStorageStore";

export const isValidJSON = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
};

export interface CommonStorageState {
  user?: User;
  fetchUserById: (id: string) => Promise<void>;
  fetchFields: () => Promise<void>;
  fetchCollections: () => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  fields?: Field[];
  collections?: ExtendedCollection[];
}

export enum STORAGE {
  TOKEN = "token",
}

export const useCommonStore = create<CommonStorageState>()((set, getState) => ({
  user: undefined,
  fields: undefined,
  collections: undefined,
  isAdmin: false,
  fetchUserById: async (id) => {
    try {
      const user = await getUserById(id);
      set({ user: user.data });
    } catch (error) {
      console.log(error);
    }
  },
  fetchFields: async () => {
    try {
      const { data } = await getFields();
      set({ fields: data });
    } catch (error) {
      console.log(error);
    }
  },
  fetchCollections: async () => {
    try {
      const { data } = await getCollections();

      const updatedDataPromises = data.map(
        async ({ monobankJarWidgetId, ...rest }) => {
          const { data } = await getJarByLongId(monobankJarWidgetId);
          return { monobankJar: data, monobankJarWidgetId, ...rest };
        }
      );

      const updatedData = await Promise.all(updatedDataPromises);

      set({ collections: updatedData });
    } catch (error) {
      console.log(error);
    }
  },
  logout: () => {
    useLocalStorageStore.getState().remove(STORAGE.TOKEN);
    set({ user: undefined, isAdmin: false });
  },
}));
