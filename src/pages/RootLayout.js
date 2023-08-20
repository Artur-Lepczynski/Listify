import style from "./RootLayout.module.css";
import { Outlet } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

export default function RootLayout() {
  return (
    <CSSTransition
      in={true}
      timeout={150}
      appear={true}
      mountOnEnter
      classNames={{
        appear: style["root-layout-appear"],
        appearActive: style["root-layout-appear-active"],
      }}
    >
      <div>
        <Outlet />
      </div>
    </CSSTransition>
  );
}
