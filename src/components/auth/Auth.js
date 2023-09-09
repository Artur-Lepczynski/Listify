import style from "./Auth.module.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from "firebase/auth";
import Page from "../UI/Page";
import Card from "../UI/Card";
import logo from "../../images/logo512.png";
import AuthFormItem from "./AuthFormItem";
import Button from "../UI/Button";
import TextLink from "../UI/TextLink";
import { context } from "../../store/GlobalContext";

export default function Auth() {
  const { showNotification } = useContext(context);

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
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [repeatedPasswordValid, setRepeatedPasswordValid] = useState(false);

  function validateRepeatedPassword(password) {
    return password === enteredPassword;
  }

  function onRepeatedPasswordChange(password) {
    setRepeatedPassword(password);
  }

  function onRepeatedPasswordValidChange(valid) {
    setRepeatedPasswordValid(valid);
  }

  //form validity:
  let formIsValid = false;
  if (action === "signup") {
    formIsValid =
      enteredEmailValid && enteredPasswordValid && repeatedPasswordValid;
  } else if (action === "login") {
    formIsValid = enteredEmailValid && enteredPasswordValid;
  } else if (action === "reset-password-request") {
    formIsValid = enteredEmailValid;
  } else if (action === "reset-password") {
    formIsValid = enteredPasswordValid && repeatedPasswordValid;
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
          showNotification(
            "information",
            "Sign up successful!",
            "You have successfully signed up. Welcome to Listify!"
          );
        })
        .catch((error) => {
          setIsLoading(false);
          if (error.code === "auth/email-already-in-use") {
            showNotification(
              "error",
              "Email already in use",
              "This email is already in use by another account."
            );
          } else if (error.code === "auth/invalid-email") {
            showNotification(
              "error",
              "Invalid email",
              "The email address is badly formatted."
            );
          } else if (error.code === "auth/weak-password") {
            showNotification(
              "error",
              "Weak password",
              "The password must be at least 6 characters long."
            );
          } else {
            showNotification(
              "error",
              "Sign up failed",
              "An unknown error occurred. Code: " + error.code
            );
          }
        });
    } else if (!isLoading && action === "login" && formIsValid) {
      setIsLoading(true);
      console.log("logging in:", enteredEmail, enteredPassword);
      const auth = getAuth();
      signInWithEmailAndPassword(auth, enteredEmail, enteredPassword)
        .then(() => {
          setIsLoading(false);
          navigate("/dash");
        })
        .catch((error) => {
          setIsLoading(false);
          if (error.code === "auth/invalid-email") {
            showNotification(
              "error",
              "Invalid email",
              "The email address is badly formatted."
            );
          } else if (error.code === "auth/user-disabled") {
            showNotification(
              "error",
              "Account disabled",
              "This account has been disabled."
            );
          } else if (error.code === "auth/user-not-found") {
            showNotification(
              "error",
              "Account not found",
              "There is no account with this email address."
            );
          } else if (error.code === "auth/wrong-password") {
            showNotification(
              "error",
              "Wrong password",
              "The password is incorrect."
            );
          } else if (error.code === "auth/too-many-requests") {
            showNotification(
              "error",
              "Too many requests",
              "Too many unsuccessful login attempts. Please try again later."
            );
          } else {
            showNotification(
              "error",
              "Log in failed",
              "An unknown error occurred. Code: " + error.code
            );
          }
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
          showNotification(
            "information",
            "Email sent!",
            "We have sent you an email with a link to reset your password."
          );
        })
        .catch((error) => {
          setIsLoading(false);
          if (error.code === "auth/invalid-email") {
            showNotification(
              "error",
              "Invalid email",
              "The email address is badly formatted."
            );
          } else if (error.code === "auth/user-not-found") {
            showNotification(
              "error",
              "Account not found",
              "There is no account with this email address."
            );
          } else {
            showNotification(
              "error",
              "Sending failed",
              "An unknown error occurred. Code: " + error.code
            );
          }
        });
    } else if (!isLoading && action === "reset-password" && formIsValid) {
      setIsLoading(true);
      const auth = getAuth();
      const code = searchParams.get("oobCode");
      confirmPasswordReset(auth, code, enteredPassword)
        .then(() => {
          setIsLoading(false);
          showNotification(
            "information",
            "Password changed!",
            "Your password has been changed. You can now log in with your new password."
          );
          navigate("/auth?action=login");
        })
        .catch((error) => {
          setIsLoading(false);
          if (error.code === "auth/invalid-action-code") {
            showNotification(
              "error",
              "Invalid code",
              "The password reset link is invalid or has already been used."
            );
          } else if (error.code === "auth/expired-action-code") {
            showNotification(
              "error",
              "Expired code",
              "The password reset link has expired. Please request a new one."
            );
          } else if (error.code === "auth/user-disabled") {
            showNotification(
              "error",
              "Account disabled",
              "This account has been disabled."
            );
          } else if (error.code === "auth/user-not-found") {
            showNotification(
              "error",
              "Account not found",
              "There is no account with this email address."
            );
          } else if (error.code === "auth/weak-password") {
            showNotification(
              "error",
              "Weak password",
              "The password must be at least 6 characters long."
            );
          } else {
            showNotification(
              "error",
              "Reset failed",
              "An unknown error occurred. Code: " + error.code
            );
          }
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
                validateFunction={validateRepeatedPassword}
                onChangeFunction={onRepeatedPasswordChange}
                onValidChangeFunction={onRepeatedPasswordValidChange}
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
              <AuthFormItem
                type="password"
                name="Password"
                forgotLink={true}
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
      {action === "reset-password" && (
        <Card className={style["outer-card"]}>
          <img alt="logo" src={logo}></img>
          <p className={style.title}>Password reset</p>
          <p className={style["nav-text"]}>Enter your new password below</p>
          <Card className={style["inner-card"]}>
            <form onSubmit={submitHandler}>
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
                validateFunction={validateRepeatedPassword}
                onChangeFunction={onRepeatedPasswordChange}
                onValidChangeFunction={onRepeatedPasswordValidChange}
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
                Change password
              </Button>
            </form>
          </Card>
        </Card>
      )}
    </Page>
  );
}
