import style from "./Notifications.module.css";
import { context } from "../../store/GlobalContext";
import { useContext } from "react";
import Card from "./Card";
import { useTheme } from "../../hooks/useTheme";
import Button from "./Button";
import { CSSTransition, TransitionGroup } from "react-transition-group";

export default function Notifications() {
  const getClassNames = useTheme(style);

  const { notifications, removeNotification } = useContext(context);

  function handleRemoveNotification(id) {
    removeNotification(id);
  }

  return (
    <TransitionGroup className={style["notifications-wrapper"]}>
      {notifications.map((item) => {
        return (
          <CSSTransition
            key={item.id}
            timeout={150}
            classNames={{
              enter: style["notification-enter"],
              enterActive: style["notification-enter-active"],
              exit: style["notification-exit"],
              exitActive: style["notification-exit-active"],
            }}
          >
            <Card
              className={`${style.notification} ${getClassNames(
                "notification"
              )}`}             
            >
              <div className={style["icon-wrapper"]}>
                {item.type === "information" && (
                  <i
                    className={`fa-solid fa-circle-info ${
                      style["icon"]
                    } ${getClassNames("icon")}`}
                  ></i>
                )}
                {item.type === "error" && (
                  <i
                    className={`fa-solid fa-triangle-exclamation ${
                      style["icon"]
                    } ${getClassNames("icon")}`}
                  ></i>
                )}
              </div>
              <div className={style["notification-info"]}>
                <h2 className={style["notification-title"]}>{item.title}</h2>
                <p className={style["notification-message"]}>{item.message}</p>
              </div>
              <Button
                type="button"
                look="secondary"
                className={`${style["close-button"]} ${getClassNames(
                  "close-button"
                )}`}
                onClick={() => handleRemoveNotification(item.id)}
              >
                X
              </Button>
              <div
                className={`${style["duration-bar"]} ${getClassNames(
                  "duration-bar"
                )}`}
              ></div>
            </Card>
          </CSSTransition>
        );
      })}
    </TransitionGroup>
  );
}
