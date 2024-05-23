import { create } from "zustand";

export const isValidJSON = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
};

export interface CommonLocalStorageState {
  localStorageData: Record<string, any>;

  get: <T>(key: string, defaultValue?: T) => T;
  push: <T>(key: string, object: T) => void;
  replace: <T>(key: string, object: T) => void;
  remove: (key: string) => void;
}

export enum STORAGE {
  TOKEN = "token",
}

export const useLocalStorageStore = create<CommonLocalStorageState>()(
  (set, getState) => ({
    localStorageData: {
      [STORAGE.TOKEN]: null,
    },
    get: <T>(key: string, defaultValue?: T): T => {
      try {
        const item = localStorage.getItem(key);
        if (item == null) {
          if (defaultValue) {
            set((state: CommonLocalStorageState) => ({
              ...state,
              localStorageData: {
                ...state.localStorageData,
                [key]: defaultValue,
              },
            }));
            return defaultValue;
          }
          return getState().localStorageData[key];
        }

        if (isValidJSON(item)) return JSON.parse(item) as T;
        else return item as T;
      } catch {
        return getState().localStorageData[key];
      }
    },
    push: <T>(key: string, object: T) => {
      const newValue =
        typeof object === "string" ? object : JSON.stringify(object);

      localStorage.setItem(key, newValue);

      set((state: CommonLocalStorageState) => ({
        ...state,
        localStorageData: { ...state.localStorageData, [key]: newValue },
      }));
    },
    replace: <T>(key: string, object: T) => {
      const newValue =
        typeof object === "string" ? object : JSON.stringify(object);

      localStorage.setItem(key, newValue);

      set((state: CommonLocalStorageState) => ({
        ...state,
        localStorageData: { ...state.localStorageData, [key]: object },
      }));
    },
    remove: (key: string) => {
      set((state: CommonLocalStorageState) => {
        localStorage.removeItem(key);
        const { [key]: _, ...newLocalStorageData } = state.localStorageData;

        return { ...state, localStorageData: newLocalStorageData };
      });
    },
  })
);
