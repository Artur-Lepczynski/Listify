import style from "./ViewableList.module.css";
import { useParams } from "react-router-dom";
import Page from "../UI/Page";
import { useContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref, update } from "firebase/database";
import Card from "../UI/Card";
import ProductCounter from "../UI/ProductCounter";
import ViewableShop from "./ViewableShop";
import Loader from "../UI/Loader";
import Button from "../UI/Button";
import { useTheme } from "../../hooks/useTheme";
import { CSSTransition } from "react-transition-group";
import { context } from "../../store/GlobalContext";

export default function ViewableList() {
  const params = useParams();

  const [list, setList] = useState({});
  const [shops, setShops] = useState({});
  const [loading, setLoading] = useState({ list: true, shops: true });
  const [error, setError] = useState(false);

  const getClassNames = useTheme(style);
  const { showNotification } = useContext(context);

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const listId = params.listId;
    const db = getDatabase();
    const listsRef = ref(db, "users/" + userId + "/lists/" + listId);

    //list:
    onValue(listsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setList(data);
        setLoading((prev) => {
          return { ...prev, list: false };
        });
      } else {
        setList({});
        setError(true);
        setLoading((prev) => {
          return { ...prev, list: false };
        });
      }
    });

    //shops:
    const shopsRef = ref(db, "users/" + userId + "/shops");
    onValue(shopsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setShops(data);
      }
      setLoading((prev) => {
        return { ...prev, shops: false };
      });
    });
  }, []);

  function findShopName(shopId) {
    const name = shops[shopId]?.name;
    if (!name) return "Removed shop";
    return name;
  }

  function handleProductStatusChange(shopId, productId, status) {
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

    update(ref(db, path), { done: status })
      .then(() => {
        trackStats("product", status, db, userId, listId);
      })
      .catch((error) => {
        showNotification(
          "error",
          "Error",
          "An error occurred when changing product status. Please try again."
        );
      });
  }

  function handleListStatusChange() {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const listId = params.listId;
    const db = getDatabase();
    let path = "users/" + userId + "/lists/" + listId;

    update(ref(db, path), { done: !list.done })
      .then(() => {
        trackStats("list", !list.done, db, userId, listId);
      })
      .catch((error) => {
        showNotification(
          "error",
          "Error",
          "An error occurred when changing list status. Please try again."
        );
      });
  }

  function trackStats(mode, done, db, userId, listKey) {
    const createDate = new Date(list.createDate);
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
    if (mode === "list") {
      update(statsRef, { done }).catch((err) => {
        console.log("there was an error tracking stats", err);
      });
    } else if (mode === "product") {
      let prodDoneNumber = Object.values(list.items).reduce((acc, shop) => {
        return (
          acc +
          Object.values(shop).reduce((acc, product) => {
            return acc + +product.done;
          }, 0)
        );
      }, 0);

      done ? prodDoneNumber++ : prodDoneNumber--;

      update(statsRef, { prodDoneNumber }).catch((err) => {
        console.log("there was an error tracking stats", err);
      });
    }
  }

  return (
    <Page>
      {(loading.list || loading.shops) && (
        <div className={style["loader-wrapper"]}>
          <Loader className={style.loader} />
        </div>
      )}
      {error && !(loading.list || loading.shops) && (
        <Card>
          <p className={style["error-text"]}>This list does not exist</p>
        </Card>
      )}
      <CSSTransition
        in={!error && !(loading.list || loading.shops)}
        appear={!error && !(loading.list || loading.shops)}
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
        <div className={style.test}>
          <div className={style["list-header"]}>
            <h2 className={style.header}>{list.name}</h2>
            <ProductCounter
              className={style["header-counter"]}
              done={list.done || false}
              items={list.items || {}}
            />
          </div>
          <Card>
            {!error &&
              !(loading.list || loading.shops) &&
              Object.entries(list.items).map((item) => {
                return (
                  <ViewableShop
                    key={item[0]}
                    id={item[0]}
                    name={findShopName(item[0])}
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
