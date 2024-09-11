import { LoaderFunctionArgs, redirect } from "react-router-dom";
import { authProvider } from "../../context/auth";

export async function loginLoader() {
  if (authProvider.isAuthenticated) {
    return redirect("/protected");
  }
  return null;
}

export async function loginAction({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username") as string | null;

  if (!username) {
    return { error: "You must provide a username to log in" };
  }

  try {
    await authProvider.signin(username);
  } catch (error) {
    return { error: "Invalid login attempt" };
  }

  const redirectTo = formData.get("redirectTo") as string | null;
  return redirect(redirectTo || "/");
}