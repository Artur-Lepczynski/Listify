import style from "./ListItem.module.css";
import { getAuth } from "firebase/auth";
import { useTheme } from "../../hooks/useTheme";
import Card from "../UI/Card";
import Icon from "../UI/Icon";
import ProductCounter from "../UI/ProductCounter";
import { getDatabase, ref, remove, update } from "firebase/database";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { context } from "../../store/GlobalContext";
import Modal from "../UI/Modal";

export default function ListItem(props) {
  //props.data -> done, #total, #done, #notDone, date - full/hour, mode - select/edit, name
  //props.id

  const getClassNames = useTheme(style);
  const {
    showNotification,
    settings: { askBeforeListDelete, removeListNotification },
  } = useContext(context);

  const [deleteModalShown, setDeleteModalShown] = useState(false);
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  let options = { hour: "2-digit", minute: "2-digit" };
  if (props.date === "full")
    options.year = options.month = options.day = "2-digit";

  const dateString = new Date(props.data.createDate).toLocaleString(
    "en-gb",
    options
  );

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
          "Error",
          "An error occurred when changing list status. Please try again."
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

    update(statsRef, {done: !done}).catch((err)=>{
      console.log("there was an error tracking stats", err);
    });
  }

  function handleListDeleteButtonClick() {
    if (askBeforeListDelete) {
      setDeleteModalShown(true);
    } else {
      removeList();
    }
  }

  function handleModalConfirm() {
    setDeleteModalShown(false);
    removeList();
  }

  function handleModalCancel() {
    setDeleteModalShown(false);
  }

  function removeList() {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();

    remove(ref(db, "users/" + userId + "/lists/" + props.id))
      .then(() => {
        if (removeListNotification) {
          showNotification(
            "information",
            "List removed",
            'The list "' + props.data.name + '" has been removed.'
          );
        }
      })
      .catch((error) => {
        console.log("error removing list:", error);
        showNotification(
          "error",
          "Error",
          "An error occurred while removing the list. Please try again later."
        );
      });
  }

  return (
    <Card nested={true} className={style["list-item"]}>
      <div
        className={style["list-item-text"]}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleListClick}
      >
        <div className={style["list-item-name-time"]}>
          <p className={`${hover && getClassNames("hover")}`}>
            {props.data.name}
          </p>
          <p>{dateString}</p>
        </div>
        <ProductCounter done={props.data.done} items={props.data.items} />
      </div>
      <div className={style["list-item-controls"]}>
        {props.data.done ? (
          <Icon
            type="button"
            icon="fa-regular fa-square-check"
            className={style["list-item-controls-icon"]}
            onClick={handleListStatusChange}
          />
        ) : (
          <Icon
            type="button"
            icon="fa-regular fa-square"
            className={style["list-item-controls-icon"]}
            onClick={handleListStatusChange}
          />
        )}
        {props.mode === "select" && (
          <Icon
            type="link"
            to={"/edit/lists/" + props.id}
            icon="fa-regular fa-pen-to-square"
            className={style["list-item-controls-icon"]}
          />
        )}
        {props.mode === "edit" && (
          <Icon
            type="button"
            icon="fa-solid fa-trash-can"
            className={style["list-item-controls-icon"]}
            onClick={handleListDeleteButtonClick}
          />
        )}
      </div>
      <Modal
        type="choice"
        in={deleteModalShown}
        title="Confirm list removal"
        message={'Please confirm the removal of "' + props.data.name + '".'}
        confirmText="Remove"
        onConfirm={handleModalConfirm}
        cancelText="Cancel"
        onCancel={handleModalCancel}
      />
    </Card>
  );
}
