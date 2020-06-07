import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import Card from "../components/Card";
import { gql } from "apollo-boost";
import { Button } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import queryString from "query-string";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { useQuery } from "@apollo/react-hooks";

interface MainProps {
  section?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  img: string | null | undefined;
  createdAt: string;
  keywords: { value: string; weight: number }[];
  category: string;
}

export interface KeywordsIE {
  includeKeywords: string[];
  excludeKeywords: string[];
}

const FETCH_NEWS_ARTICLES = gql`
  query NewsArticles(
    $include: [String!]
    $exclude: [String!]
    $category: Category
    $offset: ID = 0
  ) {
    newsArticles(
      offset: $offset
      start: "2020-06-01T12:51:44.012Z"
      limit: 15
      include_keywords: $include
      exclude_keywords: $exclude
      category: $category
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
`;

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

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Main = (props: MainProps): JSX.Element => {
  const [moreLoaded, setMoreLoaded] = useState<boolean>(true);
  const [newses, setNewses] = useState<NewsArticle[] | null>(null);
  const [nomoreNewsOpen, setNomoreNewsOpen] = useState<boolean>(false);
  const { section } = props;
  const classes = useStyles();
  const location = useLocation();
  const query = queryString.parse(location.search);
  const include: string[] =
    typeof query.include === "string" && query.include.length > 0
      ? query.include.split("|")
      : [];
  const exclude: string[] =
    typeof query.exclude === "string" && query.exclude.length > 0
      ? query.exclude.split("|")
      : [];
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setNomoreNewsOpen(false);
  };
  const handleMoreClick = (): void => {
    setMoreLoaded(false);
    refetch({
      include,
      exclude,
      offset:
        newses !== null && newses.length > 0
          ? +newses[newses.length - 1].id
          : 0,
      category:
        location.pathname.substr(1) === "ALL"
          ? undefined
          : location.pathname.substr(1),
    });
  };
  const { loading, error, data, refetch } = useQuery(FETCH_NEWS_ARTICLES, {
    variables: {
      include,
      exclude,
      offset: 0,
      category:
        location.pathname.substr(1) === "ALL"
          ? undefined
          : location.pathname.substr(1),
    },
  });

  // 로딩 스테이트가 바뀔 때 렌더링 시킴.
  useEffect(() => {
    if (loading) return;
    if (!error) {
      if (newses === null) {
        console.log("처음 페치");
        setNewses(data.newsArticles);
      } else {
        console.log("추가 로딩 됨.");
        setMoreLoaded(true);
        if (data.newsArticles.length === 0) setNomoreNewsOpen(true);
        setNewses([...newses, ...data.newsArticles]); // 페치된 뉴스를 어펜드
      }
    } else {
      alert("오류 발생...");
    }
  }, [loading]);

  useEffect(() => {
    // // 위치가 바뀔 때 트리거
    if (error || data) {
      refetch({
        include,
        exclude,
        offset: 0,
        category:
          location.pathname.substr(1) === "ALL"
            ? undefined
            : location.pathname.substr(1),
      });
    }
  }, [location]);
  return (
    <div className={classes.root}>
      <Helmet>
        <title>UnderTimes {section}</title>
      </Helmet>
      {loading && <CircularProgress className={classes.loading} />}
      {data &&
        newses &&
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

      <Button
        variant="outlined"
        color="primary"
        className={classes.moreButton}
        onClick={handleMoreClick}
        disabled={!moreLoaded}
      >
        더 보기 ...
      </Button>
      {!moreLoaded && <CircularProgress className={classes.loading} />}
      <Snackbar
        open={nomoreNewsOpen}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="info">
          더 불러올 뉴스가 없습니다.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Main;
