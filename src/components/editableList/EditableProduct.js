import { useEffect, useRef, useState } from "react";
import { useInput } from "../../hooks/useInput";
import { useTheme } from "../../hooks/useTheme";
import style from "./EditableProduct.module.css";
import Icon from "../UI/Icon";
import Button from "../UI/Button";

export default function EditableProduct(props) {
  //name, id, qty, edit, done

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
      setTimeout(()=>{
        inputRef.current.focus();
      }, 50)
    }
  }

  useEffect(()=>{
    setTimeout(()=>{
      if(edit) inputRef.current.focus();
    }, 50)
  }, [])

  function handleProductDelete() {
    props.onProductDelete(props.id);
  }

  function handleQtyChange(event) {
    const value = Number.parseInt(event.target.value);
    if (value >= 1 && value <= 99 && !Number.isNaN(value)) {
      props.onQtyChange(props.id, value);
    }
  }

  function handlePlusClick() {
    if (props.qty < 99) {
      props.onQtyChange(props.id, props.qty + 1);
    }
  }

  function handleMinusClick() {
    if (props.qty > 1) {
      props.onQtyChange(props.id, props.qty - 1);
    }
  }

  function handleDoneStatusChange() {
    props.onDoneStatusChange(props.id);
  }

  return (
    <div className={`${style.product} ${getClassNames("product")}`}>
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
        />
      </div>
      <div className={style["bottom-wrapper"]}>
        <div className={style["bottom-controls"]}>
          <Icon
            className={style.icon}
            type="button"
            icon="fa-solid fa-trash-can"
            onClick={handleProductDelete}
          />
          <input
            type="number"
            min={1}
            max={99}
            value={props.qty}
            onChange={handleQtyChange}
            className={`${style.input} ${
              style["product-qty-input"]
            } ${getClassNames("input")}`}
          ></input>
          <Button
            className={style["product-qty-button"]}
            type="button"
            look="secondary"
            onClick={handleMinusClick}
          >
            <i className="fa-solid fa-minus"></i>
          </Button>
          <Button
            className={style["product-qty-button"]}
            type="button"
            look="secondary"
            onClick={handlePlusClick}
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
        />
      </div>
    </div>
  );
}