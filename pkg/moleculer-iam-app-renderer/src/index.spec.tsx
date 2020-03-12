import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { App } from "./app";
import { getAppDev, getAppOptions, getAppState } from "../client";


it("renders without crashing", async () => {
  const div = document.createElement("div");
  await act(() => {
    ReactDOM.render(
      <App dev={getAppDev()} options={getAppOptions()} state={getAppState()}/>,
      div,
    );
    return new Promise<any>(resolve => setTimeout(resolve, 1000));
  });
  ReactDOM.unmountComponentAtNode(div);
});
