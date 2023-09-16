import Button from "../../UI/Button";
import Card from "../../UI/Card";
import Page from "../../UI/Page";
import TextLink from "../../UI/TextLink";
import style from "./AccountRemove.module.css";
import AuthFormItem from "../../auth/AuthFormItem";
import logo from "../../../images/logo512.png";
import { useContext, useState } from "react";
import { CSSTransition } from "react-transition-group";
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth";
import { context } from "../../../store/GlobalContext";
import { useNavigate } from "react-router-dom";

export default function AccountRemove() {
  const { showNotification } = useContext(context);

  const navigate = useNavigate();

  const [reAuthLoading, setReAuthLoading] = useState(false);
  const [reAuthorized, setReAuthorized] = useState(false);

  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredPasswordValid, setEnteredPasswordValid] = useState(false);

  function validatePassword(password) {
    return password.length > 6;
  }

  function onPasswordChange(password) {
    setEnteredPassword(password);
  }

  function onPasswordValidChange(valid) {
    setEnteredPasswordValid(valid);
  }

  function handleReAuthFormSubmit(event) {
    event.preventDefault();
    if (enteredPasswordValid && !reAuthLoading) {
      setReAuthLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        enteredPassword
      );

      reauthenticateWithCredential(user, credential)
        .then(() => {
          setReAuthLoading(false);
          setReAuthorized(true);
        })
        .catch((error) => {
          setReAuthLoading(false);
          if (error.code === "auth/wrong-password") {
            showNotification(
              "error",
              "Wrong password",
              "Unfortunately the password you entered was incorrect. Please try again."
            );
          } else {
            showNotification(
              "error",
              "Failed to reauthenticate",
              "There was a network error when reauthenticating. We're sorry about that. Please try again later. Code: ",
              error.code
            );
          }
        });
    }
  }

  const [removeAccountLoading, setRemoveAccountLoading] = useState(false);

  function handleRemoveAccount() {
    setRemoveAccountLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    deleteUser(user)
      .then(() => {
        setRemoveAccountLoading(false);
        showNotification(
          "information",
          "Account deleted",
          "Your account has been deleted. We're sad to see you go :("
        );
        navigate("/");
      })
      .catch((error) => {
        setRemoveAccountLoading(false);
        showNotification(
          "error",
          "Failed to remove account",
          "There was a network error when removing your account. We're sorry about that. Please try again later. Code: " +
            error.code
        );
      });
  }

  return (
    <Page>
      <CSSTransition
        in={true}
        appear={true}
        timeout={150}
        mountOnEnter
        classNames={{
          appear: style["fade-enter"],
          appearActive: style["fade-enter-active"],
        }}
      >
        <Card className={style["outer-card"]}>
          <img alt="logo" src={logo}></img>
          <p className={style.title}>Remove account</p>
          {!reAuthorized && (
            <>
              <p className={style["nav-text"]}>
                Enter password to reauthenticate. Once you do, you'll still have
                a chance to back out
              </p>
              <Card className={style["inner-card"]}>
                <form onSubmit={handleReAuthFormSubmit}>
                  <AuthFormItem
                    type="password"
                    name="Password"
                    validateFunction={validatePassword}
                    onChangeFunction={onPasswordChange}
                    onValidChangeFunction={onPasswordValidChange}
                    invalidText="Password should be at least 7 characters long"
                  />
                  <Button
                    type="button"
                    buttonType="submit"
                    look="primary"
                    className={style["action-button"]}
                    loading={reAuthLoading}
                    disabled={!enteredPasswordValid}
                  >
                    Reauthenticate
                  </Button>
                </form>
              </Card>
              <p className={style["nav-text"]}>
                Changed your mind?{" "}
                <TextLink to="/account">Go back to safety.</TextLink>
              </p>
            </>
          )}
          {reAuthorized && (
            <>
              <p className={style["nav-text"]}>
                This is your last chance to back out. Press the button below to
                remove your account. This action is final and cannot be undone.
                We're sad to see you go 😢
              </p>
              <Card className={style["inner-card"]}>
                <Button
                  type="button"
                  look="primary"
                  className={style["action-button"]}
                  loading={removeAccountLoading}
                  onClick={handleRemoveAccount}
                >
                  Remove account
                </Button>
              </Card>
              <p className={style["nav-text"]}>
                Changed your mind?{" "}
                <TextLink to="/account">Go back to safety.</TextLink>
              </p>
            </>
          )}
        </Card>
      </CSSTransition>
    </Page>
  );
}
