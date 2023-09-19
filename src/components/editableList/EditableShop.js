import { useState } from "react";
import Card from "../UI/Card";
import Icon from "../UI/Icon";
import style from "./EditableShop.module.css";
import Prompt from "../UI/Prompt";
import Button from "../UI/Button";
import EditableProduct from "./EditableProduct";
import { CSSTransition, TransitionGroup } from "react-transition-group";

export default function EditableShop(props) {
  const [shopPromptShown, setShopPromptShown] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  function handleShopNameEditPress(event) {
    const clickCoordinates = { x: event.pageX, y: event.pageY };
    setCoordinates(clickCoordinates);
    setShopPromptShown(true);
  }

  function handlePromptBackgroundClick() {
    setShopPromptShown(false);
  }

  function handleChangeShopName(shop) {
    setShopPromptShown(false);
    props.onShopNameEdit(props.id, shop);
  }

  function handleShopDelete() {
    props.onShopDelete(props.id);
  }

  function handleAddProduct() {
    props.onAddProduct(props.id);
  }

  function handleProductNameChange(productId, name) {
    props.onProductNameChange(props.id, productId, name);
  }

  function handleProductDelete(productId) {
    props.onProductDelete(props.id, productId);
  }

  function handleQtyChange(productId, qty) {
    props.onQtyChange(props.id, productId, qty);
  }

  function handleDoneStatusChange(productId) {
    props.onDoneStatusChange(props.id, productId);
  }

  return (
    <Card nested={true}>
      <div className={style["shop-name-wrapper"]}>
        <h3 className={style["shop-name"]}>{props.name}</h3>
        <div className={style["icons-wrapper"]}>
          <Icon
            type="button"
            icon="fa-solid fa-pen-to-square"
            className={style["shop-name-icon"]}
            onClick={handleShopNameEditPress}
            aria-label={"Edit shop name" + props.name}
            aria-haspopup="menu"
            aria-controls="shop-prompt"
          />
          <Prompt
            id="shop-prompt"
            shown={shopPromptShown}
            setShown={setShopPromptShown}
            coordinates={coordinates}
            options={props.shops
              .filter((item) => !item.used)
              .map((item) => item.shopName)}
            noOptionsText="There are no more shops to add"
            onBackgroundClick={handlePromptBackgroundClick}
            onSelect={handleChangeShopName}
          />
          <Icon
            type="button"
            icon="fa-solid fa-trash-can"
            className={style["shop-name-icon"]}
            onClick={handleShopDelete}
            aria-label={"Remove shop " + props.name}
          />
        </div>
      </div>
      <TransitionGroup>
        {Object.entries(props.products).map((item) => {
          return (
            <CSSTransition
              timeout={150}
              key={item[0]}
              classNames={{
                enter: style["product-enter"],
                enterActive: style["product-enter-active"],
                exit: style["product-exit"],
                exitActive: style["product-exit-active"],
              }}
            >
              <EditableProduct
                id={item[0]}
                name={item[1].name}
                qty={item[1].qty}
                edit={item[1].edit}
                done={item[1].done}
                maxProductQty={props.maxProductQty}
                minProductQty={props.minProductQty}
                onProductNameChange={handleProductNameChange}
                onProductDelete={handleProductDelete}
                onQtyChange={handleQtyChange}
                onDoneStatusChange={handleDoneStatusChange}
              />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
      <Button
        className={style.button}
        type="button"
        look="secondary"
        onClick={handleAddProduct}
        aria-label={"Add product to " + props.name}
      >
        Add product
      </Button>
    </Card>
  );
}
