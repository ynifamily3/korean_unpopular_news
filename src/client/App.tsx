import React from "react";
import { Route, Switch, Link } from "react-router-dom";
import loadable from "@loadable/component";
const About = loadable(() =>
  import(/* webpackChunkName: "About" */ "./pages/About")
);

const App = (): JSX.Element => {
  return (
    <div>
      <Route
        path="/"
        render={(): JSX.Element => (
          <div>
            공통메인페이지부분입니다.<Link to="/about">어바웃보여주기</Link>
          </div>
        )}
      />

      <Switch>
        <Route exact path="/about" render={(): JSX.Element => <About />} />
      </Switch>
    </div>
  );
};

export default App;
