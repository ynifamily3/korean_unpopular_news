import React from "react";
import { Link, useLocation } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Categories } from "../App";
import CustomizedHook from "./AutoCompleteForm";

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
          <CustomizedHook />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Top;
