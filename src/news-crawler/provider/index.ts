import { Category } from "../../database/entity/NewsArticle";

export interface INewsArticle {
  provider: "naver";
  title: string;
  url: string;
  createdAt: Date | null;
  content: string | null;
}

export interface INewsProvider {
  getNewsArticles(
    category: Category,
    page: number,
    date: Date
  ): Promise<INewsArticle[]>;
  fillContent(article: INewsArticle): Promise<void>;
}
