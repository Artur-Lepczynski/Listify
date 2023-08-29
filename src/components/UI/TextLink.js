import { Link } from "react-router-dom";
import style from "./TextLink.module.css"; 
import { useTheme } from "../../hooks/useTheme";

export default function TextLink(props){

  const getClassNames = useTheme(style);

  return <Link to={props.to} className={`${style.link} ${getClassNames("link")} ${props.className}`}>
    {props.children}
  </Link>
}