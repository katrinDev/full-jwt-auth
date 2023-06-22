import axios from "axios";
import AuthResponse from "../models/response/AuthResponse";

export const API_URL = "http://localhost:5000/api";

const $api = axios.create({
  //create an instance of axios
  withCredentials: true, //to automatically add cookies to each request
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  //all info about a request is located in config
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

$api.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config; //error.config contains all data for request

    if (
      error.response.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
          withCredentials: true,
        });
        localStorage.setItem("token", response.data.accessToken);
        return $api.request(originalRequest);
      } catch (e) {
        console.log("USER IS ANAUTHORIZED");
      }
    }
    throw error;
  }
);

export default $api;
