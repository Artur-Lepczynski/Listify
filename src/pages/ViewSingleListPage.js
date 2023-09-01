import { redirect } from "react-router-dom";
import ViewableList from "../components/viewableList/ViewableList";
import { getUserLoggedInStatus } from "../util/getUserLoggedInStatus";

export default function ViewSingleListPage(){
  return <ViewableList/>
}

export async function viewSingleListPageLoader() {
  let loggedIn = await getUserLoggedInStatus(); 
  if(!loggedIn) return redirect("/");
  return null;
}