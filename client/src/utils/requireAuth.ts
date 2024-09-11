import { LoaderFunctionArgs, redirect } from "react-router-dom";
import { authProvider } from "../context/auth";

export async function requireAuth({ request }: LoaderFunctionArgs) {
  if (!authProvider.isAuthenticated) {
    const params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/auth/login?" + params.toString());
  }
  return null;
}
