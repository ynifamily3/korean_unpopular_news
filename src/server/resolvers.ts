import { Resolver, Query, ArgsType, Field, Int, Args } from "type-graphql";
import { NewsArticle } from "../database/entity/NewsArticle";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository, Between, In } from "typeorm";
import { Min } from "class-validator";

@ArgsType()
class NewsArticlesArgs {
  @Field(() => Int, { description: "가져올 개수" })
  @Min(1)
  limit = 15;

  @Field({ description: "시작 날짜" })
  start: Date;

  @Field({ nullable: true, description: "끝 날짜" })
  end?: Date;

  @Field(() => Boolean, { description: "최신순 정렬" })
  desc = true;

  @Field(() => [String], { description: "키워드 필터" })
  keywords: string[] = [];
}

@Resolver()
export class NewsResolver {
  constructor(
    @InjectRepository(NewsArticle)
    private readonly newsRepo: Repository<NewsArticle>
  ) {}

  @Query(() => [NewsArticle])
  async newsArticles(
    @Args() { limit, start, end, desc, keywords }: NewsArticlesArgs
  ): Promise<NewsArticle[]> {
    return await this.newsRepo
      .createQueryBuilder("news")
      .innerJoinAndSelect("news.keywords", "keywords")
      .where({ createdAt: Between<Date>(start, end || new Date()) })
      .orderBy("news.createdAt", desc ? "DESC" : "ASC")
      .take(limit)
      .getMany();
  }
}
