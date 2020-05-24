import React from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

const Top = (): JSX.Element => {
  const renderTree = [
    {
      section: "홈",
      link: "/",
    },
    {
      section: "정치",
      link: "/POLITICS",
    },
    {
      section: "경제",
      link: "/ECONOMY",
    },
    {
      section: "사회",
      link: "/SOCIAL",
    },
    {
      section: "IT/과학",
      link: "/SCIENCE",
    },
    {
      section: "생활/문화",
      link: "/LIFE",
    },
    {
      section: "세계",
      link: "/WORLD",
    },
  ];
  const location = useLocation();
  return (
    <div
      className="pure-menu pure-menu-horizontal"
      style={{ textAlign: "center" }}
    >
      <Link to="/" className="pure-menu-heading pure-menu-link">
        UnterTimes
      </Link>
      <ul className="pure-menu-list">
        {renderTree.map((x) => {
          return (
            <li
              key={x.section}
              className={clsx(
                "pure-menu-item",
                location.pathname === x.link && "pure-menu-selected"
              )}
            >
              <Link to={x.link} className="pure-menu-link">
                {x.section}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Top;
