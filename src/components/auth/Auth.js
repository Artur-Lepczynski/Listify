import style from "./Auth.module.css";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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

  function validateEmail(email) {
    return email.includes("@");
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
  }

  function submitHandler(event) {
    event.preventDefault();
    if (!isLoading && mode === "signup" && formIsValid) {
      setIsLoading(true); 
      console.log("submitted:", enteredEmail, enteredPassword);
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, enteredEmail, enteredPassword)
        .then(() => {
          setIsLoading(false); 
          navigate("/dash");
        })
        .catch((error) => {
          setIsLoading(false); 
          console.log("epic fail:", error);
          //TODO: display error notification & reset fields?
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
              className={`${style["nav-action"]} ${getClassNames(
                "nav-action"
              )}`}
              to={"/auth?mode=login"}
            >
              Log in.
            </Link>
          </p>
        </Card>
      )}
      {mode === "login" && (
        <Card className={style.card}>
          <h3>Log in</h3>
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
