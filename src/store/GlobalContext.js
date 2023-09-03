import React, { useState } from "react";

export const context = React.createContext();

export default function GlobalContext(props) {
  //Themes: pearlShores, midnight, bubblegum, blueLagoon, deepOcean
  const [theme, setTheme] = useState("midnight");

  //TODO: add reducer for other settings, download and set (app.js), add def values?

  //Notifications:
  const [notifications, setNotifications] = useState([]);
  const NOTIFICATION_SHOW_TIME_MS = 4000;
  const MAX_NOTIFICATIONS = 3;

  //{type: information/error, title: "...", message: "..."}
  function showNotification(type, title, message) {
    const notification = { id: Math.random(), type, title, message };

    setNotifications((prev) => {
      let copy = [...prev];

      if (copy.length >= MAX_NOTIFICATIONS) {
        copy.shift();
      }

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
      // const index = copy.findIndex((item) => item.id === id);
      // copy.splice(index, 1);
      return copy;
    });
  }

  return (
    <context.Provider
      value={{ theme, setTheme, notifications, showNotification, removeNotification }}
    >
      {props.children}
    </context.Provider>
  );
}
