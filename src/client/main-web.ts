import { hydrate } from "react-dom";
// eslint-disable-next-line import/no-extraneous-dependencies
import { loadableReady } from "@loadable/component";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppContainer from "./AppContainer";

loadableReady(() => {
  const root = document.getElementById("main");
  hydrate(
    React.createElement(
      BrowserRouter,
      null,
      React.createElement(AppContainer, null, null)
    ),
    root
  );
});
