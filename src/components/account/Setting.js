import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import Card from "../UI/Card";
import Switch from "../UI/Switch";
import style from "./Setting.module.css";
import Prompt from "../UI/Prompt";

export default function Setting(props) {
  const getClassNames = useTheme(style);
  const [settingPromptShown, setSettingPromptShown] = useState(false);
  const [clickCoordinates, setClickCoordinates] = useState({ x: 0, y: 0 });

  function handleSwitchToggle(value) {
    props.onToggle(props.settingKey, value);
  }

  function handlePromptlOpen(event) {
    setClickCoordinates({ x: event.pageX, y: event.pageY });
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
          settingName={props.name}
          className={style.switch}
          checked={props.current}
          onToggle={handleSwitchToggle}
        />
      )}
      {props.type === "options" && (
        <button
          onClick={handlePromptlOpen}
          className={`${style.button} ${getClassNames("button")}`}
          aria-label={"Change" + props.name + " " + props.current}
          aria-haspopup="menu"
          aria-controls="settings-prompt"
          aria-expanded={settingPromptShown}
        >
          {props.options.get?.(props.current) || props.current}
        </button>
      )}
      <Prompt
        id="settings-prompt"
        mode="setting"
        shown={settingPromptShown}
        setShown={setSettingPromptShown}
        coordinates={clickCoordinates}
        options={getOptions()}
        selected={getSelected()}
        onBackgroundClick={handlePromptBackgroundClick}
        onSelect={handleOptionSelect}
      />
    </Card>
  );
}
