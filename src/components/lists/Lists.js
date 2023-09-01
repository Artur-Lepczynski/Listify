import style from "./Lists.module.css";
import Page from "../UI/Page";
import Card from "../UI/Card";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import Loader from "../UI/Loader";
import ListItem from "./ListItem";
import { CSSTransition } from "react-transition-group";

export default function Lists(props) {
  //select or edit mode in props
  //this is the list of lists

  const [lists, setLists] = useState([]);
  const [listsLoading, setListsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();
    const listsRef = ref(db, "users/" + userId + "/lists");

    onValue(listsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lists = Object.entries(data).reverse();
        lists.forEach((item) => {
          item[1].id = item[0];
        });

        //sort by date
        let lastDate = new Date(lists[0][1].createDate);
        const result = [lastDate];

        lists.forEach((item)=>{
          const currentDate = new Date(item[1].createDate);
          if (isDayBefore(currentDate, lastDate)) result.push(currentDate);
          result.push(item[1]);
          lastDate = currentDate;
        })
        setLists(result);
        setListsLoading(false);
      }
    });
  }, []);

  function isDayBefore(a, b) {
    return (
      new Date(a.getFullYear(), a.getMonth(), a.getDate()) <
      new Date(b.getFullYear(), b.getMonth(), b.getDate())
    );
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
        timeout={150}
        mountOnEnter
        classNames={{
          enter: style["fade-appear"],
          enterActive: style["fade-appear-active"],
        }}
      >
        <Card>
          {!listsLoading &&
            lists.length > 0 &&
            lists.map((item) => {
              if (item instanceof Date) {
                return (
                  <p key={item.valueOf()} className={style["date"]}>
                    {item.toLocaleDateString("en-gb", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                );
              } else {
                return (
                  <ListItem
                    key={item.id}
                    id={item.id}
                    data={item}
                    date="hour"
                    mode={props.mode}
                  />
                );
              }
            })}
        </Card>
      </CSSTransition>
    </Page>
  );
}