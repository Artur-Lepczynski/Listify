import Dashboard from "../components/dashboard/Dashboard";
import { redirect } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function DashboardPage(){
  return <Dashboard/>
}

export async function DashboardPageLoader() {
  let loggedIn = await getUserStatus(); 
  if(!loggedIn) return redirect("/");
  return null;
}

function getUserStatus() {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      resolve(!!user);
    });
  });
}