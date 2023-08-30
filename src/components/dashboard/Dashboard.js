import style from "./Dashboard.module.css";
import Page from "../UI/Page";
import Card from "../UI/Card";
import { useTheme } from "../../hooks/useTheme";
import {
  getDatabase,
  ref,
  onValue,
  update,
  push,
  child,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import Button from "../UI/Button";
import Loader from "../UI/Loader";
import ListItem from "../lists/ListItem";
import ListCounter from "./ListCounter";

export default function Dashboard() {
  //TODO: fix flash when there are lists? 
  const getClassNames = useTheme(style);

  const [lists, setLists] = useState([]);
  const [listNumbers, setListNumbers] = useState({});
  const [listsLoading, setListsLoading] = useState(true);
  const NO_RECENT_LISTS_SHOWN = 3; //make this a setting?

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();
    const listsRef = ref(db, "users/" + userId + "/lists");

    onValue(listsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const shortList = Object.entries(data)
          .slice(-NO_RECENT_LISTS_SHOWN)
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
  }, []);

  function sendDummyData() {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();

    const dummy = {
      name: "Test list 3",
      achievementProgress: true,
      done: false,
      createDate: new Date(),
      items: {
        vit: [
          { name: "borówa", qty: 3, done: true },
          { name: "marchewa", qty: 1, done: false },
        ],
        "u baby": [{ name: "serek", qty: 2, done: false }],
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

  return (
    <Page>
      <Card>
        <h2 className={style.header}>Dashboard</h2>
        {lists.length === 0 ? (
          <p>You don't have any shopping lists!</p>
        ) : (
          <p>You have {listNumbers.total} shopping lists</p>
        )}
        <hr></hr>
        <div className={style["list-counters-wrapper"]}>
          {listsLoading && <Loader className={style["loader"]} />}
          {!listsLoading && lists.length === 0 && (
            <p>
              Once you've added some, more information about them will be
              displayed here...
            </p>
          )}
          {!listsLoading && lists.length > 0 && 
            <>
              <ListCounter type="open" number={listNumbers.pending}/>
              <ListCounter type="closed" number={listNumbers.done}/>
            </>
          }

        </div>
        <hr></hr>
        <div className={style["lists-wrapper"]}>
          {listsLoading && <Loader className={style["loader"]} />}
          {!listsLoading && lists.length === 0 && (
            <p>
              ...and the {NO_RECENT_LISTS_SHOWN} most recent will be displayed
              here!
            </p>
          )}
          {!listsLoading && lists.length > 0 && (
            <>
              <p>Your {NO_RECENT_LISTS_SHOWN} most recent lists:</p>
              {lists.map((item) => {
                return (
                  <ListItem
                    key={item[0]}
                    id={item[0]}
                    data={item[1]}
                    date="full"
                    mode="edit"
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
      {/* <button onClick={sendDummyData}>add</button> */}
    </Page>
  );
}
