import style from "./AuthFormItem.module.css";
import { useInput } from "../../hooks/useInput";
import { useTheme } from "../../hooks/useTheme";
import { useEffect } from "react";

export default function AuthInput(props) {
  //props.type = email/password/ invalidText validateFunction onChangeFunc onChangeValidFunc name

  const getClassNames = useTheme(style); 

  const {
    enteredValue,
    enteredValueisValid,
    inputIsValid,
    inputBlurHandler,
    inputChangeHandler,
    reset,
  } = useInput(props.validateFunction, "");

  useEffect(()=>{
    props.onChangeFunction(enteredValue);
  }, [enteredValue])

  useEffect(()=>{
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
        type={props.type}
        name="email"
        value={enteredValue}
        onChange={inputChangeHandler}
        onBlur={inputBlurHandler}
        required
      ></input>
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
