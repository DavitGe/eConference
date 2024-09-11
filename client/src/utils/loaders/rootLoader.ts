import { LoaderFunctionArgs, redirect } from "react-router-dom";

export async function rootLoader(props: LoaderFunctionArgs) {
  if(props.request.url.slice(0,-1) === window.location.origin){
    return redirect("/home");
  }
  return null;
}