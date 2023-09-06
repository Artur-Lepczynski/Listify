import Auth from "../components/auth/Auth";
import { redirect } from "react-router-dom";
import { getUser } from "../util/getUserLoggedInStatus";

export default function AuthPage() {
  return <Auth />;
}

export async function AuthPageLoader() {
  let user = await getUser(); 
  if(user) return redirect("/dash");
  return null;
}
