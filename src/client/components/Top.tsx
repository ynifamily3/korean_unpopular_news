import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme } from "@material-ui/core/styles";
// import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Categories } from "../App";
import CustomizedHook from "./TagSearchForm";
import { ApolloProvider } from "@apollo/react-hooks";
import queryString from "query-string";
import ApolloClient from "apollo-boost";
import Chips from "./Chips";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";

const client = new ApolloClient({
  uri: "https://undertimes.alien.moe/graphql",
});

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
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
  paper: {
    height: 72,
    display: "flex",
    padding: "30px 30px",
    flexDirection: "column",
    justifyContent: "center",
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
  const order: string[] = [];
  order.push("/ALL");
  order.push("/POLITICS");
  order.push("/ECONOMY");
  order.push("/SOCIAL");
  order.push("/SCIENCE");
  order.push("/LIFE");
  order.push("/WORLD");

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
  const handleChangeLink = (
    e: React.ChangeEvent<unknown>,
    newValue: number
  ) => {
    history.push(order[newValue] + location.search);
  };
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography className={classes.title} variant="h5" noWrap>
            UnderTimes - {sections[location.pathname.substr(1)]}
          </Typography>
          <Paper className={classes.root}>
            <Tabs
              value={
                order.indexOf(location.pathname) < 0
                  ? 0
                  : order.indexOf(location.pathname)
              }
              indicatorColor="primary"
              textColor="primary"
              onChange={handleChangeLink}
              variant="scrollable"
              // scrollButtons="auto"
              // centered
            >
              {Categories.map((x) => {
                return <Tab key={"category-" + x.link} label={x.section} />;
              })}
            </Tabs>
          </Paper>
          <Grid
            container
            spacing={3}
            direction="row"
            justify="center"
            alignItems="center"
            style={{ marginTop: 15 }}
          >
            <Grid item xs={12} md={4}>
              <Paper elevation={3} className={classes.paper}>
                <div style={{ flexGrow: 1 }}>
                  <ApolloProvider client={client}>
                    <CustomizedHook includes={includes} excludes={excludes} />
                  </ApolloProvider>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} className={classes.paper}>
                <Typography>포함 키워드</Typography>
                <div>
                  <Chips keywords={includes} triggerEvent={jumpTo(0)} />
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} className={classes.paper}>
                <Typography>제외 키워드</Typography>
                <div>
                  <Chips keywords={excludes} triggerEvent={jumpTo(1)} />
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Top;
