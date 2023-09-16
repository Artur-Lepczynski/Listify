import { useEffect, useRef, useState } from "react";
import style from "./Feature.module.css";
import Separator from "../UI/Separator";

export default function Feature(props) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (ref.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) setVisible(true);
        },
        {
          threshold: 0.7,
        }
      );
      observer.observe(ref.current);
    }
  }, []);

  return (
    <div ref={ref} className={style.feature}>
      <div
        className={`${style["feature-icon"]} ${visible && style["animation"]}`}
      >
        <p>{props.icon}</p>
      </div>
      <div
        className={`${style["feature-text"]} ${visible && style["animation"]}`}
      >
        <h2>{props.title}</h2>
        <p>{props.text}</p>
      </div>
    </div>
  );
}
