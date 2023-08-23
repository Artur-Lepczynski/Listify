import style from "./Auth.module.css";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useTheme } from "../../hooks/useTheme";
import Page from "../UI/Page";
import Card from "../UI/Card";
import logo from "../../images/logo512.png";
import AuthFormItem from "./AuthFormItem";
import Button from "../UI/Button";

export default function Auth() {
  const getClassNames = useTheme(style);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const mode = searchParams.get("mode");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const modes = ["login", "signup", "reset"];
    if (!modes.includes(mode)) {
      navigate("/auth?mode=signup");
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
  if (mode === "signup") {
    formIsValid =
      enteredEmailValid && enteredPasswordValid && enteredPassword2Valid;
  } else if (mode === "login") {
    formIsValid = enteredEmailValid && enteredPasswordValid;
  }

  function submitHandler(event) {
    event.preventDefault();
    if (!isLoading && mode === "signup" && formIsValid) {
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
    } else if (!isLoading && mode === "login" && formIsValid) {
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
    }
  }

  return (
    <Page className={style.page}>
      {mode === "signup" && (
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
            <Link
              className={`${style["auth-link"]} ${getClassNames(
                "auth-link"
              )}`}
              to={"/auth?mode=login"}
            >
              Log in.
            </Link>
          </p>
        </Card>
      )}
      {mode === "login" && (
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
              <Link
                className={`${style["auth-link"]} ${style["forgot-link"]} ${getClassNames(
                  "auth-link"
                )}`}
                to={"/auth?mode=reset"}
              >
                Forgot password?
              </Link>
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
            <Link
              className={`${style["auth-link"]} ${getClassNames(
                "auth-link"
              )}`}
              to={"/auth?mode=signup"}
            >
              Sign up.
            </Link>
          </p>
        </Card>
      )}
      {mode === "reset" && (
        <Card className={style.card}>
          <h3>Reset password</h3>
        </Card>
      )}
    </Page>
  );
}
