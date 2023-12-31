import { CSSTransition } from "react-transition-group";
import style from "./Modal.module.css";
import ReactDOM from "react-dom";
import { useTheme } from "../../hooks/useTheme";
import Button from "./Button";
import { useInput } from "../../hooks/useInput";
import { useEffect, useRef } from "react";
import Separator from "./Separator";

export default function Modal(props) {
  const getClassNames = useTheme(style);

  const {
    enteredValue,
    enteredValueisValid,
    inputIsValid,
    inputBlurHandler,
    inputChangeHandler,
    reset,
  } = useInput(props.validateFunction || (() => {}), "");

  const inputRef = useRef(null);
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    if (props.type === "input" && props.in) {
      setTimeout(()=>{
        inputRef.current.focus();
      }, 50)
    }else if(props.type === "choice" && props.in){
      setTimeout(()=>{
        confirmButtonRef.current.focus();
      }, 50)
    }
  }, [props.in]);

  function handleConfirmClick() {
    if (props.type === "input") {
      if (enteredValueisValid) {
        props.onConfirm(enteredValue);
        reset();
      }
    } else {
      props.onConfirm();
    }
  }

  function handleCancelClick() {
    reset();
    props.onCancel();
  }


  function handleKeyDown(event) {
    if (event.key === "Escape") {
      handleCancelClick();
    } else if (event.key === "Enter") {
      if (props.type === "input" && enteredValueisValid && event.target === inputRef.current) {
        handleConfirmClick();
      }
    }
  }

  return ReactDOM.createPortal(
    <CSSTransition
      in={props.in}
      appear={props.in}
      timeout={150}
      mountOnEnter
      unmountOnExit
      classNames={{
        enter: style["modal-enter"],
        enterActive: style["modal-enter-active"],
        exit: style["modal-exit"],
        exitActive: style["modal-exit-active"],
      }}
    >
      <div className={style["modal-wrapper"]}>
        <div
          className={`${style["modal"]} ${getClassNames("modal")}`}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-labelledby="modal-title"
        >
          <h3 id="modal-title" className={style.title}>{props.title}</h3>
          <Separator/>
          <div className={`${style["modal-body"]} ${props.type === "input" && style["modal-body-input"]}`}>
            <p className={style.message}>{props.message}</p>
            {props.type === "input" && (
              <>
                <input
                  type="text"
                  className={`${style.input} ${getClassNames("input")}`}
                  value={enteredValue}
                  onChange={inputChangeHandler}
                  onBlur={inputBlurHandler}
                  placeholder={props.placeholderText}
                  ref={inputRef}
                ></input>
                {!inputIsValid && (
                  <p
                    className={`${style["input-invalid-text"]} ${getClassNames(
                      "input-invalid-text"
                    )}`}
                  >
                    Shop name should be between 1 and 32 characters long
                  </p>
                )}
              </>
            )}
          </div>
          <Separator/>
          <div className={style["modal-buttons"]}>
            <Button type="button" look="secondary" onClick={handleCancelClick}>
              {props.cancelText}
            </Button>
            <Button
              type="button"
              look="primary"
              buttonRef={confirmButtonRef}
              disabled={props.type === "input" && !enteredValueisValid}
              onClick={handleConfirmClick}
            >
              {props.confirmText}
            </Button>
          </div>
        </div>
      </div>
    </CSSTransition>,
    document.querySelector("#modal-target")
  );
}