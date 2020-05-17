import { gql } from "apollo-server-express";
import { getNewsArticles, NewsArticle } from "./repo";

export const typeDefs = gql`
  "뉴스 키워드"
  type Keyword {
    "키워드 값"
    value: String
    "키워드 가중치"
    weight: Int
  }

  "뉴스 카테고리"
  enum Category {
    "정치"
    POLITICS
    "경제"
    ECONOMY
    "사회"
    SOCIAL
    "생활/문화"
    LIFE
    "세계"
    WORLD
    "IT/과학"
    SCIENCE
  }

  "뉴스기사"
  type NewsArticle {
    "뉴스 타이틀"
    title: String
    "뉴스 키워드 목록"
    keywords: [Keyword]
    "뉴스 카테고리"
    category: Category
    "뉴스 링크"
    url: String
  }

  type Query {
    "뉴스 목록을 가져온다."
    news("키워드 필터 목록" keywords: [String]): [NewsArticle]
  }
`;

export const resolvers = {
  Category: {
    POLITICS: "100",
    ECONOMY: "101",
    SOCIAL: "102",
    LIFE: "103",
    WORLD: "104",
    SCIENCE: "105",
  },

  Query: {
    news: (_, args): NewsArticle[] => getNewsArticles(args.keywords),
  },
};
