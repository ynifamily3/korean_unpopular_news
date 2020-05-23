import { hydrate } from "react-dom";
// eslint-disable-next-line import/no-extraneous-dependencies
import { loadableReady } from "@loadable/component";
import App from "./App";
import React from "react";
import { BrowserRouter } from "react-router-dom";

loadableReady(() => {
  const root = document.getElementById("main");
  hydrate(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    root
  );
});
