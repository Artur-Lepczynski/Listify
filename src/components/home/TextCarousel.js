/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import style from "./TextCarousel.module.css";
import { CSSTransition } from "react-transition-group";
import { useTheme } from "../../hooks/useTheme";

export default function TextSwitch(props) {
  const [shown, setShown] = useState(true);
  const [word, setWord] = useState(props.words[0]);

  const getClassNames = useTheme(style); 

  const timeTotalMs = 2700;
  const timeToFalse = 2500;

  useEffect(() => {
    setTimeout(() => {
      setShown(false);
    }, timeToFalse);

    setInterval(() => {
      setShown(true);
      setTimeout(() => {
        setShown(false);
      }, timeToFalse);
    }, timeTotalMs);
  }, []);

  useEffect(() => {
    if (!shown) {
      setTimeout(() => {
        let newIndex = (props.words.indexOf(word) + 1) % props.words.length;
        setWord(props.words[newIndex]);
      }, props.time);
    }
  }, [shown]);

  return (
    <CSSTransition
      in={shown}
      appear={true}
      timeout={props.time}
      classNames={{
        enter: style["text-enter"],
        enterActive: style["text-enter-active"],
        exit: style["text-exit"],
        exitActive: style["text-exit-active"],
        appear: style["text-enter"],
        appearActive: style["text-enter-active"],
      }}
      mountOnEnter
      unmountOnExit
    >
      <span className={`${style.text} ${getClassNames("text")}`}>{word}</span>
    </CSSTransition>
  );
}
