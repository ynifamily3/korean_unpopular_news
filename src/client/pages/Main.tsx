import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Card from "../components/Card";

const Main = (): JSX.Element => {
  return (
    <div className="App">
      <Helmet>
        <title>UnderTimes</title>
      </Helmet>
      <Card />
      <Card />
      <Card />
    </div>
  );
};

export default Main;
