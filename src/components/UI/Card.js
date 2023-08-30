import style from "./Card.module.css"; 
import { useTheme } from "../../hooks/useTheme";

export default function Card(props){
  //nested = bool
  const getClassNames = useTheme(style); 

  return <div className={`${style.card} ${props.nested ? getClassNames("card-nested") : getClassNames("card")} ${props.className}`}>
    {props.children}
  </div>

}