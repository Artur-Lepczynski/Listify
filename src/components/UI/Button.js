import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import style from "./Button.module.css";
import Loader from "./Loader";

export default function Button(props) {
  //look: primary/secondary
  //type: button/link
  //buttonType: button/submit
  //loading = bool 

  const getClassName = useTheme(style);

  let className;
  if (props.disabled) {
    className = style["button-disabled"];
  } else {
    className = getClassName("button-" + props.look);
  }

  return (
    <>
      {props.type === "button" && (
        <button
          className={`${style.button} ${className} ${props.className}`}
          type={props.buttonType}
          disabled={props.disabled}
          onClick={props.onClick}
        >
          {props.loading ? <Loader size="small"/> : props.children}
        </button>
      )}
      {props.type === "link" && (
        <Link
          to={props.to}
          className={`${style.button} ${style.link} ${className} ${props.className}`}
        >
          {props.loading ? <Loader size="small"/> : props.children}
        </Link>
      )}
    </>
  );
}
