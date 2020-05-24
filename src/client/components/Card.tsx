import React, { CSSProperties } from "react";
import clsx from "clsx";

const Card = (): JSX.Element => {
  const cardStyle: CSSProperties = {
    maxWidth: "720px",
    margin: "0 auto",
    backgroundColor: "white",
    width: "80%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: "50px",
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
  };

  const keywordButton: CSSProperties = {
    marginRight: "1em",
  };

  return (
    <div style={cardStyle}>
      <div style={cardColumnTop}>
        <img
          className="pure-img"
          style={{ margin: "0 auto", maxHeight: "256px" }}
          src="https://imgnews.pstatic.net/image/009/2020/05/24/0004580923_001_20200524112901172.jpg?type=w647"
        />
      </div>
      <div style={cardColumn}>
        <h3>뉴스 제목 </h3>
        <p>
          <button className="pure-button" style={keywordButton}>
            키워드 1
          </button>
          <button className="pure-button" style={keywordButton}>
            키워드 2
          </button>
          <button className="pure-button" style={keywordButton}>
            키워드 3
          </button>
        </p>
      </div>
    </div>
  );
};

export default Card;
