import { AxiosResponse } from "axios";
import { axiosInstance, monobankAxiosInstance } from "./base";

interface LoginPayload {
  email: string;
  password: string;
}

export const login = (
  data: LoginPayload
): Promise<AxiosResponse<{ token: string }>> => {
  return axiosInstance.post("/auth/login", data);
};

export const getUserById = (id: string): Promise<AxiosResponse<User>> => {
  return axiosInstance.get(`/auth/users/${id}`);
};

interface RegistrationPayload {
  email: string;
  password: string;
  name: string;
  surname: string;
}

export interface User {
  _id: string;
  name: string;
  surname: string;
  password: string;
  email: string;
  roles: string[];
}

export const registration = (
  data: RegistrationPayload
): Promise<AxiosResponse<{ token: string }>> => {
  return axiosInstance.post("/auth/registration", data);
};

export interface Field {
  _id: string;
  title: string;
}

export const getFields = (): Promise<AxiosResponse<Field[]>> => {
  return axiosInstance.get(`/field`);
};

export const deleteFieldById = (id: string): Promise<AxiosResponse<Field>> => {
  return axiosInstance.delete(`/field/${id}`);
};

export const createField = (
  data: Pick<Field, "title">
): Promise<AxiosResponse<Field>> => {
  return axiosInstance.post(`/field`, data);
};

export interface CollectionPayload {
  author: string;
  title: string;
  description: string;
  dueDate: string;
  field: string;
}

export enum CollectionStatus {
  PUBLISHED = "published",
  PENDING = "pending",
  CLOSED = "closed",
  REJECTED = "rejected",
}

interface Comment {
  author: User;
  _id: string;
  text: string;
}

export interface Collection {
  author: User;
  title: string;
  description: string;
  dueDate: string;
  field: Field;
  _id: string;
  status: CollectionStatus;
  monobankJarWidgetId: string;
  monobankJarLink: string;
  rejectReason: string | null;
}

export const createCollection = (
  data: CollectionPayload
): Promise<AxiosResponse<Collection>> => {
  return axiosInstance.post(`/collection`, data);
};

export const updateCollection = (
  data: Collection
): Promise<AxiosResponse<Collection>> => {
  return axiosInstance.patch(`/collection`, data);
};

export const getCollections = (): Promise<AxiosResponse<Collection[]>> => {
  return axiosInstance.get(`/collection`);
};

interface Jar {
  amount: number;
  goal: number;
  ownerIcon: string;
  title: string;
  currency: number;
  description: string;
  jarId: string;
  blago: boolean;
  closed: false;
}

export type ExtendedCollection = Collection & { monobankJar?: Jar };

export const getJarByLongId = (
  longJarId: string
): Promise<AxiosResponse<Jar>> => {
  return monobankAxiosInstance.get(`/jar/${longJarId}`);
};
