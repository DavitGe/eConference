import {
  createBrowserRouter,
  LoaderFunctionArgs,
  redirect,
} from "react-router-dom";
import PublicPage from "./pages/PublicPage/PublicPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/LoginPage/RegisterPage";
import Layout from "./components/Layout/Layout";
import ProtectedPage from "./pages/ProtectedPage/ProtectedPage";
import { authProvider } from "./context/auth";

async function loginAction({ request }: LoaderFunctionArgs) {
  let formData = await request.formData();
  let username = formData.get("username") as string | null;

  // Validate our form inputs and return validation errors via useActionData()
  if (!username) {
    return {
      error: "You must provide a username to log in",
    };
  }

  // Sign in and redirect to the proper destination if successful.
  try {
    await authProvider.signin(username);
  } catch (error) {
    // Unused as of now but this is how you would handle invalid
    // username/password combinations - just like validating the inputs
    // above
    return {
      error: "Invalid login attempt",
    };
  }

  let redirectTo = formData.get("redirectTo") as string | null;
  return redirect(redirectTo || "/");
}

async function loginLoader() {
  if (authProvider.isAuthenticated) {
    return redirect("/");
  }
  return null;
}

function protectedLoader({ request }: LoaderFunctionArgs) {
  if (!authProvider.isAuthenticated) {
    let params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/auth/login?" + params.toString());
  }
  return null;
}

function publicLoader({ request }: LoaderFunctionArgs) {
  if (authProvider.isAuthenticated) {
    return redirect("/protected");
  }
  return null;
}

const AuthHeader = () => {
  return (
    <Layout
      isBgTransparent={false}
      isNavDisplayed={false}
      height={96}
      isAuthHeader
    />
  );
};

export const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    loader() {
      return { user: authProvider.username };
    },
    children: [
      {
        path: "home",
        loader: publicLoader,
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
        loader: protectedLoader,
        Component: ProtectedPage,
      },
    ],
  },
  {
    path: "/logout",
    async action() {
      // We signout in a "resource route" that we can hit from a fetcher.Form
      await authProvider.signout();
      return redirect("/");
    },
  },
]);
