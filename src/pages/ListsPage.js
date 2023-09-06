import Lists from "../components/lists/Lists";
import { redirect } from "react-router-dom";
import { getUser } from "../util/getUserLoggedInStatus";

export default function ListsPage(){
  return <Lists mode="select" />
}

export async function ListsPageLoader() {
  let user = await getUser(); 
  if(!user) return redirect("/");
  return null;
}