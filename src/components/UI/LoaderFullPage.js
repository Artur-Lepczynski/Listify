import { CSSTransition } from "react-transition-group";
import style from "./LoaderFullPage.module.css";

export default function LoaderFullPage(props) {
  return (
    <CSSTransition in={props.in} timeout={150} unmountOnExit classNames={{
      exit: style["wrapper-exit"], 
      exitActive: style["wrapper-exit-active"]
    }}>
    <div className={style.wrapper}>
      <span className={style.loader}></span>
    </div>
    </CSSTransition>
  );
}
