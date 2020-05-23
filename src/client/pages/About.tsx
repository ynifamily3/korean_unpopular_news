import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const About = (): JSX.Element => {
  return (
    <div>
      <Helmet>
        <title>어바웃페이지</title>
      </Helmet>
      <h2>About페이지입니다</h2>
      <Link to="/">메인페이지 가기</Link>
    </div>
  );
};

export default About;
