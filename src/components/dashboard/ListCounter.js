import style from "./ListCounter.module.css";
import { useTheme } from "../../hooks/useTheme";
import Card from "../UI/Card";

export default function ListCounter(props) {
  const getClassNames = useTheme(style);

  return (
    <Card nested={true} className={style.wrapper}>
      <p
        className={`${style.number} ${
          props.type === "open"
            ? getClassNames("number-open")
            : getClassNames("number-closed")
        }`}
      >
        {props.number}
      </p>
      <p>{props.type === "open" ? "Open" : "Closed"}</p>
    </Card>
  );
}
