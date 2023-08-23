import {useState} from "react";

export function useInput(validateInput, defaultValue){
  const [enteredValue, setEnteredValue] = useState(defaultValue);
  const [inputTouched, setInputTouched] = useState(false);

  const enteredValueisValid = validateInput(enteredValue); 
  const inputIsValid = enteredValueisValid || !inputTouched; 

  function inputBlurHandler(){
    setInputTouched(true);
  }

  function inputChangeHandler(event){
    setEnteredValue(event.target.value);
  }

  function reset(){
    setEnteredValue("");
    setInputTouched(false);
  }

  return {
    enteredValue,
    setEnteredValue,
    enteredValueisValid, 
    inputIsValid,
    inputBlurHandler, 
    inputChangeHandler, 
    reset, 
  }
}