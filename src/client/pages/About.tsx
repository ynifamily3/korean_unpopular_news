import React from "react";
import { Link } from "react-router-dom";

const About = (): JSX.Element => {
  return (
    <div>
      <h2>About페이지입니다</h2>
      <Link to="/">메인페이지 가기</Link>
    </div>
  );
};

export default About;
