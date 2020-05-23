import React from "react";
import { Route, Switch } from "react-router-dom";
import loadable from "@loadable/component";
const Main = loadable(() =>
  import(/* webpackChunkName: "MainPage" */ "./pages/Main")
);
const About = loadable(() =>
  import(/* webpackChunkName: "About" */ "./pages/About")
);

const App = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path="/" render={(): JSX.Element => <Main />} />
      <Route exact path="/about" render={(): JSX.Element => <About />} />
    </Switch>
  );
};

export default App;
