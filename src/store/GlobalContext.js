import React, { useState } from "react";

export const context = React.createContext();

export default function GlobalContext(props) {
  //Themes: pearlShores, midnight, bubblegum, blueLagoon, deepOcean
  const [theme, setTheme] = useState("midnight");

  //TODO: add reducer for other settings, download and set (app.js), add def values?

  //Notifications:
  const [notifications, setNotifications] = useState([]);
  const NOTIFICATION_SHOW_TIME_MS = 2000;

  //{type: achievement/error, title: "...", message: "..."}
  function showNotification(notification) {
    setNotifications((prev) => {
      let copy = [...prev];
      copy.push(notification);
      return copy;
    });

    setTimeout(() => {
      setNotifications((prev) => {
        let copy = [...prev];
        copy.pop();
        return copy;
      });
    }, NOTIFICATION_SHOW_TIME_MS);
  }

  return (
    <context.Provider
      value={{ theme, setTheme, notifications, showNotification }}
    >
      {props.children}
    </context.Provider>
  );
}
