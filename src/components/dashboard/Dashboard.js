import style from "./Dashboard.module.css";
import Page from "../UI/Page";
import Card from "../UI/Card";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import Button from "../UI/Button";
import Loader from "../UI/Loader";
import ListItem from "../lists/ListItem";
import Counter from "../UI/Counter";
import { CSSTransition } from "react-transition-group";
import { context } from "../../store/GlobalContext";
import Separator from "../UI/Separator";

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
            <p>
              You have {listNumbers.total} shopping list
              {listNumbers.total > 1 && "s"}
            </p>
          )}
          <Separator />
          <div className={style["list-counters-wrapper"]}>
            {lists.length === 0 && (
              <p>
                Once you've added some, more information about them will be
                displayed here...
              </p>
            )}
            {lists.length > 0 && (
              <>
                <Counter
                  type="open"
                  caption="Open"
                  number={listNumbers.pending}
                />
                <Counter
                  type="closed"
                  caption="Closed"
                  number={listNumbers.done}
                />
              </>
            )}
          </div>
          <Separator />
          <p className={style["recent-lists-text"]}>
            {lists.length !== 0 && (noListsShownDashboard === 1
              ? "Your most recent list:"
              : `Your ${noListsShownDashboard} most recent lists:`)}
          </p>
          <div className={style["lists-wrapper"]} role="list">
            {lists.length === 0 && (
              <p className={style["recent-lists-text"]}>
                {noListsShownDashboard === 1
                  ? "...and the most recent list will be displayed here!"
                  : `...and the ${noListsShownDashboard} most recent will be displayed
                here!`}
              </p>
            )}
            {lists.length > 0 && (
              <>
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
          <Separator />
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
    </Page>
  );
}
