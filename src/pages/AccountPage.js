import { redirect } from "react-router-dom";
import Account from "../components/account/Account";
import { getUser } from "../util/getUserLoggedInStatus";

export default function AccountPage(){
  return <Account/>
}

export async function accountPageLoader() {
  const user = await getUser(); 
  if (!user) return redirect("/");
  return null; 
}