import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./service-worker";
import { App } from "./app";
import { getAppDev, getAppOptions, getAppState } from "../client";


ReactDOM.render(
  <App dev={getAppDev()} options={getAppOptions()} state={getAppState()}/>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
