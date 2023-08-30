import { useTheme } from "../../hooks/useTheme";
import style from "./ProductCounter.module.css";

export default function ProductCounter(props) {
  //props.items => items like in database;
  //props.done
  const getClassNames = useTheme(style);

  const itemsArray = [].concat(...Object.values(props.items));
  const done = itemsArray.reduce((acc, item) => {
    return acc + +item.done;
  }, 0);

  return (
    <div className={`${style["wrapper"]} ${props.className}`}>
      {props.done ? (
        <i
          className={`fa-solid fa-check ${style["done-icon"]} ${getClassNames(
            "done-icon-true"
          )}`}
        ></i>
      ) : (
        <i
          className={`fa-solid fa-xmark ${style["done-icon"]} ${getClassNames(
            "done-icon-false"
          )}`}
        ></i>
      )}
      <i
        className={`fa-solid fa-circle ${
          style["separator-icon"]
        } ${getClassNames("separator-icon")}`}
      ></i>
      <p className={getClassNames("total-number")}>{itemsArray.length}</p>
      <i
        className={`fa-solid fa-circle ${
          style["separator-icon"]
        } ${getClassNames("separator-icon")}`}
      ></i>
      <p className={getClassNames("done-number")}>{done}</p>
      <i
        className={`fa-solid fa-circle ${
          style["separator-icon"]
        } ${getClassNames("separator-icon")}`}
      ></i>
      <p className={getClassNames("pending-number")}>
        {itemsArray.length - done}
      </p>
    </div>
  );
}