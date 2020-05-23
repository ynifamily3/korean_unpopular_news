import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const Main = (): JSX.Element => {
  const [counter, setCounter] = useState(0);
  console.log("로그찍기", counter);
  const handlePlusClick = (): void => {
    setCounter(counter + 1);
  };
  const handleMinusClick = (): void => {
    setCounter(counter - 1);
  };
  return (
    <div>
      <Helmet>
        <title>메인페이지!</title>
      </Helmet>
      <h2>Main페이지입니다</h2>
      {counter} <button onClick={handlePlusClick}>+</button>
      <button onClick={handleMinusClick}>-</button>
      <br />
      <Link to="/about">어바웃페이지 가기</Link>
    </div>
  );
};

export default Main;
