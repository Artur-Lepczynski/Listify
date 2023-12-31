import style from "./Header.module.css";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useTheme } from "../../hooks/useTheme";
import logo from "../../images/logo512.png";
import Button from "../UI/Button";
import { CSSTransition } from "react-transition-group";
import HeaderButton from "./HeaderButton";
import { Link } from "react-router-dom";

export default function Header() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const getClassNames = useTheme(style);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setUserLoggedIn(!!user);
    });
  }, []);

  return (
    <header className={`${style.header} ${getClassNames("header")}`}>
      <CSSTransition
        in={!userLoggedIn}
        mountOnEnter
        unmountOnExit
        timeout={100}
        classNames={{
          enter: style["header-not-logged-in-enter"],
          enterActive: style["header-not-logged-in-enter-active"],
          exit: style["header-not-logged-in-exit"],
          exitActive: style["header-not-logged-in-exit-active"],
        }}
      >
        <div className={style["header-not-logged-in"]}>
          <Link to="/">
            <img alt="Listyfy logo" height={48} width={48} src={logo}></img>
          </Link>
          <nav>
            <Button
              type="link"
              look="primary"
              to="/auth?action=signup"
              className={style["header-button"]}
            >
              Sign up
            </Button>
            <Button
              type="link"
              look="secondary"
              to="/auth?action=login"
              className={style["header-button"]}
            >
              Log in
            </Button>
          </nav>
        </div>
      </CSSTransition>
      <CSSTransition
        in={userLoggedIn}
        mountOnEnter
        unmountOnExit
        timeout={100}
        classNames={{
          enter: style["header-logged-in-enter"],
          enterActive: style["header-logged-in-enter-active"],
          exit: style["header-logged-in-exit"],
          exitActive: style["header-logged-in-exit-active"],
        }}
      >
        <nav
          className={`${style["header-logged-in"]} ${getClassNames(
            "header-logged-in"
          )}`}
        >
          {/* icon, type=link/menu, to, menu - {to, name}*/}
          <HeaderButton type="link" to="/dash" icon="fa-house-chimney-window" aria-label="Dashboard"/>
          <HeaderButton type="link" to="/lists" icon="fa-list-ul" aria-label="All lists"/>
          <HeaderButton type="link" to="/add" icon="fa-plus" aria-label="Add new list"/>
          <HeaderButton
            type="menu"
            icon="fa-pen-to-square"
            aria-label="Manage lists and shops"
            menu={[
              { to: "/edit/lists", name: "Manage lists" },
              { to: "/edit/shops", name: "Manage shops" },
            ]}
          />
          <HeaderButton type="link" to="/account" icon="fa-user" aria-label="Settings, account and statistics"/>
        </nav>
      </CSSTransition>
    </header>
  );
}
