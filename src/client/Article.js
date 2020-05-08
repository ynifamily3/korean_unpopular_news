import React from "react";
import PropTypes from "prop-types";
import LinesEllipsis from "react-lines-ellipsis";
import "./Article.css";

function Article({ title, attacedImg, category, body }) {
  return (
    <div className="Article">
      <div className="ArticleCol" id="ArticleCol2">
        <ArticleCell poster={attacedImg} alt={title} />
      </div>
      <div className="ArticleCol">
        <h1>{title}</h1>
        <div className="ArticleCategory">
          {category.map((category, index) => (
            <ArticleCategory category={category} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ArticleCell({ poster, alt }) {
  return <img src={poster} alt={alt} title={alt} className="Article__Poster" />;
}

function ArticleCategory({ category }) {
  return <span className="ArticleCategory">{category}</span>;
}

Article.propTypes = {
  title: PropTypes.string.isRequired,
  poster: PropTypes.string.isRequired,
  genres: PropTypes.array.isRequired,
  synopsis: PropTypes.string.isRequired,
};

ArticleCell.propTypes = {
  poster: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

ArticleCategory.propTypes = {
  genre: PropTypes.string.isRequired,
};

export default Article;
