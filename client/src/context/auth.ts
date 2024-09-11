import axios from "axios";
import $api, { API_URL } from "../utils/http";

interface AuthProvider {
  isAuthenticated: boolean;
  username: null | string;
  signin(username: string): Promise<void>;
  signout(): void;
  checkAuthStatus(): Promise<boolean>;
}

/**
 * This represents some generic auth provider API, like Firebase.
 */
export const authProvider: AuthProvider = {
  isAuthenticated: false,
  async checkAuthStatus() {
    try{
      const {data} = await axios.post(API_URL + "/auth/refresh-token", {}, {withCredentials: true}); 
      this.isAuthenticated = !!data?.id; // Update the local state
      return !!data?.id; //return if is authorised
    }catch{
      this.isAuthenticated = false;
      return false;
    }

  },
  username: null,
  async signin(username: string) {
    authProvider.isAuthenticated = true;
    authProvider.username = username;
  },
  signout() {
    $api.post("/auth/logout").then(() => {
      authProvider.isAuthenticated = false;
      authProvider.username = "";
      window.location.pathname = "/home"
    })
  },
};
