import Lists from "../components/lists/Lists";
import { redirect } from "react-router-dom";
import { getUserLoggedInStatus } from "../util/getUserLoggedInStatus";

export default function ListsPage(){
  return <Lists mode="select" />
}

export async function ListsPageLoader() {
  let loggedIn = await getUserLoggedInStatus(); 
  if(!loggedIn) return redirect("/");
  return null;
}