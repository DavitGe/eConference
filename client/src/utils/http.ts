import axios from "axios";
import { Cookies } from "react-cookie";
export const API_URL = "http://localhost:3000/api";

const cookies = new Cookies();
function setup() {
  const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
  });

  $api.interceptors.request.use((config: any) => {
    config.headers.authorization = cookies.get("authorization");
    config.headers.refreshToken = cookies.get("refreshToken");
    return config;
  });

  $api.interceptors.response.use(undefined, (error) => {
    const {
      config,
      response: { status },
    } = error;
    if (status === 401) {
      cookies.remove("authorization");
      cookies.remove("refreshToken");
      window.location.pathname = "/home";
    } else {
      return Promise.reject(error);
    }
  });
  return $api;
}

const $api = setup();

export default $api;
