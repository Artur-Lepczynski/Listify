import Auth from "../components/auth/Auth";
import { redirect } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function AuthPage() {
  return <Auth />;
}

export async function AuthPageLoader() {
  let loggedIn = await getUserStatus(); 
  if(loggedIn) return redirect("/dash");
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
