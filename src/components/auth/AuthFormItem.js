import style from "./AuthFormItem.module.css";
import { useInput } from "../../hooks/useInput";
import { useTheme } from "../../hooks/useTheme";
import { useEffect, useState } from "react";

export default function AuthInput(props) {
  //props.type = email/password/ invalidText validateFunction onChangeFunc onChangeValidFunc name

  const getClassNames = useTheme(style);

  const [passwordShown, setPasswordShown] = useState(false);

  let type = props.type;
  if(type === "password"){
    if(passwordShown){
      type = "text"; 
    }
  }

  function eyeMouseDownHandler(){
    setPasswordShown(true);
  }

  function eyeMouseUpHandler(){
    setPasswordShown(false);
  }

  const {
    enteredValue,
    enteredValueisValid,
    inputIsValid,
    inputBlurHandler,
    inputChangeHandler,
    reset,
  } = useInput(props.validateFunction, "");

  useEffect(() => {
    props.onChangeFunction(enteredValue);
  }, [enteredValue]);

  useEffect(() => {
    props.onValidChangeFunction(enteredValueisValid);
  }, [enteredValueisValid]);

  return (
    <div className={style["form-item"]}>
      <label
        htmlFor={props.type}
        className={`${style.label} ${getClassNames("label")}`}
      >
        {props.name}
      </label>
      <input
        id={props.type}
        className={`${style.input} ${getClassNames("input")}`}
        type={type}
        name="email"
        value={enteredValue}
        onChange={inputChangeHandler}
        onBlur={inputBlurHandler}
        required
      ></input>
      {props.type === "password" && (
        <i
          className={`fa-solid fa-eye ${style.eye} ${passwordShown && getClassNames(
            "eye-active"
          )}`}
          onMouseDown={eyeMouseDownHandler}
          onMouseUp={eyeMouseUpHandler}
        ></i>
      )}
      {!inputIsValid && (
        <p
          className={`${style["input-invalid-text"]} ${getClassNames(
            "input-invalid-text"
          )}`}
        >
          {props.invalidText}
        </p>
      )}
    </div>
  );
}
