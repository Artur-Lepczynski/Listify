import { redirect } from "react-router-dom";
import ViewableList from "../components/viewableList/ViewableList";
import { getUser } from "../util/getUserLoggedInStatus";

export default function ViewSingleListPage(){
  return <ViewableList/>
}

export async function viewSingleListPageLoader() {
  let user = await getUser(); 
  if(!user) return redirect("/");
  return null;
}