import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import Card from "../UI/Card";
import Switch from "../UI/Switch";
import style from "./Setting.module.css";
import Prompt from "../UI/Prompt";

export default function Setting(props) {
  //current -> boolean/string;
  //name -> string;
  //type -> options/toggle;
  //options -> array of strings to choose
  //displayOptions -> array of strings to display

  const getClassNames = useTheme(style);
  const [settingPromptShown, setSettingPromptShown] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  function handleSwitchToggle(value) {
    props.onToggle(props.settingKey, value);
  }

  function handlePromptlOpen(event) {
    const clickCoordinates = { x: event.pageX, y: event.pageY };
    setCoordinates(clickCoordinates);
    setSettingPromptShown(true);
  }

  function handlePromptBackgroundClick() {
    setSettingPromptShown(false);
  }

  function handleOptionSelect(value) {
    if (props.options instanceof Map) {
      value = [...props.options.entries()].find((item) => item[1] === value)[0];
    }
    props.onOptionSelect(props.settingKey, value);
  }

  function getOptions() {
    if (props.options instanceof Map) {
      return [...props.options.values()];
    } else {
      return props.options;
    }
  }

  function getSelected() {
    if (props.options instanceof Map) {
      return props.options.get(props.current);
    } else {
      return props.current;
    }
  }

  return (
    <Card nested={true} className={style.setting}>
      <p className={style["setting-name"]}>{props.name}</p>
      {props.type === "toggle" && (
        <Switch
          className={style.switch}
          checked={props.current}
          onToggle={handleSwitchToggle}
        />
      )}
      {props.type === "options" && (
        <button
          onClick={handlePromptlOpen}
          className={`${style.button} ${getClassNames("button")}`}
        >
          {props.options.get?.(props.current) || props.current}
        </button>
      )}
      <Prompt
        shown={settingPromptShown}
        setShown={setSettingPromptShown}
        coordinates={coordinates}
        options={getOptions()}
        selected={getSelected()}
        noOptionsText="There are no more shops to add"
        onBackgroundClick={handlePromptBackgroundClick}
        onSelect={handleOptionSelect}
      />
    </Card>
  );
}
