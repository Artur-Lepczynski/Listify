import React, { useReducer, useState } from "react";

export const context = React.createContext();

export default function GlobalContext(props) {
  const DEFAULT_SETTINGS = {
    theme: "midnight",
    noListsShownDashboard: 3,
    askBeforeListDelete: true,
    askBeforeShopDelete: true,
    askBeforeProductDeleteEdit: false,
    askBeforeShopDeleteEdit: false,
    addListNotification: true,
    removeListNotification: true,
    addShopNotification: true,
    removeShopNotification: true,
  }

  const [settings, dispatchSettings] = useReducer(settingsReducer, DEFAULT_SETTINGS);

  function settingsReducer(prevState, action) {
    if (action.type === "SET_SETTINGS") {
      return { ...prevState, ...action.settings };
    } else if (action.type === "RESET_SETTINGS") {
      return DEFAULT_SETTINGS;
    }
  }

  const [notifications, setNotifications] = useState([]);
  const NOTIFICATION_SHOW_TIME_MS = 4000;
  const MAX_NOTIFICATIONS = 3;

  function showNotification(type, title, message) {
    const notification = { id: Math.random(), type, title, message };

    setNotifications((prev) => {
      let copy = [...prev];
      if (copy.length >= MAX_NOTIFICATIONS) copy.shift();
      copy.push(notification);
      return copy;
    });

    setTimeout(() => {
      removeNotification(notification.id);
    }, NOTIFICATION_SHOW_TIME_MS);
  }

  function removeNotification(id) {
    setNotifications((prev) => {
      let copy = [...prev];
      copy = copy.filter((item) => item.id !== id);
      return copy;
    });
  }

  return (
    <context.Provider
      value={{
        theme: settings.theme,
        settings,
        dispatchSettings,
        notifications,
        showNotification,
        removeNotification,
      }}
    >
      {props.children}
    </context.Provider>
  );
}
