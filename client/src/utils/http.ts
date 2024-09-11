import axios from "axios";
import { authProvider } from "../context/auth";
export const API_URL = "http://localhost:3000/api";

function setup() {
  const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
  });

  $api.interceptors.response.use(undefined, (error) => {
    const {
      _,
      response: { status },
    } = error;
    if (status === 401) {
       window.location.pathname = "/home";
    } else {
      return Promise.reject(error);
    }
  });
  return $api;
}

const $api = setup();

export default $api;
