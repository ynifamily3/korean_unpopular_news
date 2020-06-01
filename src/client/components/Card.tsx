import React, { CSSProperties } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { NewsArticle } from "../pages/Main";

import Chip from "@material-ui/core/Chip";

function Card(props: NewsArticle): JSX.Element {
  const sections = {};
  sections["POLITICS"] = "정치";
  sections["ECONOMY"] = "경제";
  sections["SOCIAL"] = "사회";
  sections["SCIENCE"] = "IT/과학";
  sections["LIFE"] = "생활/문화";
  sections["WORLD"] = "세계";
  const { title, url, img, createdAt, keywords, category } = props;
  const dateFormat = new Date(createdAt);
  const year = dateFormat.getFullYear();
  const month = dateFormat.getMonth() + 1;
  const date = dateFormat.getDate();
  const time = dateFormat.getHours() + ":" + dateFormat.getMinutes();

  const cardStyle: CSSProperties = {
    maxWidth: "720px",
    margin: "0 auto",
    backgroundColor: "white",
    width: "80%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: "25px",
    marginTop: "25px",
    textOverflow: "ellipsis",
    padding: "0 20px",
    boxShadow: "0 8px 38px rgba(133, 133, 133, 0.3), 0 5px 12px #85858538",
  };

  const cardColumn: CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    textOverflow: "ellipsis",
    padding: "20px 0",
  };

  const cardColumnTop: CSSProperties = {
    marginTop: "20px",
    backgroundColor: "#b4b5bd",
    width: "100%",
    boxSizing: "border-box",
    textOverflow: "ellipsis",
    maxHeight: "256px",
    textAlign: "center",
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      "& > *": {
        margin: theme.spacing(0.5),
      },
    },
    keywordsT: {
      display: "flex",
      alignItems: "center",
    },
  }));
  const classes = useStyles();

  return (
    <div style={cardStyle}>
      <div style={cardColumnTop}>
        {typeof img === "string" ? (
          <img style={{ margin: "0 auto", maxHeight: "256px" }} src={img} />
        ) : (
          <div>&lt;No Image&gt;</div>
        )}
      </div>
      <div style={cardColumn}>
        <h3>
          <a href={url} target="_blank" rel="noreferrer noopener">
            {title}
          </a>
        </h3>
        <h4>{sections[category] ? sections[category] : "(기타)"}</h4>
        <h5>{`${year}/${month}/${date} ${time}`}</h5>
        <div className={classes.root}>
          <Typography className={classes.keywordsT}>키워드 : </Typography>
          {keywords.map((keyword, i) => {
            return <Chip key={url + "-" + i} label={keyword.value} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Card;
