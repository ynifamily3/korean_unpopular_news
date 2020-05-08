var mysql = require("mysql");
import { parse } from "node-html-parser";
import fetch from "node-fetch";
const iconv = require("iconv-lite");

var connection = mysql.createConnection({
  host: "192.168.0.13",
  user: "root",
  password: "root",
  database: "navernews",
});

function eucKrToUtf8(strbuf) {
  return iconv.decode(strbuf, "EUC-KR").toString();
}

let news_contents = []; // [{section: title: oid: aid:}]

var url = "https://news.naver.com/main/ranking/popularDay.nhn";

fetch(url, {
  method: "GET",
  headers: {
    "Content-Type": "text/plain;charset=utf-8",
  },
})
  .then((res) => res.buffer()) // euc-kr이라니 부들부들
  .then((body) => {
    start_parse(eucKrToUtf8(body));
  });

async function get_multiple_news_content(titles, category, oids, aids) {
  console.log("start");
  const urls = oids.map((x, i) => {
    return `https://news.naver.com/main/tool/print.nhn?oid=${oids[i]}&aid=${aids[i]}`;
  });
  console.log(urls);
  const textPromises = urls.map(async (url, i) => {
    let response;
    let conn = await new Promise((resolve, reject) => {
      connection.query(
        "select COUNT(oid) as cnt from newsdata where oid=? and aid=?",
        [oids[i], aids[i]],
        async (err, rows, fields) => {
          if (+rows[0]["cnt"] === 0) {
            // 직접 불러온다.
            console.log("직접 불러옴");
            response = await fetch(url);
            response = await response.buffer();
            response = eucKrToUtf8(response);
            // 파싱
            const root = parse(response);
            response = root
              .querySelector(".article_body")
              .text.replace(/(\n|\r|\+|\t)/gm, "")
              .replace(/  /gm, " ");
            // 파싱끝

            // db에 집어넣는다.

            connection.query(
              "insert into newsdata(oid,aid,section,title,content) values(?,?,?,?,?)",
              [oids[i], aids[i], category, titles[i], response],
              (err, rows, fields) => {
                resolve();
              }
            );
          } else {
            // db에서 꺼내온다.
            console.log("db에서꺼냄");
            connection.query(
              "select content from newsdata where oid=? and aid=?",
              [oids[i], aids[i]],
              async (err, rows, fields) => {
                response = rows[0]["content"];
                resolve();
              }
            );
          }
        }
      );
    });
    return response;
  });
  let rets = [];
  for (const textPromise of textPromises) {
    let data_re = await textPromise;
    rets.push(data_re);
  }
  return rets;
}

async function start_parse(__data) {
  const category = ["정치", "경제", "사회", "생활/문화", "세계", "IT/과학"];
  const category_id = [
    "#ranking_100",
    "#ranking_101",
    "#ranking_102",
    "#ranking_103",
    "#ranking_104",
    "#ranking_105",
  ];
  const root = parse(__data);
  //   for (let c = 0; c < 1; c++) {
  for (let c = 0; c < category_id.length; c++) {
    let oids = [];
    let aids = [];
    let titles = [];
    let contents;
    let elem1 = root
      .querySelector(category_id[c])
      .childNodes[3].querySelectorAll("li");
    console.log(category[c]);
    for (let i = 0; i < elem1.length; i++) {
      // for (let i = 0; i < 1; i++) {
      let elem = elem1[i].querySelector("a");
      const urlParams = new URLSearchParams(elem.getAttribute("href"));
      titles.push(elem.text);
      oids.push(urlParams.get("oid"));
      aids.push(urlParams.get("aid"));
      console.log(titles[i], oids[i], aids[i]);
    }
    // oid와 aid가지고 content뽑아오기
    // oid와 aid가 이미 db에 존재하면 내용 꺼내보지 않도록 (파싱 안하게) 조치해야 함.
    contents = await get_multiple_news_content(titles, category[c], oids, aids);
    console.log(contents);
  }
  connection.end();
}
