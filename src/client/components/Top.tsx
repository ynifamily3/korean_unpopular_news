import React from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Categories } from "../App";
import queryString from "query-string";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
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
  const history = useHistory();
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
  const query = queryString.parse(location.search);
  const include: string[] =
    typeof query.include === "string" && query.include.length > 0
      ? query.include.split("|")
      : [];
  const exclude: string[] =
    typeof query.exclude === "string" && query.exclude.length > 0
      ? query.exclude.split("|")
      : [];
  const handleChangeInclude = (exclude) => (event, value) => {
    const include = value.join("|");
    const exclude2 = exclude.join("|");
    history.push(`${location.pathname}?include=${include}&exclude=${exclude2}`);
  };
  const handleChangeExclude = (include) => (event, value) => {
    const include2 = include.join("|");
    const exclude = value.join("|");
    history.push(`${location.pathname}?include=${include2}&exclude=${exclude}`);
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
          <Autocomplete
            multiple
            id="include"
            className={classes.fullWidth}
            options={include}
            getOptionLabel={(arr): string => arr}
            value={include}
            onChange={handleChangeInclude(exclude)}
            renderInput={(params): JSX.Element => (
              <TextField
                {...params}
                variant="standard"
                label="포함 키워드"
                placeholder="포함 키워드들을 입력하세요."
              />
            )}
          />
          <Autocomplete
            multiple
            id="exclude"
            className={classes.fullWidth}
            options={exclude}
            getOptionLabel={(arr): string => arr}
            value={exclude}
            onChange={handleChangeExclude(include)}
            renderInput={(params): JSX.Element => (
              <TextField
                {...params}
                variant="standard"
                label="제외 키워드"
                placeholder="제외 키워드들을 입력하세요."
              />
            )}
          />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Top;
