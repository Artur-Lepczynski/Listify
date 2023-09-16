import style from "./Account.module.css";
import Page from "../UI/Page";
import Button from "../UI/Button";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { getDatabase, onValue, ref, update } from "firebase/database";
import { context } from "../../store/GlobalContext";
import Card from "../UI/Card";
import Loader from "../UI/Loader";
import { CSSTransition } from "react-transition-group";
import Setting from "./Setting";
import Modal from "../UI/Modal";
import Counter from "../UI/Counter";
import Graph from "./Graph";

export default function Account() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState({ settings: true, stats: true });
  const { settings, dispatchSettings, showNotification } =
    useContext(context);
  const [logoutModalShown, setLogoutModalShown] = useState(false);

  const [databaseStats, setDatabaseStats] = useState({});

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();
    const settingsRef = ref(db, "users/" + userId + "/settings");
    onValue(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const dbSettings = snapshot.val();
        dispatchSettings({ type: "SET_SETTINGS", settings: dbSettings });
      }
      setLoading((prev) => ({ ...prev, settings: false }));
    });

    const statsRef = ref(db, "users/" + userId + "/stats");
    onValue(statsRef, (snapshot) => {
      if (snapshot.exists()) {
        const dbStats = snapshot.val();
        setDatabaseStats(dbStats);
      }
      setLoading((prev) => ({ ...prev, stats: false }));
    });
  }, []);

  const [settingsList, setSettingsList] = useState([]);

  useEffect(() => {
    const settingNames = {
      theme: "Theme",
      noListsShownDashboard: "Number of lists shown on dashboard",
      askBeforeListDelete: "Ask before removing a list",
      askBeforeShopDelete: "Ask before removing a shop",
      askBeforeProductDeleteEdit: "Ask before removing a product when editing a list",
      askBeforeShopDeleteEdit: "Ask before removing a shop when editing a list",
      addListNotification: "Notify me when a list has been added or modified",
      removeListNotification: "Notify me when a list has been removed",
      addShopNotification: "Notify me when a shop has been added",
      removeShopNotification: "Notify me when a shop has been removed",
    }
    const newSettingsList = [];
    for (const key in settings) {
      const setting = {
        type: "options",
        name: settingNames[key],
        current: settings[key],
        settingKey: key,
      }
      if (key === "theme") {
          setting.options = new Map([
            ["pearlShores", "Pearl Shores"],
            ["midnight", "Midnight"],
            ["bubblegum", "Bubblegum"],
            ["blueLagoon", "Blue Lagoon"],
            ["deepOcean", "Deep Ocean"],
          ]);
      } else if (key === "noListsShownDashboard") {
          setting.options = [1, 3, 5, 7];
      } else {
          setting.type = "toggle";
      }
      newSettingsList.push(setting);
    }
    setSettingsList(newSettingsList);
  }, [settings]);

  const [lifetimeStats, setLifetimeStats] = useState({});
  const [monthStats, setMonthStats] = useState({});
  const [yearStats, setYearStats] = useState({});

  useEffect(() => {
    setLifetimeStats(calculateLifetimeStats(databaseStats));
    setMonthStats(getTimeframeStats(databaseStats, "month"));
    setYearStats(getTimeframeStats(databaseStats, "year"));
  }, [databaseStats]);

  function calculateLifetimeStats(object) {
    let result = {
      lists: 0,
      doneLists: 0,
      products: 0,
      doneProducts: 0,
    };
    if ("done" in object) {
      result.lists++;
      if (object.done) result.doneLists++;
      result.products += object.prodNumber;
      result.doneProducts += object.prodDoneNumber;
    } else {
      Object.values(object).forEach((value) => {
        const returned = calculateLifetimeStats(value);
        for (const key in returned) result[key] += returned[key];
      });
    }
    return result;
  }

  function getTimeframeStats(databaseStats, type) {
    const timeframe = type === "year" ? 12 : 30;
    const lists = new Array(timeframe).fill(0);
    const listsOpen = new Array(timeframe).fill(0);
    const products = new Array(timeframe).fill(0);
    const productsDone = new Array(timeframe).fill(0);
    const graphLabels = [];

    let counter = 0;
    const date = new Date();

    while (counter < timeframe) {
      const listsObject =
        type === "year"
          ? databaseStats[date.getFullYear()]?.[date.getMonth() + 1]
          : databaseStats[date.getFullYear()]?.[date.getMonth() + 1]?.[
              date.getDate()
            ];

      graphLabels[timeframe - 1 - counter] =
        type === "year"
          ? date.toLocaleString("en-gb", { month: "long" })
          : date.getDate() + "/" + (date.getMonth() + 1);

      if (listsObject) {
        let listsInTimeFrame =
          type === "year"
            ? Object.values(listsObject).flatMap((item) => Object.values(item))
            : Object.values(listsObject);

        lists[timeframe - 1 - counter] = listsInTimeFrame.length;
        listsOpen[timeframe - 1 - counter] = listsInTimeFrame.reduce(
          (acc, item) => acc + +!item.done,
          0
        );

        const productStats = listsInTimeFrame.reduce(
          (acc, item) => {
            acc.prodNumber += item.prodNumber;
            acc.prodDoneNumber += item.prodDoneNumber;
            return acc;
          },
          { prodNumber: 0, prodDoneNumber: 0 }
        );
        products[timeframe - 1 - counter] = productStats.prodNumber;
        productsDone[timeframe - 1 - counter] = productStats.prodDoneNumber;
      }
      counter++;
      type === "year"
        ? date.setMonth(date.getMonth() - 1)
        : date.setDate(date.getDate() - 1);
    }

    const listsClosed = lists.map((item, i) => item - listsOpen[i]);
    const productsNotDone = products.map((item, i) => item - productsDone[i]);

    return {
      lists,
      listsOpen,
      listsClosed,
      products,
      productsDone,
      productsNotDone,
      graphLabels,
    };
  }

  function handleSwitchToggle(name, value) {
    changeSetting(name, value);
  }

  function handleOptionSelect(key, value) {
    changeSetting(key, value);
  }

  function changeSetting(key, value) {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();
    const settingsRef = ref(db, "users/" + userId + "/settings");

    const updateObject = { [key]: value };

    update(settingsRef, updateObject).catch((error) => {
      showNotification(
        "error",
        "Failed to update settings",
        "There was a network error when updating the settings. We're sorry about that. Please try again."
      );
    });
  }

  function handleLogoutButtonClick() {
    setLogoutModalShown(true);
  }

  function handleLogoutModalConfirm() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatchSettings({ type: "RESET_SETTINGS" });
        navigate("/");
      })
      .catch((error) => {
        console.log("error signing out", error);
        showNotification(
          "error",
          "Error signing out",
          "There has been an error signing out. Please try again."
        );
      });
  }

  function handleLogoutModalCancel() {
    setLogoutModalShown(false);
  }

  return (
    <Page>
      {(loading.settings || loading.stats) && (
        <div className={style["loader-wrapper"]}>
          <Loader className={style.loader} />
        </div>
      )}
      <CSSTransition
        in={!loading.settings && !loading.stats}
        appear={!loading.settings && !loading.stats}
        timeout={150}
        mountOnEnter
        classNames={{
          enter: style["fade-enter"],
          enterActive: style["fade-enter-active"],
        }}
      >
        <Card>
          <div className={style["account-group"]}>
            <h3 className={style["account-group-title"]}>
              Settings and account
            </h3>
            {settingsList.map((setting) => {
              return (
                <Setting
                  key={setting.name}
                  settingKey={setting.settingKey}
                  type={setting.type}
                  name={setting.name}
                  options={setting.options}
                  displayOptions={setting.displayOptions}
                  current={setting.current}
                  onToggle={handleSwitchToggle}
                  onOptionSelect={handleOptionSelect}
                />
              );
            })}
            <div className={style["account-actions-wrapper"]}>
              <Button
                type="button"
                look="primary"
                onClick={handleLogoutButtonClick}
                className={style["account-action"]}
              >
                Log out
              </Button>
              <Button
                type="link"
                look="primary"
                to="/account/remove"
                className={style["account-action"]}
              >
                Remove account
              </Button>
            </div>
          </div>

          <div className={style["account-group"]}>
            <h3 className={style["account-group-title"]}>Statistics</h3>
            <div className={style["account-stats-wrapper"]}>
              <p className={style["lists-text"]}>Lifetime lists created</p>
              <Card nested={true} className={style["lists-number-wrapper"]}>
                <p className={style["lists-number"]}>{lifetimeStats.lists}</p>
              </Card>
              <div className={style["stats-wrapper"]}>
                <Counter
                  type="closed"
                  number={lifetimeStats.doneLists}
                  caption="Closed"
                />
                <Graph
                  type="doughnut"
                  data={[
                    lifetimeStats.lists - lifetimeStats.doneLists,
                    lifetimeStats.doneLists,
                  ]}
                />
                <Counter
                  type="open"
                  number={lifetimeStats.lists - lifetimeStats.doneLists}
                  caption="Open"
                />
              </div>
            </div>
            <div className={style["account-stats-wrapper"]}>
              <p className={style["lists-text"]}>Lifetime products added</p>
              <Card nested={true} className={style["lists-number-wrapper"]}>
                <p className={style["lists-number"]}>
                  {lifetimeStats.products}
                </p>
              </Card>
              <div className={style["stats-wrapper"]}>
                <Counter
                  type="closed"
                  number={lifetimeStats.doneProducts}
                  caption="Done"
                />
                <Graph
                  type="doughnut"
                  data={[
                    lifetimeStats.products - lifetimeStats.doneProducts,
                    lifetimeStats.doneProducts,
                  ]}
                />
                <Counter
                  type="open"
                  number={lifetimeStats.products - lifetimeStats.doneProducts}
                  caption="Not done"
                />
              </div>
            </div>

            <div className={style["account-stats-wrapper"]}>
              <Graph
                type="bar"
                data={[
                  monthStats.lists,
                  monthStats.listsClosed,
                  monthStats.listsOpen,
                ]}
                labels={monthStats.graphLabels}
                barLabels={["Total lists", "Closed lists", "Open lists"]}
                caption="Lists over the last month"
              />
              <Graph
                type="bar"
                data={[
                  monthStats.products,
                  monthStats.productsDone,
                  monthStats.productsNotDone,
                ]}
                labels={monthStats.graphLabels}
                barLabels={[
                  "Total products",
                  "Done products",
                  "Not done products",
                ]}
                caption="Products over the last month"
              />
              <Graph
                type="bar"
                data={[
                  yearStats.lists,
                  yearStats.listsClosed,
                  yearStats.listsOpen,
                ]}
                labels={yearStats.graphLabels}
                barLabels={["Total lists", "Closed lists", "Open lists"]}
                caption="Lists over the last year"
              />
              <Graph
                type="bar"
                data={[
                  yearStats.products,
                  yearStats.productsDone,
                  yearStats.productsNotDone,
                ]}
                labels={yearStats.graphLabels}
                barLabels={[
                  "Total products",
                  "Done products",
                  "Not done products",
                ]}
                caption="Products over the last year"
              />
            </div>
          </div>
          <Modal
            in={logoutModalShown}
            type="choice"
            title="Confirm logging out"
            message="Are you sure you want to log out of Listify?"
            confirmText="Log out"
            cancelText="Cancel"
            onConfirm={handleLogoutModalConfirm}
            onCancel={handleLogoutModalCancel}
          />
        </Card>
      </CSSTransition>
    </Page>
  );
}
