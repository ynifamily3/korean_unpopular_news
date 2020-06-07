import React from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Categories } from "../App";
import CustomizedHook from "./TagSearchForm";
import { ApolloProvider } from "@apollo/react-hooks";
import queryString from "query-string";
import ApolloClient, { gql } from "apollo-boost";
import Chips, { ChipsProps } from "./Chips";

const client = new ApolloClient({
  uri: "https://undertimes.alien.moe/graphql",
});

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  toolbar: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    alignSelf: "center",
  },
  category: {
    color: theme.palette.background.paper,
  },
  linkStyle: {
    textDecoration: "none",
    color: theme.palette.background.paper,
  },
  sel: {
    color: theme.palette.secondary.light,
  },
  fullWidth: {
    width: "100%",
  },
}));

const Top = (): JSX.Element => {
  const classes = useStyles();
  const sections = new Map<string, string>();
  sections["ALL"] = "전체뉴스";
  sections["POLITICS"] = "정치";
  sections["ECONOMY"] = "경제";
  sections["SOCIAL"] = "사회";
  sections["SCIENCE"] = "IT/과학";
  sections["LIFE"] = "생활/문화";
  sections["WORLD"] = "세계";

  const location = useLocation();
  const history = useHistory();

  const query = queryString.parse(location.search);
  const includes =
    typeof query.include === "string" && query.include.length > 0
      ? query.include.split("|")
      : [];
  const excludes =
    typeof query.exclude === "string" && query.exclude.length > 0
      ? query.exclude.split("|")
      : [];

  const jumpTo = (in_or_ex: number) => (keyword: string): void => {
    const includeParams = [...includes];
    const excludeParams = [...excludes];
    const idx =
      in_or_ex === 0
        ? includeParams.indexOf(keyword)
        : excludeParams.indexOf(keyword);
    if (idx > -1) {
      in_or_ex === 0
        ? includeParams.splice(idx, 1)
        : excludeParams.splice(idx, 1);
    }
    const includeParam = includeParams.join("|");
    const excludeParam = excludeParams.join("|");
    history.push(
      location.pathname +
        "?include=" +
        includeParam +
        "&exclude=" +
        excludeParam
    );
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography className={classes.title} variant="h5" noWrap>
            UnderTimes - {sections[location.pathname.substr(1)]}
          </Typography>
          <Breadcrumbs aria-label="breadcrumb" className={classes.category}>
            {Categories.map((x) => {
              return (
                <Link
                  to={x.link + location.search}
                  key={"category-" + x.link}
                  className={classes.linkStyle}
                >
                  {location.pathname === x.link ? (
                    <Typography>{x.section}</Typography>
                  ) : (
                    <Typography className={classes.sel}>{x.section}</Typography>
                  )}
                </Link>
              );
            })}
          </Breadcrumbs>
          <ApolloProvider client={client}>
            <CustomizedHook includes={includes} excludes={excludes} />
          </ApolloProvider>
          <div>
            포함된 키워드 :
            <Chips keywords={includes} triggerEvent={jumpTo(0)} />
          </div>
          <div>
            제외된 키워드 :
            <Chips keywords={excludes} triggerEvent={jumpTo(1)} />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Top;
