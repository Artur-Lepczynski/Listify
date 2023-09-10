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

export default function Account() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const { settings, dispatchSettings, showNotification } = useContext(context);
  const [settingsList, setSettingsList] = useState([]); //list of settings in the format used in the template
  const [logoutModalShown, setLogoutModalShown] = useState(false);

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
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const newSettingsList = [];
    //god forgive me for this
    for (const key in settings) {
      const setting = settings[key];
      if (key === "theme") {
        newSettingsList.push({
          name: "Theme",
          type: "options",
          options: new Map([
            ["pearlShores", "Pearl Shores"],
            ["midnight", "Midnight"],
            ["bubblegum", "Bubblegum"],
            ["blueLagoon", "Blue Lagoon"],
            ["deepOcean", "Deep Ocean"],
          ]),
          current: setting,
          settingKey: key,
        });
      } else if (key === "noListsShownDashboard") {
        newSettingsList.push({
          name: "Number of lists shown on dashboard",
          type: "options",
          options: [1, 3, 5, 7],
          current: setting,
          settingKey: key,
        });
      } else {
        let name;
        if (key === "askBeforeListDelete") name = "Ask before removing a list";
        else if (key === "askBeforeShopDelete")
          name = "Ask before removing a shop";
        else if (key === "askBeforeProductDeleteEdit")
          name = "Ask before removing a product when editing a list";
        else if (key === "askBeforeShopDeleteEdit")
          name = "Ask before removing a shop when editing a list";
        else if (key === "addListNotification")
          name = "Notify me when a list has been added or modified";
        else if (key === "removeListNotification")
          name = "Notify me when a list has been removed";
        else if (key === "addShopNotification")
          name = "Notify me when a shop has been added";
        else if (key === "removeShopNotification")
          name = "Notify me when a shop has been removed";
        newSettingsList.push({
          name,
          type: "toggle",
          current: setting,
          settingKey: key,
        });
      }
    }
    setSettingsList(newSettingsList);
  }, [settings]);

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

    update(settingsRef, updateObject)
      .then(() => {
        console.log("setting updated");
      })
      .catch((error) => {
        console.log("setting update failed", error);
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

  function handleRemoveAccount() {
    //TODO: implement
    console.log("remove account"); 
  }

  return (
    <Page>
      {loading && (
        <div className={style["loader-wrapper"]}>
          <Loader className={style.loader} />
        </div>
      )}
      <CSSTransition
        in={!loading}
        appear={!loading}
        timeout={150}
        mountOnEnter
        classNames={{
          enter: style["fade-enter"],
          enterActive: style["fade-enter-active"],
        }}
      >
        <Card>
          <div className={style["settings-group"]}>
            <h3 className={style["settings-group-title"]}>
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