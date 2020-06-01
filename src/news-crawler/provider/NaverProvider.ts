import { INewsProvider, INewsArticle } from "./index";
import axios, { AxiosInstance } from "axios";
import iconv from "iconv-lite";
import { Category } from "../../database/entity/NewsArticle";

export interface INaverNewsArticle extends INewsArticle {
  aid: string;
  oid: string;
}

export default class NaverProvider implements INewsProvider {
  private instance: AxiosInstance = axios.create({
    baseURL: "https://news.naver.com/main/",
    timeout: 5000,
    responseType: "arraybuffer",
    transformResponse: [
      (data: Buffer): string => iconv.decode(data, "EUC-KR").toString(),
    ],
  });

  async getNewsArticles(category: Category): Promise<INewsArticle[]> {
    const res = await this.instance.get(
      `/list.nhn?mode=LSD&mid=sec&sid1=${category}&listType=title`
    );
    const re = /<li >.*?<a href=".*?&oid=(?<oid>.*?)&aid=(?<aid>.*?)"class.*?>(?<title>.*?)<\/a>.*?<\/li>/gs;
    const matches = res.data.matchAll(re);
    const articles: INaverNewsArticle[] = [];

    for (const m of matches) {
      const url = `${this.instance.defaults.baseURL}read.nhn?oid=${m.groups.oid}&aid=${m.groups.aid}`;
      articles.push({
        provider: "naver",
        title: <string>(
          m.groups.title.replace(/&#(\d+);/g, (_, dec) =>
            String.fromCharCode(dec)
          )
        ),
        url,
        oid: <string>m.groups.oid,
        aid: <string>m.groups.aid,
        createdAt: null,
        content: null,
      });
    }
    return articles;
  }

  async fillContent(article: INewsArticle): Promise<void> {
    const re = /기사입력 <span class="t11">(?<date>.*?)<\/span>.*?<div class="article_body">(?<content>.*?)<div class="article_footer">/s;
    const res = await this.instance.get(
      `/tool/print.nhn?oid=${(<INaverNewsArticle>article).oid}&aid=${
        (<INaverNewsArticle>article).aid
      }`
    );
    const match = res.data.match(re);
    let content: string = match.groups.content;
    const imgMatch = content.match(
      /<span class="end_photo_org"><img src="(?<imgSrc>.*?)"/i
    );
    content = content
      .replace(/<[^>]*>/g, " ")
      .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
      .trim();
    article.content = content;
    article.img = imgMatch?.groups?.imgSrc;
    article.createdAt = new Date(match.groups.date);
  }
}
