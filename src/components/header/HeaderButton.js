import style from "./HeaderButton.module.css";
import { useTheme } from "../../hooks/useTheme";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function HeaderButton(props) {
  // icon, type=link/menu, to, menu - {to, name}
  const getClassNames = useTheme(style);

  const [menuShown, setMenuShown] = useState(false);
  const [buttonActive, setButtonActive] = useState(false); 

  const location = useLocation(); 

  useEffect(()=>{
    if(props.type === "menu") setButtonActive(location.pathname.startsWith(props.to))
  }, [location])

  function getLinkClassNames({ isActive }) {
    let classes = style.element + " ";
    if (isActive) {
      classes += getClassNames("link-active");
    } else {
      classes += getClassNames("link");
    }
    return classes;
  }

  function getButtonClassNames(){
    let classes = style.element + " "; 
    if(buttonActive){
      classes += getClassNames("link-active"); 
    }else{
      classes += getClassNames("link");
    }
    return classes; 
  }

  function openDrawerHandler(){
    console.log("edit buttą clicked")
  }

  return (
    <>
      {props.type === "link" ? (
        <NavLink to={props.to} className={getLinkClassNames}>
          <i className={"fa-solid " + props.icon}></i>
        </NavLink>
      ) : (
        <button className={getButtonClassNames()} onClick={openDrawerHandler}>
          <i className={"fa-solid " + props.icon}></i>
        </button>
      )}
    </>
  );
}
