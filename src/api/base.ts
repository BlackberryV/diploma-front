import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const axiosConfig: AxiosRequestConfig = {
  baseURL: "http://localhost:3001",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
};

const monobankAxiosConfig: AxiosRequestConfig = {
  baseURL: "https://api.monobank.ua/bank",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
};

function createAxiosInstance(config: AxiosRequestConfig): AxiosInstance {
  return axios.create(config);
}

export const axiosInstance = createAxiosInstance(axiosConfig);

export const monobankAxiosInstance = createAxiosInstance(monobankAxiosConfig);
