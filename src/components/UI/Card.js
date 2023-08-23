import style from "./Card.module.css"; 
import { useTheme } from "../../hooks/useTheme";

export default function Card(props){
  const getClassNames = useTheme(style); 

  return <div className={`${style.card} ${getClassNames("card")} ${props.className}`}>
    {props.children}
  </div>

}