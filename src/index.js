import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import GlobalContext from "./store/GlobalContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GlobalContext>
    <App />
  </GlobalContext>
);
