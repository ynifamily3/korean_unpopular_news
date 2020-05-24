import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Card, { CardProps } from "../components/Card";
import "cross-fetch/polyfill";
import ApolloClient, { gql } from "apollo-boost";

const Main = (): JSX.Element => {
  const [newses, setNewses] = useState<CardProps[]>([]);
  const client = new ApolloClient();
  useEffect(() => {
    client
      .query({
        query: gql`
          {
            news {
              title
              url
              createAt
              category
              keywords {
                value
                weight
              }
            }
          }
        `,
      })
      .then((result) => {
        console.log(result.data.news);
        setNewses(result.data.news);
      });
  }, []);
  return (
    <div className="App">
      <Helmet>
        <title>UnderTimes</title>
      </Helmet>
      {newses.map((news, i) => {
        return <Card key={"news-" + i} {...news} />;
      })}
    </div>
  );
};

export default Main;
