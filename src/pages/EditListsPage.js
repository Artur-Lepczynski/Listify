import { redirect } from "react-router-dom";
import Lists from "../components/lists/Lists";
import { getUser } from "../util/getUserLoggedInStatus";

export default function EditListsPage(){
  return <Lists mode="edit"/>
}

export async function EditListPageLoader(){
  const user = await getUser(); 
  if(!user) return redirect("/");
  return null; 
}