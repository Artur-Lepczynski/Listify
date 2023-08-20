import style from "./Test.module.css"; 
import { useTheme } from "../hooks/useTheme";

export default function Test(){

  const getClassName = useTheme(style); 

  return <div className={`${style.wrapper} ${getClassName("wrapper")}`}>
    <p>Test text</p>
  </div>
}