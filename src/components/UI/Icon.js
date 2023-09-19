import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import style from "./Icon.module.css";

export default function Icon(props) {
  const getClassNames = useTheme(style);

  return (
    <>
      {props.type === "button" && (
        <button
          onClick={props.onClick}
          className={`${style.element} ${getClassNames("element")} ${
            props.className
          }`}
          aria-haspopup={props["aria-haspopup"]}
          aria-controls={props["aria-controls"]}
          aria-label={props["aria-label"]}
        >
          <i className={props.icon}></i>
        </button>
      )}
      {props.type === "link" && (
        <Link
          to={props.to}
          className={`${style.element} ${getClassNames("element")} ${
            props.className
          }`}
          aria-label={props["aria-label"]}
        >
          <i className={props.icon}></i>
        </Link>
      )}
      {props.type === "outside-link" && (
        <a
          href={props.to}
          target="_blank"
          rel="noreferrer"
          aria-label={props["aria-label"]}
          className={`${style.element} ${getClassNames("element")} ${
            props.className
          }`}
        >
          <i className={props.icon}></i>
        </a>
      )}
      {props.type === "icon" && (
        <div
          className={`${style.element} ${getClassNames("element")} ${
            props.className
          }`}
        >
          <i className={props.icon}></i>
        </div>
      )}
    </>
  );
}
