import React from "react";
import App from "./App";
import CssBaseline from "@material-ui/core/CssBaseline";

const AppContainer = (): JSX.Element => {
  return (
    <React.Fragment>
      <CssBaseline />
      <App />
    </React.Fragment>
  );
};

export default AppContainer;
