import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Notifications from "../components/UI/Notifications";

export default function RootLayout() {
  return (
    <>
      <Header/>
      <Outlet />
      <Notifications/>
    </>
  );
}
