import { Link } from "react-router-dom";
import style from "./DropdownMenu.module.css";
import { useTheme } from "../../hooks/useTheme";
import { CSSTransition } from "react-transition-group";

export default function DropdownMenu(props) {
  const getClassNames = useTheme(style);

  return (
    <CSSTransition
      in={props.shown}
      appear={props.shown}
      timeout={150}
      mountOnEnter
      unmountOnExit
      classNames={{
        enter: style["dropdown-enter"],
        enterActive: style["dropdown-enter-active"],
        exit: style["dropdown-exit"],
        exitActive: style["dropdown-exit-active"],
      }}
    >
      <div
        className={`${style.dropdown} ${getClassNames("dropdown")}`}
        onClick={props.onClick}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
      >
        {props.menu.map((item) => {
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`${style["dropdown-item"]} ${getClassNames(
                "dropdown-item"
              )}`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </CSSTransition>
  );
}
