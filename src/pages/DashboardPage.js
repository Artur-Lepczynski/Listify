import Dashboard from "../components/dashboard/Dashboard";
import { redirect } from "react-router-dom";
import { getUser } from "../util/getUserLoggedInStatus";


export default function DashboardPage(){
  return <Dashboard/>
}

export async function DashboardPageLoader() {
  let user = await getUser(); 
  if(!user) return redirect("/");
  return null;
}
