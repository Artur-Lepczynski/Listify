import { useEffect, useRef, useState } from "react";
import { useInput } from "../../hooks/useInput";
import { useTheme } from "../../hooks/useTheme";
import style from "./EditableProduct.module.css";
import Icon from "../UI/Icon";
import Button from "../UI/Button";

export default function EditableProduct(props) {
  const getClassNames = useTheme(style);

  const inputRef = useRef(null);

  const {
    enteredValue: enteredName,
    setEnteredValue: setEnteredName,
    enteredValueisValid: enteredNameIsValid,
    inputIsValid: nameInputIsValid,
    inputBlurHandler: nameInputBlurHandler,
    inputChangeHandler: nameInputChangeHandler,
  } = useInput((value) => {
    return value.trim() !== "" && value.length <= 50;
  }, props.name);

  const [edit, setEdit] = useState(props.edit);

  function handleModeChange() {
    if (edit) {
      if (enteredNameIsValid) {
        props.onProductNameChange(props.id, enteredName);
        setEdit(false);
      }
    } else {
      setEdit(true);
      setTimeout(() => {
        inputRef.current.focus();
      }, 50);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      if (edit) inputRef.current.focus();
    }, 50);
  }, []);

  function handleEnterPress(event) {
    if (event.key === "Enter" && document.activeElement === inputRef.current) {
      handleModeChange();
    }
  }

  function handleProductDelete() {
    props.onProductDelete(props.id);
  }

  const [qtyInputValid, setQtyInputValid] = useState(true);

  function handleQtyChange(event) {
    const value = Number.parseInt(event.target.value);
    props.onQtyChange(props.id, Number.isNaN(value) ? value + "" : value);
    if (
      value < props.minProductQty ||
      value > props.maxProductQty ||
      Number.isNaN(value)
    ) {
      setQtyInputValid(false);
    } else {
      setQtyInputValid(true);
    }
  }

  function handlePlusClick() {
    if (props.qty < props.maxProductQty) {
      props.onQtyChange(props.id, props.qty + 1);
    } else if (props.qty === "NaN") {
      props.onQtyChange(props.id, props.minProductQty);
      setQtyInputValid(true);
    }
  }

  function handleMinusClick() {
    if (props.qty > props.minProductQty) {
      props.onQtyChange(props.id, props.qty - 1);
    }
  }

  function handleDoneStatusChange() {
    props.onDoneStatusChange(props.id);
  }

  return (
    <div
      className={`${style.product} ${getClassNames("product")}`}
      role="listitem"
      onKeyDown={handleEnterPress}
    >
      <div className={style["top-wrapper"]}>
        {edit ? (
          <div>
            <input
              type="text"
              className={`${style.input} ${
                style["product-name-input"]
              } ${getClassNames("input")}`}
              placeholder="Product name"
              value={enteredName}
              onChange={nameInputChangeHandler}
              onBlur={nameInputBlurHandler}
              ref={inputRef}
            ></input>
            {!nameInputIsValid && (
              <p
                className={`${style["input-invalid-text"]} ${getClassNames(
                  "input-invalid-text"
                )}`}
              >
                Product name must be between 1 and 50 characters long
              </p>
            )}
          </div>
        ) : (
          <p className={style["product-name"]}>{props.name}</p>
        )}
        <Icon
          type="button"
          icon={edit ? "fa-solid fa-check" : "fa-solid fa-pen-to-square"}
          className={style.icon}
          onClick={handleModeChange}
          aria-label={edit ? `Save product name ${enteredNameIsValid ? "" : " (disabled - product name too long)"}` : "Edit product name"}
        />
      </div>
      <div className={style["bottom-wrapper"]}>
        <div className={style["bottom-controls"]}>
          <Icon
            className={style.icon}
            type="button"
            icon="fa-solid fa-trash-can"
            onClick={handleProductDelete}
            aria-label={"Remove product " + props.name}
          />
          <input
            type="number"
            min={props.minProductQty}
            max={props.maxProductQty}
            value={props.qty}
            onChange={handleQtyChange}
            className={`${style.input} ${
              style["product-qty-input"]
            } ${getClassNames("input")} ${
              !qtyInputValid && getClassNames("product-qty-input-invalid")
            }`}
            aria-label={"Product quantity " + props.name}
          ></input>
          <Button
            className={style["product-qty-button"]}
            type="button"
            look="secondary"
            onClick={handleMinusClick}
            aria-label={"Decrease product quantity " + props.name + " by 1"}
          >
            <i className="fa-solid fa-minus"></i>
          </Button>
          <Button
            className={style["product-qty-button"]}
            type="button"
            look="secondary"
            onClick={handlePlusClick}
            aria-label={"Increase product quantity " + props.name + " by 1"}
          >
            <i className="fa-solid fa-plus"></i>
          </Button>
        </div>
        <Icon
          className={style.icon}
          type="button"
          icon={
            props.done ? "fa-regular fa-square-check" : "fa-regular fa-square"
          }
          onClick={handleDoneStatusChange}
          aria-label={`Mark product ${props.name} as ${props.done ? "not " : ""}done`}
        />
      </div>
    </div>
  );
}
