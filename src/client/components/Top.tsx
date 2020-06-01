import React from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import MoreIcon from "@material-ui/icons/MoreVert";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  toolbar: {
    minHeight: 128,
    alignItems: "flex-start",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    alignSelf: "flex-end",
  },
}));

const Top = (): JSX.Element => {
  const classes = useStyles();
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
  const location = useLocation();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h5" noWrap>
            Material-UI
          </Typography>
          <IconButton aria-label="search" color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton
            aria-label="display more actions"
            edge="end"
            color="inherit"
          >
            <MoreIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
    // <div
    //   className="pure-menu pure-menu-horizontal"
    //   style={{ textAlign: "center" }}
    // >
    //   <Link to="/" className="pure-menu-heading pure-menu-link">
    //     UnterTimes
    //   </Link>
    //   <ul className="pure-menu-list">
    //     {renderTree.map((x) => {
    //       return (
    //         <li
    //           key={x.section}
    //           className={clsx(
    //             "pure-menu-item",
    //             location.pathname === x.link && "pure-menu-selected"
    //           )}
    //         >
    //           <Link to={x.link} className="pure-menu-link">
    //             {x.section}
    //           </Link>
    //         </li>
    //       );
    //     })}
    //   </ul>
    // </div>
  );
};

export default Top;
