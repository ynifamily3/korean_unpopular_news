import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import loadable from "@loadable/component";
import Top from "./components/Top";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

const Main = loadable(() =>
  import(/* webpackChunkName: "MainPage" */ "./pages/Main")
);
const About = loadable(() =>
  import(/* webpackChunkName: "About" */ "./pages/About")
);

const client = new ApolloClient({
  uri: "https://undertimes.alien.moe/graphql",
});

export const Categories = [
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
        {Categories.map((x) => {
          return (
            <Route
              key={x.link}
              path={x.link}
              render={(): JSX.Element => (
                <ApolloProvider client={client}>
                  <Main section={x.section} />
                </ApolloProvider>
              )}
            />
          );
        })}
        <Route exact path="/about" render={(): JSX.Element => <About />} />
      </Switch>
    </>
  );
};

export default App;
