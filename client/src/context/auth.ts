interface AuthProvider {
  isAuthenticated: boolean;
  username: null | string;
  signin(username: string): Promise<void>;
  signout(): Promise<void>;
}

/**
 * This represents some generic auth provider API, like Firebase.
 */
export const fakeAuthProvider: AuthProvider = {
  isAuthenticated: false,
  username: null,
  async signin(username: string) {
    fakeAuthProvider.isAuthenticated = true;
    fakeAuthProvider.username = username;
  },
  async signout() {
    fakeAuthProvider.isAuthenticated = false;
    fakeAuthProvider.username = "";
  },
};
