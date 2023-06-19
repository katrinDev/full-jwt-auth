import axios from "axios";

export const API_URL = "http://localhost:5000/api";

const $api = axios.create({
  //create an instance of axios
  withCredentials: true, //to automatically add cookies to each request
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

export default $api;
