import style from "./Card.module.css";
import { useTheme } from "../../hooks/useTheme";
import { useRef } from "react";

export default function Card(props) {
  const getClassNames = useTheme(style);
  const cardRef = useRef(null);

  function handleKeyDown(event) {
    if (event.key === "Enter" && cardRef.current === document.activeElement) {
      props.onEnterPress();
    }
  }

  return (
    <div
      className={`${style.card} ${
        props.nested ? getClassNames("card-nested") : getClassNames("card")
      } ${props.className}`}
      tabIndex={props.tabIndex}
      onKeyDown={handleKeyDown}
      role={props.role}
      ref={cardRef}
      aria-label={props.ariaLabel}
    >
      {props.children}
    </div>
  );
}
