import style from "./HeaderButton.module.css";
import { useTheme } from "../../hooks/useTheme";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import DropdownMenu from "../UI/DropdownMenu";

export default function HeaderButton(props) {
  const getClassNames = useTheme(style);

  const [menuShown, setMenuShown] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);

  function openDropdownHandler() {
    setMenuShown((prevState) => !prevState);
  }

  function handleDropdownClick() {
    setMenuShown(false);
  }

  let timer; 
  const DRAWER_TIMEOUT = 500;

  function handleDropdownMouseEnter() {
    clearTimeout(timer);
  }

  function handleDropdownMouseLeave(event) {
    event.stopPropagation();
    timer = setTimeout(() => {
      setMenuShown(false);
    }, DRAWER_TIMEOUT);
  }

  const location = useLocation();

  useEffect(() => {
    if (props.type === "menu"){
      const visiting = props.menu.some((item)=>{
        return location.pathname.startsWith(item.to);
      });
      setButtonActive(visiting);
    }
  }, [location]);

  function getLinkClassNames({ isActive }) {
    let classes = style.element + " ";
    if (isActive) {
      classes += getClassNames("link-active");
    } else {
      classes += getClassNames("link");
    }
    return classes;
  }

  function getButtonClassNames() {
    let classes = style.element + " " + style["button"] + " ";
    if (buttonActive) {
      classes += getClassNames("link-active");
    } else {
      classes += getClassNames("link");
    }
    return classes;
  }

  return (
    <>
      {props.type === "link" ? (
        <NavLink to={props.to} className={getLinkClassNames} aria-label={props["aria-label"]}>
          <i className={"fa-solid " + props.icon}></i>
        </NavLink>
      ) : (
        <div
          className={style["button-wrapper"]}
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
        >
          <button
            className={getButtonClassNames()}
            onClick={openDropdownHandler}
            aria-haspopup="menu"
            aria-expanded={menuShown}
            aria-controls="dropdown-menu"
            aria-label={props["aria-label"]}
          >
            <i className={"fa-solid " + props.icon}></i>
          </button>
          
            <DropdownMenu
              id="dropdown-menu"
              menu={props.menu}
              shown={menuShown}
              onClick={handleDropdownClick}
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleDropdownMouseLeave}
            />
          
        </div>
      )}
    </>
  );
}
