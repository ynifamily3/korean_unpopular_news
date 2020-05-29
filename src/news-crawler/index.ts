import "reflect-metadata";
import { createConnection, Connection } from "typeorm";
import NaverProvider, { INaverNewsArticle } from "./provider/NaverProvider";
import { INewsProvider, INewsArticle } from "./provider";
import { Category, NewsArticle } from "../database/entity/NewsArticle";
import { initialize } from "koalanlp/Util";
import { KMR } from "koalanlp/API";
import { Tagger } from "koalanlp/proc";
import TextRank, { Word, IKeyword } from "./TextRank";
import { Keyword } from "../database/entity/Keyword";

async function parseWords(content: string): Promise<Word[]> {
  const tagger = new Tagger(KMR);
  const tagged = await tagger(content);
  const words: Word[] = [];
  for (const sent of tagged)
    for (const word of sent)
      for (const mor of word)
        words.push({ surface: mor._surface, tag: mor._tag });
  return words;
}

async function crawlCategory(db: Connection, category: string): Promise<void> {
  const rank = new TextRank(2);
  const provider: INewsProvider = new NaverProvider();
  const articles: INewsArticle[] = await provider.getNewsArticles(
    Category[category],
    1,
    new Date()
  );
  for (const articleRaw of articles) {
    let aid: string | undefined;
    if (articleRaw.provider === "naver")
      aid = (<INaverNewsArticle>articleRaw).aid;
    const findAid = await db.manager.findOne(NewsArticle, {
      aid,
    });
    if (findAid) continue;

    if (!articleRaw.content) await provider.fillContent(articleRaw);

    if (articleRaw.content && articleRaw.createdAt) {
      const words = await parseWords(articleRaw.content);
      let keywords: IKeyword[];

      try {
        keywords = rank.extractKeywords(words, 10);
      } catch {
        keywords = [];
      }
      const article: NewsArticle = new NewsArticle();
      article.aid = aid;
      article.createdAt = articleRaw.createdAt;
      article.title = articleRaw.title;
      article.url = articleRaw.url;
      article.keywords = await Promise.all(
        keywords.map(async (k) => {
          const keyword = new Keyword();
          keyword.value = k.value;
          keyword.weight = k.weight;
          return await db.manager.save(keyword);
        })
      );
      try {
        await db.manager.save(article);
      } catch {
        continue;
      }
      console.log(`[${category}] 등록됨: ${article.title}`);
    }
  }
}

initialize({
  packages: { KMR: "2.1.4" },
  verbose: false,
  javaOptions: ["-Xmx8g", "-Dfile.encoding=utf-8"],
}).then(() => {
  for (const key in Category) {
    createConnection().then((db: Connection) =>
      crawlCategory(db, key)
        .then(() => console.log(`[${key}] 완료.`))
        .catch((error: Error) => console.log(`[${key}] 오류: ${error.message}`))
        .finally(() => db.close())
    );
  }
});
