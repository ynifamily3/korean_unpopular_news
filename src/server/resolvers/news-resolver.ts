import { Resolver, Query, ArgsType, Field, Int, Args, ID } from "type-graphql";
import { NewsArticle, Category } from "../../database/entity/NewsArticle";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository, Between } from "typeorm";
import { Min, Max } from "class-validator";
import { Keyword } from "../../database/entity/Keyword";

@ArgsType()
class NewsArticlesArgs {
  @Field(() => Int, { description: "가져올 개수" })
  @Min(1)
  @Max(50)
  limit = 15;

  @Field(() => ID, {
    nullable: true,
    description: "가져올 목록의 바로 이전 ID값",
  })
  offset?: string;

  @Field({ description: "시작 날짜" })
  start: Date;

  @Field({ nullable: true, description: "끝 날짜" })
  end?: Date;

  @Field(() => Boolean, { description: "최신순 정렬" })
  desc = true;

  @Field(() => [String], { description: "포함 키워드 필터" })
  include_keywords: string[] = [];

  @Field(() => [String], { description: "제외 키워드 필터" })
  exclude_keywords: string[] = [];

  @Field(() => Category, { nullable: true, description: "카테고리" })
  category?: Category;
}

@Resolver()
export class NewsResolver {
  constructor(
    @InjectRepository(NewsArticle)
    private readonly newsRepo: Repository<NewsArticle>
  ) {}

  @Query(() => [NewsArticle])
  async newsArticles(
    @Args()
    {
      limit,
      start,
      end,
      desc,
      include_keywords,
      exclude_keywords,
      offset,
      category,
    }: NewsArticlesArgs
  ): Promise<NewsArticle[]> {
    const qb = this.newsRepo.createQueryBuilder("news").where({
      createdAt: Between(start, end || new Date()),
    });

    offset && qb.andWhere("news.id > :offset", { offset });
    category && qb.andWhere("news.category = :category", { category });

    if (include_keywords.length > 0)
      qb.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select("keyword.newsArticleId")
          .from(Keyword, "keyword")
          .where("keyword.value IN (:...include_keywords)", {
            include_keywords,
          })
          .groupBy("keyword.newsArticleId")
          .having("COUNT(keyword.newsArticleId) >= :len", {
            len: include_keywords.length,
          })
          .getQuery();
        return "news.id IN " + subQuery;
      });

    if (exclude_keywords.length > 0)
      qb.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select("keyword.newsArticleId")
          .from(Keyword, "keyword")
          .where("keyword.value IN (:...exclude_keywords)", {
            exclude_keywords,
          })
          .andWhere("keyword.newsArticleId IS NOT NULL")
          .getQuery();
        return "news.id NOT IN " + subQuery;
      });

    qb.innerJoinAndSelect("news.keywords", "keywords")
      .orderBy("news.id", desc ? "DESC" : "ASC")
      .take(limit);

    return qb.getMany();
  }
}
