import React, { useContext } from "react";
import style from "./Lists.module.css";
import Page from "../UI/Page";
import Card from "../UI/Card";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import Loader from "../UI/Loader";
import ListItem from "./ListItem";
import { CSSTransition } from "react-transition-group";
import Separator from "../UI/Separator";
import { context } from "../../store/GlobalContext";
import Modal from "../UI/Modal";

export default function Lists(props) {
  const [lists, setLists] = useState([]);
  const [listsLoading, setListsLoading] = useState(true);
  
  const [deleteModalShown, setDeleteModalShown] = useState(false);
  const [deletedListName, setDeletedListName] = useState("");
  const [deletedListId, setDeletedListId] = useState("");

  const {
    showNotification,
    settings: { askBeforeListDelete, removeListNotification },
  } = useContext(context);

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();
    const listsRef = ref(db, "users/" + userId + "/lists");

    onValue(listsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const lists = Object.entries(data).reverse();
        lists.forEach((item) => {
          item[1].id = item[0];
        });

        const listsSorted = sortListsByDate(lists);
        setLists(listsSorted);
      } else {
        setLists([]);
      }
      setListsLoading(false);
    });
  }, []);

  function sortListsByDate(lists) {
    let lastDate = new Date(lists[0][1].createDate);
    const result = [lastDate];

    lists.forEach((item) => {
      const currentDate = new Date(item[1].createDate);
      if (isDayBefore(currentDate, lastDate)) result.push(currentDate);
      result.push(item[1]);
      lastDate = currentDate;
    });
    return result;
  }

  function isDayBefore(a, b) {
    return (
      new Date(a.getFullYear(), a.getMonth(), a.getDate()) <
      new Date(b.getFullYear(), b.getMonth(), b.getDate())
    );
  }

  function handleListDeleteButtonClick(id, listName) {
    if (askBeforeListDelete) {
      setDeleteModalShown(true);
      setDeletedListName(listName);
      setDeletedListId(id);
    } else {
      handleListDelete(id, listName);
    }
  }

  function handleModalConfirm() {
    setDeleteModalShown(false);
    handleListDelete(deletedListId, deletedListName);
  }

  function handleModalCancel() {
    setDeleteModalShown(false);
  }

  function handleListDelete(listId, listName) {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();

    remove(ref(db, "users/" + userId + "/lists/" + listId))
      .then(() => {
        if (removeListNotification) {
          showNotification(
            "information",
            "List removed",
            'The list "' + listName + '" has been removed.'
          );
        }
      })
      .catch(() => {
        showNotification(
          "error",
          "Removing list failed",
          "There was a network error when removing the list. We're sorry about that. Please try again."
        );
      });
  }

  return (
    <Page>
      {listsLoading && (
        <div className={style["loader-wrapper"]}>
          <Loader className={style.loader} />
        </div>
      )}
      {!listsLoading && lists.length === 0 && (
        <Card>
          <p className={style["no-lists-text"]}>
            You don't have any lists. Try adding some!
          </p>
        </Card>
      )}
      <CSSTransition
        in={!listsLoading && lists.length > 0}
        appear={!listsLoading && lists.length > 0}
        timeout={{
          appear: 150,
        }}
        mountOnEnter
        unmountOnExit
        classNames={{
          enter: style["fade-appear"],
          enterActive: style["fade-appear-active"],
        }}
      >
        <Card role="list">
          {!listsLoading &&
            lists.length > 0 &&
            lists.map((item) => {
              if (item instanceof Date) {
                return (
                  <React.Fragment key={item.valueOf()}>
                    <p className={style["date"]}>
                      {item.toLocaleDateString("en-gb", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <Separator />
                  </React.Fragment>
                );
              } else {
                return (
                  <ListItem
                    key={item.id}
                    id={item.id}
                    data={item}
                    date="hour"
                    mode={props.mode}
                    onDelete={handleListDeleteButtonClick}
                  />
                );
              }
            })}
          <Modal
            type="choice"
            in={deleteModalShown}
            title="Confirm list removal"
            message={'Are you sure you want to remove "' + deletedListName + '"?'}
            confirmText="Remove"
            onConfirm={handleModalConfirm}
            cancelText="Cancel"
            onCancel={handleModalCancel}
          />
        </Card>
      </CSSTransition>
    </Page>
  );
}
