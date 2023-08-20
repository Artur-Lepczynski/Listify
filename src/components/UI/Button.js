import { useTheme } from "../../hooks/useTheme";
import style from "./Button.module.css";

export default function Button(props) {
  //look: primary/secondary

  const getClassName = useTheme(style);
  
  let className;
  if(props.disabled){
    className = style["button-disabled"]
  }else{
    className = getClassName("button-"+props.look);
  }
  

  return (
    <button
      className={`${style.button} ${className} ${props.className}`}
      type="button"
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
