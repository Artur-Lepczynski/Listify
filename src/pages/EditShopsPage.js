import { redirect } from "react-router-dom";
import Shops from "../components/shops/Shops"
import { getUser } from "../util/getUserLoggedInStatus";

export default function EditShopsPage(){
  return <Shops/>
}

export async function EditShopsPageLoader(){
  const user = await getUser(); 
  if(!user) return redirect("/");
  return null; 
}