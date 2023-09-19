import style from "./Prompt.module.css";
import { Transition } from "react-transition-group";
import { useTheme } from "../../hooks/useTheme";
import { useState, useLayoutEffect, useRef } from "react";
import Icon from "./Icon";

export default function Prompt(props) {
  const getClassNames = useTheme(style);

  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const promptHeight = 250;
    const promptWidth = 200;
    const space = 10;
    const pageWidth = document.documentElement.offsetWidth;
    const pageHeight = document.documentElement.offsetHeight;
    const xCoord = props.coordinates.x;
    const yCoord = props.coordinates.y;

    const yOffset = yCoord + promptHeight + space - pageHeight;
    const xOffset = xCoord + promptWidth + space - pageWidth;

    const yPrompt =
      promptHeight + space + yCoord > pageHeight ? yCoord - yOffset : yCoord;
    const xPrompt =
      promptWidth + space + xCoord > pageWidth ? xCoord - xOffset : xCoord;

    setCoords({ x: xPrompt, y: yPrompt });
  }, [props.coordinates.x, props.coordinates.y]);

  function handleEnterClick(event){
    if(event.key === "Enter"){
      const focused = document.activeElement;
      focused.click();
    }else if(event.key === "Escape"){
      props.onBackgroundClick();
    }
  }

  return (
    <Transition in={props.shown} timeout={100} mountOnEnter unmountOnExit>
      {(state) => {
        return (
          <div
            className={style["prompt-wrapper"]}
            onClick={props.onBackgroundClick}
          >
            <div
              style={{ top: coords.y, left: coords.x }}
              className={`${style.prompt} ${getClassNames("prompt")}
                ${state === "entering" && style["prompt-entering"]} ${
                state === "exiting" && style["prompt-exiting"]
              }`}
              id={props.id}
              role="listbox"
              onKeyDown={handleEnterClick}
            >
              {props.options.length > 0 &&
                props.options.map((option) => {
                  return (
                    <div
                      key={option}
                      className={`${style["prompt-option"]} ${getClassNames(
                        "prompt-option"
                      )}`}
                      onClick={() => {
                        props.onSelect(option);
                      }}
                      role="option"
                      tabIndex={0}
                      aria-selected={props.mode === "setting" ? props.selected === option : "undefined"}
                    >
                      {option}
                      {props.selected === option && (
                        <Icon
                          className={style["selected-icon"]}
                          type="icon"
                          icon="fa-solid fa-check"
                        />
                      )}
                    </div>
                  );
                })}
              {props.options.length === 0 && (
                <p className={style["no-options-text"]}>
                  {props.noOptionsText || "There are no options available"}
                </p>
              )}
            </div>
          </div>
        );
      }}
    </Transition>
  );
}
