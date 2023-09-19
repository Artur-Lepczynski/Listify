import style from "./ListItem.module.css";
import { getAuth } from "firebase/auth";
import { useTheme } from "../../hooks/useTheme";
import Card from "../UI/Card";
import Icon from "../UI/Icon";
import ProductCounter from "../UI/ProductCounter";
import { getDatabase, ref, update } from "firebase/database";
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { context } from "../../store/GlobalContext";

export default function ListItem(props) {
  const getClassNames = useTheme(style);
  const { showNotification } = useContext(context);

  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  let options = { hour: "2-digit", minute: "2-digit" };
  if (props.date === "full")
    options.year = options.month = options.day = "2-digit";

  const listCreateDate = new Date(props.data.createDate);
  let dateString = listCreateDate.toLocaleString("en-gb", options);

  if (props.date === "full") {
    if (isXDaysBefore(listCreateDate, 0)) {
      dateString = "Today," + dateString.split(",")[1];
    } else if (isXDaysBefore(listCreateDate, 1)) {
      dateString = "Yesterday," + dateString.split(",")[1];
    }
  }

  function isXDaysBefore(dateToCheck, x) {
    const today = new Date();
    today.setDate(today.getDate() - x);
    return (
      dateToCheck.getFullYear() === today.getFullYear() &&
      dateToCheck.getMonth() === today.getMonth() &&
      dateToCheck.getDate() === today.getDate()
    );
  }

  function handleMouseEnter() {
    setHover(true);
  }

  function handleMouseLeave() {
    setHover(false);
  }

  function handleListClick() {
    if (props.mode === "select") {
      navigate("/lists/" + props.id);
    } else if (props.mode === "edit") {
      navigate("/edit/lists/" + props.id);
    }
  }

  const cardRef = useRef(null);

  function handleKeyDown(event) {
    if (event.key === "Enter" && cardRef.current === document.activeElement) {
      handleListClick();
    }
  }

  function handleListStatusChange() {
    const done = props.data.done;

    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();

    update(ref(db, "users/" + userId + "/lists/" + props.id), {
      done: !done,
    })
      .then(() => {
        trackStats(done, db, userId, props.id);
      })
      .catch(() => {
        showNotification(
          "error",
          "Changing list status failed",
          "There was a network error when changing list status. We're sorry about that. Please try again."
        );
      });
  }

  function trackStats(done, db, userId, listKey) {
    const createDate = new Date(props.data.createDate);

    const statsRef = ref(
      db,
      "users/" +
        userId +
        "/stats/" +
        createDate.getFullYear() +
        "/" +
        (createDate.getMonth() + 1) +
        "/" +
        createDate.getDate() +
        "/" +
        listKey
    );

    update(statsRef, { done: !done }).catch(() => {
      showNotification(
        "error",
        "Tracking stats failed",
        "There was a network error when tracking usage statistics for this list. We're sorry about that. Please try to set this list as" +
          (done ? "open" : "closed") +
          "again."
      );
    });
  }

  function handleListDeleteButtonClick() {
    props.onDelete(props.id, props.data.name);
  }

  return (
    <Card nested={true} className={style["list-item"]} role="listitem">
      <div
        className={style["list-item-text"]}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleListClick}
        onKeyDown={handleKeyDown}
        ref={cardRef}
        tabIndex={0}
        role="button"
        aria-label={`List named ${props.data.name}, status: ${
          props.data.done ? "closed" : "open"
        }}`}
      >
        <div className={style["list-item-header"]}>
          <p className={`${hover && getClassNames("hover")}`}>
            {props.data.name}
          </p>
          <p className={style["list-item-date"]}>{dateString}</p>
        </div>
        <ProductCounter done={props.data.done} items={props.data.items} />
      </div>
      <div className={style["list-item-controls"]}>
        <Icon
          type="button"
          icon={
            props.data.done
              ? "fa-regular fa-square-check"
              : "fa-regular fa-square"
          }
          className={style["list-item-controls-icon"]}
          onClick={handleListStatusChange}
          aria-label={`Set list named ${props.data.name} as ${props.data.done ? "open" : "closed"}`}
        />
        {props.mode === "select" && (
          <Icon
            type="link"
            to={"/edit/lists/" + props.id}
            icon="fa-regular fa-pen-to-square"
            className={style["list-item-controls-icon"]}
            aria-label={`Edit list named ${props.data.name}`}
          />
        )}
        {props.mode === "edit" && (
          <Icon
            type="button"
            icon="fa-solid fa-trash-can"
            className={style["list-item-controls-icon"]}
            onClick={handleListDeleteButtonClick}
            aria-label={`Delete list named ${props.data.name}`}
          />
        )}
      </div>
    </Card>
  );
}
