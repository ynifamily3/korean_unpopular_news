import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import loadable from "@loadable/component";
import Top from "./components/Top";
// import { Button } from "@material-ui/core";

const Main = loadable(() =>
  import(/* webpackChunkName: "MainPage" */ "./pages/Main")
);
const About = loadable(() =>
  import(/* webpackChunkName: "About" */ "./pages/About")
);

const renderTree = [
  {
    section: "홈",
    link: "/ALL",
  },
  {
    section: "정치",
    link: "/POLITICS",
  },
  {
    section: "경제",
    link: "/ECONOMY",
  },
  {
    section: "사회",
    link: "/SOCIAL",
  },
  {
    section: "IT/과학",
    link: "/SCIENCE",
  },
  {
    section: "생활/문화",
    link: "/LIFE",
  },
  {
    section: "세계",
    link: "/WORLD",
  },
];

const App = (): JSX.Element => {
  return (
    <>
      <Top />
      <Switch>
        <Redirect exact path="/" to="/ALL" />
        {renderTree.map((x) => {
          return (
            <Route
              key={x.link}
              path={x.link}
              render={(): JSX.Element => <Main section={x.section} />}
            />
          );
        })}
        <Route exact path="/about" render={(): JSX.Element => <About />} />
      </Switch>
    </>
  );
};

export default App;
