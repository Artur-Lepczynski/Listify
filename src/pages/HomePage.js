import { redirect } from "react-router-dom";
import Home from "../components/home/Home";
import { getUser } from "../util/getUserLoggedInStatus";

export default function HomePage(){
  return <Home/>
}

export async function HomePageLoader(){
  const user = await getUser(); 
  if(user) return redirect("/dash");
  return null; 
}