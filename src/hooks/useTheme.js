import { useContext } from "react";
import { context } from "../store/GlobalContext";

export function useTheme(style) {
  const ctx = useContext(context);
  const theme = ctx.theme;

  function getClassName(name) {
    return style[name + "-" + theme];
  }

  return getClassName;
}
