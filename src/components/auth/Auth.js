import style from "./Auth.module.css";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useTheme } from "../../hooks/useTheme";
import Page from "../UI/Page";
import Card from "../UI/Card";
import logo from "../../images/logo512.png";
import AuthFormItem from "./AuthFormItem";
import Button from "../UI/Button";
import TextLink from "../UI/TextLink";

export default function Auth() {
  const getClassNames = useTheme(style);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const action = searchParams.get("action");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const actions = [
      "login",
      "signup",
      "reset-password-request",
      "reset-password",
    ];
    if (!actions.includes(action)) {
      navigate("/auth?action=signup");
    }
  }, []);

  //email:
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredEmailValid, setEnteredEmailValid] = useState(false);

  function validateEmail() {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(enteredEmail);
  }

  function onEmailChange(email) {
    setEnteredEmail(email);
  }

  function onEmailValidChange(valid) {
    setEnteredEmailValid(valid);
  }

  //password 1
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

  //password 2:
  const [enteredPassword2, setEnteredPassword2] = useState("");
  const [enteredPassword2Valid, setEnteredPassword2Valid] = useState(false);

  function validatePassword2(password) {
    return password === enteredPassword;
  }

  function onPassword2Change(password) {
    setEnteredPassword2(password);
  }

  function onPassword2ValidChange(valid) {
    setEnteredPassword2Valid(valid);
  }

  //form validity:
  let formIsValid = false;
  if (action === "signup") {
    formIsValid =
      enteredEmailValid && enteredPasswordValid && enteredPassword2Valid;
  } else if (action === "login") {
    formIsValid = enteredEmailValid && enteredPasswordValid;
  } else if (action === "reset-password-request") {
    formIsValid = enteredEmailValid;
  }

  function submitHandler(event) {
    event.preventDefault();
    if (!isLoading && action === "signup" && formIsValid) {
      setIsLoading(true);
      console.log("signing up:", enteredEmail, enteredPassword);
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, enteredEmail, enteredPassword)
        .then(() => {
          setIsLoading(false);
          navigate("/dash");
          //show success notification?
        })
        .catch((error) => {
          //TODO: display error notification
          setIsLoading(false);
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("Sign in fail\n", errorCode, "\n", errorMessage);
        });
    } else if (!isLoading && action === "login" && formIsValid) {
      setIsLoading(true);
      console.log("logging in:", enteredEmail, enteredPassword);
      const auth = getAuth();
      signInWithEmailAndPassword(auth, enteredEmail, enteredPassword)
        .then(() => {
          setIsLoading(false);
          navigate("/dash");
          //show success notification?
        })
        .catch((error) => {
          //TODO: display error notification
          setIsLoading(false);
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("Log in fail\n", errorCode, "\n", errorMessage);
        });
    } else if (
      !isLoading &&
      action === "reset-password-request" &&
      formIsValid
    ) {
      setIsLoading(true);
      console.log("sending reset to:", enteredEmail);
      const auth = getAuth();
      sendPasswordResetEmail(auth, enteredEmail)
        .then(() => {
          setIsLoading(false);
          //TODO: show success notification
          console.log("SENT!"); 
        })
        .catch((error) => {
          setIsLoading(false);
          //TODO: show error notification
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("sending fail\n", errorCode, "\n", errorMessage);
        });
    }
  }

  return (
    <Page className={style.page}>
      {action === "signup" && (
        <Card className={style["outer-card"]}>
          <img alt="logo" src={logo}></img>
          <p className={style.title}>Join Listify</p>
          <Card className={style["inner-card"]}>
            <form onSubmit={submitHandler}>
              <AuthFormItem
                type="email"
                name="Email"
                validateFunction={validateEmail}
                onChangeFunction={onEmailChange}
                onValidChangeFunction={onEmailValidChange}
                invalidText="Email is invalid"
              />
              <AuthFormItem
                type="password"
                name="Password"
                validateFunction={validatePassword}
                onChangeFunction={onPasswordChange}
                onValidChangeFunction={onPasswordValidChange}
                invalidText="Password should be at least 7 characters long"
              />
              <AuthFormItem
                type="password"
                name="Repeat password"
                validateFunction={validatePassword2}
                onChangeFunction={onPassword2Change}
                onValidChangeFunction={onPassword2ValidChange}
                invalidText="Passwords don't match"
              />
              <Button
                type="button"
                buttonType="submit"
                look="primary"
                className={style["action-button"]}
                loading={isLoading}
                disabled={!formIsValid}
              >
                Sign up
              </Button>
            </form>
          </Card>
          <p className={style["nav-text"]}>
            Already got an account?{" "}
            <TextLink to="/auth?action=login">Log in.</TextLink>
          </p>
        </Card>
      )}
      {action === "login" && (
        <Card className={style["outer-card"]}>
          <img alt="logo" src={logo}></img>
          <p className={style.title}>Log in to Listify</p>
          <Card className={style["inner-card"]}>
            <form onSubmit={submitHandler}>
              <AuthFormItem
                type="email"
                name="Email"
                validateFunction={validateEmail}
                onChangeFunction={onEmailChange}
                onValidChangeFunction={onEmailValidChange}
                invalidText="Email is invalid"
              />
              <TextLink
                to="/auth?action=reset-password-request"
                className={style["forgot-link"]}
              >
                Forgot password?
              </TextLink>
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
                loading={isLoading}
                disabled={!formIsValid}
              >
                Log in
              </Button>
            </form>
          </Card>
          <p className={style["nav-text"]}>
            New to Listify?{" "}
            <TextLink to="/auth?action=signup">Sign up.</TextLink>
          </p>
        </Card>
      )}
      {action === "reset-password-request" && (
        <Card className={style["outer-card"]}>
          <img alt="logo" src={logo}></img>
          <p className={style.title}>Password reset</p>
          <p className={style["nav-text"]}>
            Enter your account's email address and we will send you a password
            reset link
          </p>
          <Card className={style["inner-card"]}>
            <form onSubmit={submitHandler}>
              <AuthFormItem
                type="email"
                name="Email"
                validateFunction={validateEmail}
                onChangeFunction={onEmailChange}
                onValidChangeFunction={onEmailValidChange}
                invalidText="Email is invalid"
              />
              <Button
                type="button"
                buttonType="submit"
                look="primary"
                className={style["action-button"]}
                loading={isLoading}
                disabled={!formIsValid}
              >
                Send
              </Button>
            </form>
          </Card>
          <p className={style["nav-text"]}>
            Remembered your password?{" "}
            <TextLink to="/auth?action=login">Log in.</TextLink>
          </p>
        </Card>
      )}
    </Page>
  );
}
