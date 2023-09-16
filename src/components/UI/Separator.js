import style from "./Separator.module.css";
import { useTheme } from "../../hooks/useTheme";

export default function Separator() {
  const getClassNames = useTheme(style);
  return <div className={`${style.separator} ${getClassNames("separator")}`}></div>;
}
