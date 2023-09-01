import style from "./ViewableList.module.css";
import { useParams } from "react-router-dom";
import Page from "../UI/Page";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref, update } from "firebase/database";
import Card from "../UI/Card";
import ProductCounter from "../UI/ProductCounter";
import ViewableShop from "./ViewableShop";
import Loader from "../UI/Loader";
import Button from "../UI/Button";
import { useTheme } from "../../hooks/useTheme";
import { CSSTransition } from "react-transition-group";

export default function ViewableList() {
  const params = useParams();

  const [list, setList] = useState({});
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState(false);

  const getClassNames = useTheme(style);

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const listId = params.listId;
    const db = getDatabase();
    const listsRef = ref(db, "users/" + userId + "/lists/" + listId);

    onValue(listsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setList(data);
        setListLoading(false);
      } else {
        setError(true);
        setListLoading(false);
      }
    });
  }, []);

  function handleProductStatusChange(productId, shopId, status) {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const listId = params.listId;
    const db = getDatabase();
    let path =
      "users/" +
      userId +
      "/lists/" +
      listId +
      "/items/" +
      shopId +
      "/" +
      productId;

    update(ref(db, path), { done: status }).catch((error) => {
      //TODO: show error notification
    });
  }

  function handleListStatusChange() {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const listId = params.listId;
    const db = getDatabase();
    let path = "users/" + userId + "/lists/" + listId;

    update(ref(db, path), { done: !list.done }).catch((error) => {
      //TODO: show error notification
    });
  }

  return (
    <Page>
      {listLoading && (
        <div className={style["loader-wrapper"]}>
          <Loader className={style.loader} />
        </div>
      )}
      {error && !listLoading && (
        <Card>
          <p className={style["error-text"]}>This list does not exist</p>
        </Card>
      )}
        <CSSTransition
          in={!error && !listLoading}
          appear={!error && !listLoading}
          timeout={150}
          mountOnEnter
          classNames={{
            enter: style["fade-appear"],
            enterActive: style["fade-appear-active"],
          }}
        >
          <div className={style.test}>
            <div className={style["list-header"]}>
              <h2 className={style.header}>{list.name}</h2>
              <ProductCounter
                className={style["header-counter"]}
                done={list.done}
                items={list.items}
              />
            </div>
            <Card>
              {!error && !listLoading && Object.entries(list.items).map((item) => {
                return (
                  <ViewableShop
                    key={item[0]}
                    name={item[0]}
                    items={item[1]}
                    onStatusChange={handleProductStatusChange}
                  />
                );
              })}
              {list.note && (
                <div>
                  <h3 className={style["note-header"]}>Note:</h3>
                  <div
                    className={`${style["note-text-wrapper"]} ${getClassNames(
                      "note-text-wrapper"
                    )}`}
                  >
                    <p className={style["note-text"]}>{list.note}</p>
                  </div>
                </div>
              )}
            </Card>
            <Button
              look="primary"
              type="button"
              onClick={handleListStatusChange}
              className={style.button}
            >
              {list.done ? "Mark as not done" : "Mark as done"}
            </Button>
          </div>
        </CSSTransition>
      
    </Page>
  );
}