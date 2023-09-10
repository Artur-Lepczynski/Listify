import style from "./Dashboard.module.css";
import Page from "../UI/Page";
import Card from "../UI/Card";
import {
  getDatabase,
  ref,
  onValue,
  update,
  push,
  child,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import Button from "../UI/Button";
import Loader from "../UI/Loader";
import ListItem from "../lists/ListItem";
import ListCounter from "./ListCounter";
import { CSSTransition } from "react-transition-group";
import { context } from "../../store/GlobalContext";

export default function Dashboard() {
  const [lists, setLists] = useState([]);
  const [listNumbers, setListNumbers] = useState({});
  const [listsLoading, setListsLoading] = useState(true);

  const {
    settings: { noListsShownDashboard },
  } = useContext(context);

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();
    const listsRef = ref(db, "users/" + userId + "/lists");

    onValue(listsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const shortList = Object.entries(data)
          .slice(-noListsShownDashboard)
          .reverse();
        setLists(shortList);

        const list = Object.values(data);
        const doneNumber = list.reduce((acc, item) => {
          return acc + +item.done;
        }, 0);

        setListNumbers({
          total: list.length,
          done: doneNumber,
          pending: list.length - doneNumber,
        });
      }

      setListsLoading(false);
    });
  }, [noListsShownDashboard]);

  function sendDummyData() {
    function getRandomKey() {
      return (Math.random() + "").slice(2);
    }

    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();

    const dummy = {
      name: "Test list 6 no note",
      achievementProgress: true,
      done: false,
      createDate: new Date(),
      note: "",
      items: {
        vit: {
          [getRandomKey()]: { name: "borówa", qty: 3, done: true },
          [getRandomKey()]: { name: "marchewa", qty: 1, done: false },
        },
        "u baby": { [getRandomKey()]: { name: "serek", qty: 2, done: false } },
        Apteka: { [getRandomKey()]: { name: "apap", qty: 1, done: false } },
        test: {
          c: { name: "test", qty: 1, done: false },
          b: { name: "test", qty: 1, done: false },
          a: { name: "test", qty: 1, done: false },
          3: { name: "test", qty: 1, done: true },
          2: { name: "test", qty: 1, done: false },
          1: { name: "test", qty: 1, done: false },
        },
      },
    };

    const newListKey = push(child(ref(db), "users/" + userId + "/lists/")).key;

    update(ref(db, "users/" + userId + "/lists/" + newListKey), dummy)
      .then(() => {
        console.log("success?");
      })
      .catch((err) => {
        console.log("fail?", err);
      });
  }

  function sendDummyShop() {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();

    const dummy = { name: "Piekarnia" };
    const newShopKey = push(child(ref(db), "users/" + userId + "/shops/")).key;

    update(ref(db, "users/" + userId + "/shops/" + newShopKey), dummy)
      .then(() => {
        console.log("success?");
      })
      .catch((err) => {
        console.log("fail?", err);
      });
  }

  return (
    <Page>
      {listsLoading && (
        <div className={style["loader-wrapper"]}>
          <Loader className={style.loader} />
        </div>
      )}

      <CSSTransition
        in={!listsLoading}
        appear={!listsLoading}
        timeout={150}
        mountOnEnter
        classNames={{
          enter: style["fade-appear"],
          enterActive: style["fade-appear-active"],
        }}
      >
        <Card>
          <h2 className={style.header}>Dashboard</h2>
          {lists.length === 0 ? (
            <p>You don't have any shopping lists!</p>
          ) : (
            <p>You have {listNumbers.total} shopping lists</p>
          )}
          <hr></hr>
          <div className={style["list-counters-wrapper"]}>
            {lists.length === 0 && (
              <p>
                Once you've added some, more information about them will be
                displayed here...
              </p>
            )}
            {lists.length > 0 && (
              <>
                <ListCounter type="open" number={listNumbers.pending} />
                <ListCounter type="closed" number={listNumbers.done} />
              </>
            )}
          </div>
          <hr></hr>
          <div className={style["lists-wrapper"]}>
            {lists.length === 0 && (
              <p>
                {noListsShownDashboard === 1
                  ? "...and the most recent list will be displayed here!"
                  : `...and the ${noListsShownDashboard} most recent will be displayed
                here!`}
              </p>
            )}
            {lists.length > 0 && (
              <>
                <p>
                  {noListsShownDashboard === 1
                    ? "Your most recent list:"
                    : `Your ${noListsShownDashboard} most recent lists:`}
                </p>
                {lists.map((item) => {
                  return (
                    <ListItem
                      key={item[0]}
                      id={item[0]}
                      data={item[1]}
                      date="full"
                      mode="select"
                    />
                  );
                })}
              </>
            )}
          </div>
          <hr></hr>
          <nav className={style.actions}>
            <Button type="link" look="primary" to="/lists">
              See all lists
            </Button>
            <Button type="link" look="primary" to="/add">
              Add a new list
            </Button>
          </nav>
        </Card>
      </CSSTransition>

      {/* <button onClick={sendDummyData}>add</button> */}
      {/* <button onClick={sendDummyShop}>send shop</button> */}
    </Page>
  );
}