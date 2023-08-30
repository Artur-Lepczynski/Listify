import style from "./Account.module.css";
import Page from "../UI/Page";
import Button from "../UI/Button";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const navigate = useNavigate(); 

  function handleLogout() {
    const auth = getAuth();
    signOut(auth)
      .then(()=>{
        console.log("logged out!"); 
        navigate("/");
      })
      .catch((error) => {
        
      });
  }
  return (
    <Page>
      <h1>Account page placeholder</h1>
      <Button type="button" look="primary" onClick={handleLogout}>
        Log out
      </Button>
    </Page>
  );
}
