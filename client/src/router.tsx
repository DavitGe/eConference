import { createBrowserRouter, Navigate, redirect } from "react-router-dom";
import { authProvider } from "./context/auth"; // Ensure this can handle async auth checks
import { requireAuth } from "./utils/requireAuth";
import { loginAction, loginLoader } from "./utils/loaders/loginLoader";
import PublicPage from "./pages/PublicPage/PublicPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/LoginPage/RegisterPage";
import ProtectedPage from "./pages/ProtectedPage/ProtectedPage";
import Layout from "./components/Layout/Layout";
import { rootLoader } from "./utils/loaders/rootLoader";

const AuthHeader = () => {
  return (
    <Layout
      isbgtransparent={false}
      isNavDisplayed={false}
      height={96}
      isAuthHeader
    />
  );
};
const RootComponent = () => {
  return <Navigate to="/home" />;
};

// Router Configuration
export const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    loader: rootLoader,
    children: [
      {
        path: "home",
        Component: PublicPage,
      },
      {
        path: "auth",
        action: loginAction,
        loader: loginLoader,
        Component: AuthHeader,
        children: [
          {
            path: "login",
            Component: LoginPage,
          },
          {
            path: "register",
            Component: RegisterPage,
          },
        ],
      },
      {
        path: "protected",
        action: requireAuth,
        Component: ProtectedPage,
      },
    ],
  },
  {
    path: "/logout",
    async action() {
      await authProvider.signout();
      return redirect("/");
    },
  },
]);
