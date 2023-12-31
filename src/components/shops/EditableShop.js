import { useContext, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import Card from "../UI/Card";
import Icon from "../UI/Icon";
import style from "./EditableShop.module.css";
import { useInput } from "../../hooks/useInput";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, update } from "firebase/database";
import { context } from "../../store/GlobalContext";

export default function EditableShop(props) {
  const getClassNames = useTheme(style);
  const [editMode, setEditMode] = useState(false);

  const { showNotification } = useContext(context);

  const {
    enteredValue,
    enteredValueisValid,
    inputIsValid,
    inputBlurHandler,
    inputChangeHandler,
  } = useInput((value) => {
    return value.trim() !== "" && value.length <= 32;
  }, props.shopName);

  function handleShopDelete() {
    props.onDelete(props.shopId, props.shopName);
  }

  function handleShopEdit() {
    if (!editMode) {
      setEditMode(true);
    } else {
      if (enteredValueisValid) {
        setEditMode(false);
        const auth = getAuth();
        const userId = auth.currentUser.uid;
        const db = getDatabase();
        const shopsRef = ref(db, "users/" + userId + "/shops/" + props.shopId);

        update(shopsRef, {
          name: enteredValue,
        }).catch(() => {
          showNotification(
            "error",
            "Updating name failed",
            "There was a network error when updating the shop name. We're sorry about that. Please try again."
          );
        });
      }
    }
  }

  return (
    <Card nested={true} className={style.shop} role="listitem">
      <Icon
        onClick={handleShopDelete}
        type="button"
        className={style["shop-icon"]}
        icon="fa-solid fa-trash-can"
        aria-label={`Remove shop ${props.shopName}`}
      />
      <div className={style.content}>
        {editMode && (
          <>
            <input
              className={`${style.input} ${getClassNames("input")}`}
              type="text"
              value={enteredValue}
              onChange={inputChangeHandler}
              onBlur={inputBlurHandler}
            ></input>
            {!inputIsValid && (
              <p
                className={`${style["input-invalid-text"]} ${getClassNames(
                  "input-invalid-text"
                )}`}
              >
                Shop name should be between 1 and 32 characters long
              </p>
            )}
          </>
        )}
        {!editMode && <p className={style.name}>{props.shopName}</p>}
      </div>
      <Icon
        onClick={handleShopEdit}
        type="button"
        className={style["shop-icon"]}
        icon={editMode ? "fa-solid fa-check" : "fa-solid fa-pen-to-square"}
        aria-label={editMode ? "Save shop name" : `Edit shop ${props.shopName} name`}
      />
    </Card>
  );
}
