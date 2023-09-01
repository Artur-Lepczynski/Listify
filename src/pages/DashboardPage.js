import Dashboard from "../components/dashboard/Dashboard";
import { redirect } from "react-router-dom";
import { getUserLoggedInStatus } from "../util/getUserLoggedInStatus";


export default function DashboardPage(){
  return <Dashboard/>
}

export async function DashboardPageLoader() {
  let loggedIn = await getUserLoggedInStatus(); 
  if(!loggedIn) return redirect("/");
  return null;
}
