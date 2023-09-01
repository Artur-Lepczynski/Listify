import { useTheme } from "../../hooks/useTheme";
import ViewableProduct from "./ViewableProduct";
import style from "./ViewableShop.module.css";

export default function ViewableShop(props) {

  const getClassNames = useTheme(style);

  return (
    <div className={style["shop-container"]}>
      <h3 className={`${style["shop-name"]} ${getClassNames("shop-name")}`}>{props.name}</h3>
      <div className={style["shop-items"]}>
        {Object.entries(props.items).map((item) => {
          return (
            <ViewableProduct
              key={item[0]}
              id={item[0]}
              shopName={props.name}
              product={item[1]}
              onStatusChange={props.onStatusChange}
            />
          );
        })}
      </div>
    </div>
  );
}