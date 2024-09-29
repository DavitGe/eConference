import axios from "axios";
import $api, { API_URL } from "../utils/http";

interface AuthProvider {
  isAuthenticated: boolean;
  username: null | string;
  email: null | string;
  signin(username: string, email: string): Promise<void>;
  signout(): void;
  checkAuthStatus(): Promise<boolean>;
}

/**
 * This represents some generic auth provider API, like Firebase.
 */
export const authProvider: AuthProvider = {
  isAuthenticated: false,
  username: null,
  email: null,
  async checkAuthStatus() {
    try {
      const { data } = await axios.post(
        API_URL + "/auth/refresh-token",
        {},
        { withCredentials: true }
      );
      this.isAuthenticated = !!data?.id; // Update the local state
      this.username = data?.username;
      this.email = data?.email;
      return !!data?.id; //return if is authorised
    } catch {
      this.isAuthenticated = false;
      return false;
    }
  },
  async signin(username, email) {
    this.isAuthenticated = true;
    this.username = username;
    this.email = email;
  },
  signout() {
    $api.post("/auth/logout").then(() => {
      authProvider.isAuthenticated = false;
      authProvider.username = "";
      window.location.pathname = "/home";
    });
  },
};
