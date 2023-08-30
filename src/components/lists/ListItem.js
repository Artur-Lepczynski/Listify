import style from "./ListItem.module.css";
import { getAuth } from "firebase/auth";
import { useTheme } from "../../hooks/useTheme";
import Card from "../UI/Card";
import Icon from "../UI/Icon";
import ProductCounter from "../UI/ProductCounter";
import { getDatabase, ref, remove, update } from "firebase/database";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ListItem(props) {
  //props.data -> done, #total, #done, #notDone, date - full/hour, mode - edit/delete, name
  //props.id

  const getClassNames = useTheme(style); 

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

  function handleListClick(){
    navigate("/lists/"+props.id);
  }

  function handleListStatusChange() {
    const done = props.data.done;

    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();

    update(ref(db, "users/" + userId + "/lists/" + props.id), { done: !done });
  }

  function handleListDelete() {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();

    remove(ref(db, "users/" + userId + "/lists/" + props.id));
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
          <p className={`${hover && getClassNames("hover")}`}>{props.data.name}</p>
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
        {props.mode === "edit" && (
          <Icon
            type="link"
            to={"/edit/lists/" + props.id}
            icon="fa-regular fa-pen-to-square"
            className={style["list-item-controls-icon"]}
          />
        )}
        {props.mode === "delete" && (
          <Icon
            type="button"
            icon="fa-solid fa-trash-can"
            className={style["list-item-controls-icon"]}
            onClick={handleListDelete}
          />
        )}
      </div>
    </Card>
  );
}
