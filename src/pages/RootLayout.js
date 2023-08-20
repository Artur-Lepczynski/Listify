import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <>
      <h1>Root layout placeholder h1</h1>
      <Outlet />
    </>
  );
}
