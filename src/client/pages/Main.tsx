import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import Card from "../components/Card";
import "cross-fetch/polyfill";
import ApolloClient, { gql } from "apollo-boost";
import { Button } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import queryString from "query-string";

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

export interface KeywordsIE {
  includeKeywords: string[];
  excludeKeywords: string[];
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

function makeArrStr(arr: string[]): string {
  if (arr.length === 0) return "[]";
  let string = "[";
  arr.forEach((x, i) => {
    string += '"' + x + '"';
    if (i + 1 !== arr.length) string += ", ";
  });
  string += "]";
  return string;
}

const Main = (props: MainProps): JSX.Element => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [moreLoaded, setMoreLoaded] = useState<boolean>(true);
  const [newses, setNewses] = useState<NewsArticle[]>([]);
  const { section } = props;
  const classes = useStyles();
  const location = useLocation();
  const client = new ApolloClient({
    uri: "https://undertimes.alien.moe/graphql",
  });
  const query = queryString.parse(location.search);
  const include: string[] =
    typeof query.include === "string" && query.include.length > 0
      ? query.include.split("|")
      : [];
  const exclude: string[] =
    typeof query.exclude === "string" && query.exclude.length > 0
      ? query.exclude.split("|")
      : [];
  const handleMoreClick = (): void => {
    setMoreLoaded(false);
    client
      .query({
        query: gql`
          {
            newsArticles(
              offset: ${
                newses[newses.length - 1]?.id ? newses[newses.length - 1].id : 0
              },
              start: "2020-05-31T00:00:00.000Z",
              end: "2020-06-01T00:00:00.000Z",
              limit: 15,
              include_keywords: ${makeArrStr(include)},
              exclude_keywords: ${makeArrStr(exclude)}
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
        setMoreLoaded(true);
        setNewses([...newses, ...result.data.newsArticles]); // 추가된 뉴스 어펜드
      });
  };
  useEffect(() => {
    setLoaded(false);
    client
      .query({
        query: gql`
          {
            newsArticles(
              offset: 0,
              start: "2020-05-31T00:00:00.000Z",
              end: "2020-06-01T00:00:00.000Z",
              limit: 1,
              include_keywords: ${makeArrStr(include)},
              exclude_keywords: ${makeArrStr(exclude)}
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
      {loaded &&
        newses.map((news) => {
          return (
            <Card
              key={"news-" + news.id}
              {...news}
              includeKeywords={include}
              excludeKeywords={exclude}
            />
          );
        })}
      {moreLoaded ? (
        <Button
          variant="outlined"
          color="primary"
          className={classes.moreButton}
          onClick={handleMoreClick}
        >
          더 보기 ...
        </Button>
      ) : (
        <CircularProgress className={classes.loading} />
      )}
    </div>
  );
};

export default Main;
