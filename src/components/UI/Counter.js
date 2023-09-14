import style from "./Counter.module.css";
import { useTheme } from "../../hooks/useTheme";
import Card from "../UI/Card";

export default function ListCounter(props) {
  const getClassNames = useTheme(style);

  return (
    <Card nested={true} className={style.wrapper}>
      <p
        className={`${style.number} ${getClassNames("number-"+props.type)}`}
      >
        {props.number}
      </p>
      <p>{props.caption}</p>
    </Card>
  );
}
