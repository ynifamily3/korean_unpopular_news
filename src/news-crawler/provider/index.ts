import { Category } from "../../database/entity/NewsArticle";

export interface INewsArticle {
  provider: "naver";
  title: string;
  url: string;
  img?: string;
  createdAt: Date | null;
  content: string | null;
  category: Category;
}

export interface INewsProvider {
  getNewsArticles(category: Category): Promise<INewsArticle[]>;
  fillContent(article: INewsArticle): Promise<void>;
}
