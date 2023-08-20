import { useTheme } from "../../hooks/useTheme";
import style from "./Page.module.css";

export default function Page(props) {
  const getClassName = useTheme(style);

  return (
    <div className={`${style.page} ${getClassName("page")} ${props.className}`}>
      {props.children}
    </div>
  );
}
