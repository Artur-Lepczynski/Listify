import { useTheme } from "../../hooks/useTheme";
import Icon from "../UI/Icon";
import style from "./ViewableProduct.module.css";

export default function ViewableProduct(props) {

  const getClassNames = useTheme(style);

  function handleProductStatusChange(){
    props.onStatusChange(props.id, !props.product.done);
  }

  return (
    <div
      className={style["product-container"]}
      role="listitem"
    >
      <p className={style.qty}>{"x" + props.product.qty}</p>
      <p
        className={`${style.name} ${
          props.product.done && getClassNames("name-done")
        }`}
      >
        {props.product.name}
      </p>
      <Icon
          type="button"
          onClick={handleProductStatusChange}
          className={style["icon"]}
          icon={props.product.done ? "fa-regular fa-square-check" : "fa-regular fa-square"}
        />
    </div>
  );
}
