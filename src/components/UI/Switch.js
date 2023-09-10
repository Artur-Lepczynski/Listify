import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import style from "./Switch.module.css";

export default function Switch(props) {
  const getClassNames = useTheme(style);

  const [checked, setChecked] = useState(props.checked);

  function toggle() {
    setChecked(!checked);
    props.onToggle(!checked);
  }

  return (
    <label className={`${style.switch} ${props.className}`}>
      <input type="checkbox" onChange={toggle} checked={props.checked}></input>
      <span
        className={`${style.slider} ${getClassNames("slider")}`}
      ></span>
    </label>
  );
}
