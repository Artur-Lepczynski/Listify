import { useState } from "react";
import Card from "../UI/Card";
import Icon from "../UI/Icon";
import style from "./EditableShop.module.css";
import Prompt from "../UI/Prompt";
import Button from "../UI/Button";
import EditableProduct from "./EditableProduct";

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

  function handleQtyChange(productId, qty){
    props.onQtyChange(props.id, productId, qty);
  }

  function handleDoneStatusChange(productId){
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
          />
          <Icon
            type="button"
            icon="fa-solid fa-trash-can"
            className={style["shop-name-icon"]}
            onClick={handleShopDelete}
          />
        </div>
      </div>
      <div>
        {Object.entries(props.products).map((item) => {
          return (
            <EditableProduct
              key={item[0]}
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
          );
        })}
      </div>
      <Button
        className={style["add-product-button"]}
        type="button"
        look="secondary"
        onClick={handleAddProduct}
      >
        Add product
      </Button>
      <Prompt
        shown={shopPromptShown}
        setShown={setShopPromptShown}
        coordinates={coordinates}
        options={props.shops.map((item)=>item.shopName)}
        noOptionsText="There are no more shops to add"
        onBackgroundClick={handlePromptBackgroundClick}
        onSelect={handleChangeShopName}
      />
    </Card>
  );
}
