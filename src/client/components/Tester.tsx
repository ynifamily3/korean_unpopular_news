import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const GET_KEYWORDS = gql`
  {
    keywords(minWeight: 0.5, limit: 20) {
      value
    }
  }
`;

export default function Tester(): JSX.Element {
  const { loading, error, data } = useQuery(GET_KEYWORDS);
  useEffect(() => {
    console.log("로딩됨!~", data);
  }, [data]);
  if (loading) return <p>Loading중</p>;
  return <div>로딩완료</div>;
}
