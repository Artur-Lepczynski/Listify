import style from "./Separator.module.css";
import { useTheme } from "../../hooks/useTheme";

export default function Separator(props) {
  const getClassNames = useTheme(style);
  return (
    <div
      className={`${style.separator} ${getClassNames("separator")} ${
        props.className
      }`}
    ></div>
  );
}
