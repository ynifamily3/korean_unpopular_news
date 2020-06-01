import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import Card from "../components/Card";
import "cross-fetch/polyfill";
import ApolloClient, { gql } from "apollo-boost";
import { Button } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";

interface MainProps {
  section?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  img: string | null | undefined;
  createdAt: string; // ISO Date
  keywords: { value: string; weight: number }[];
  category: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  moreButton: {
    width: "80%",
    margin: "25px auto",
    maxWidth: "720px",
  },
  loading: {
    margin: "1em auto",
  },
}));

const Main = (props: MainProps): JSX.Element => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [newses, setNewses] = useState<NewsArticle[]>([]);
  const { section } = props;
  const classes = useStyles();
  const location = useLocation();
  const client = new ApolloClient({
    uri: "https://undertimes.alien.moe/graphql",
  });
  useEffect(() => {
    setLoaded(false);
    client
      .query({
        query: gql`
          {
            newsArticles(
              offset: 0
              start: "2020-05-31T00:00:00.000Z"
              end: "2020-06-01T00:00:00.000Z"
              limit: 2
            ) {
              id
              title
              url
              img
              createdAt
              keywords {
                value
                weight
              }
              category
            }
          }
        `,
      })
      .then((result) => {
        console.log(result.data);
        setLoaded(true);
        setNewses(result.data.newsArticles);
      });
  }, [location]);
  return (
    <div className={classes.root}>
      <Helmet>
        <title>UnderTimes {section}</title>
      </Helmet>
      {!loaded && <CircularProgress className={classes.loading} />}
      {newses.map((news) => {
        return <Card key={"news-" + news.id} {...news} />;
      })}
      <Button variant="outlined" color="primary" className={classes.moreButton}>
        더 보기 ...
      </Button>
    </div>
  );
};

export default Main;
