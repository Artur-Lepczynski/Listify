import { redirect } from "react-router-dom";
import EditableList from "../components/editableList/EditableList";
import { getUser } from "../util/getUserLoggedInStatus";

export default function AddPage(){
  return <EditableList mode="add"/>
}

export async function AddPageLoader() {
  let user = await getUser(); 
  if(!user) return redirect("/");
  return null;
}