import React from "react";
import PropTypes from "prop-types";

function Article({ title, attacedImg, category, body }) {
  return (
    <div className="Article">
      <div className="ArticleCol" id="ArticleCol2"></div>
      <div className="ArticleCol">
        <h1>{title}</h1>
        <div className="ArticleCategory"></div>
      </div>
    </div>
  );
}
