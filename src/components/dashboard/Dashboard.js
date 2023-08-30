import style from "./Dashboard.module.css";
import Page from "../UI/Page";
import Card from "../UI/Card";
import { useTheme } from "../../hooks/useTheme";
import {
  getDatabase,
  ref,
  onValue,
  set,
  update,
  push,
  child,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import Button from "../UI/Button";
import Loader from "../UI/Loader";
import ListItem from "../lists/ListItem";

export default function Dashboard() {
  const getClassNames = useTheme(style);

  const [lists, setLists] = useState("");
  const [listsLoading, setListsLoading] = useState(true);
  const NO_RECENT_LISTS_SHOWN = 3; //make this a setting?

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();
    const listsRef = ref(db, "users/" + userId + "/lists");
    onValue(listsRef, (snapshot) => {
      const data = snapshot.val();
      let result = Object.entries(data).slice(-NO_RECENT_LISTS_SHOWN).reverse();
      setLists(result);
      setListsLoading(false);
    });
  }, []);

  function sendDummyData() {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();

    const dummy = {
      name: "Test list 4",
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
        <h2>Dashboard</h2>
        <p>You have X shopping lists</p>
        <hr></hr>
        <div className={style["list-counters-wrapper"]}>
          <div className={style["list-counters-wrapper"]}>
            <p className={style["list-counter-done"]}>X</p>
            <p>Open</p>
          </div>
          <div className={style["list-counters-wrapper"]}>
            <p className={style["list-counter-done"]}>X</p>
            <p>Closed</p>
          </div>
        </div>
        <hr></hr>
        <div className={style["lists-wrapper"]}>
          {listsLoading && <Loader className={style["loader"]} />}
          {!listsLoading && !lists && (
            <p>
              Once you've added some lists, the three most recent will be
              displayed here
            </p>
          )}
          {!listsLoading && lists && lists.map((item)=>{
            return <ListItem key={item[0]} id={item[0]} data={item[1]} date="full" mode="edit"/>
          })}
        </div>
        <hr></hr>
        <Button type="link" look="primary">
          See all lists
        </Button>
        <Button type="link" look="primary">
          Create a new list
        </Button>
      </Card>
      {/* <button onClick={sendDummyData}>add</button> */}
    </Page>
  );
}
