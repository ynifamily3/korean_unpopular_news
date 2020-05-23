import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const Main = (): JSX.Element => {
  return (
    <div>
      <Helmet>
        <title>메인페이지!</title>
      </Helmet>
      <h2>Main페이지입니다</h2>
      <Link to="/about">어바웃페이지 가기</Link>
    </div>
  );
};

export default Main;
