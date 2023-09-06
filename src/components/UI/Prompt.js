import style from "./Prompt.module.css";
import { Transition } from "react-transition-group";
import { useTheme } from "../../hooks/useTheme";
import { useState, useLayoutEffect } from "react";

export default function Prompt(props) {
  //TODO: props.selected -> a string of the selected item, show tick next to it
  //props.options -> array of strings
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

    // console.log("yCord:", yCoord, "offsetY:", yOffset, "put:", yCoord - yOffset);
    const yPrompt =
      promptHeight + space + yCoord > pageHeight ? yCoord - yOffset : yCoord;
    const xPrompt =
      promptWidth + space + xCoord > pageWidth ? xCoord - xOffset : xCoord;

    setCoords({ x: xPrompt, y: yPrompt });
  }, [props.coordinates.x, props.coordinates.y]);

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
            >
              {props.options.length > 0 && props.options.map((option) => {
                return (
                  <div
                    key={option}
                    className={`${style["prompt-option"]} ${getClassNames("prompt-option")}`}
                    onClick={() => {
                      props.onSelect(option);
                    }}
                  >
                    {option}
                  </div>
                );
              })}
              {props.options.length === 0 && (
                <p className={style["no-options-text"]}>{props.noOptionsText || "There are no options available"}</p>
              )}
            </div>
          </div>
        );
      }}
    </Transition>
  );
}
