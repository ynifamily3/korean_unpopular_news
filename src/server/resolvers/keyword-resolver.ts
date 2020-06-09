import { Keyword } from "../../database/entity/Keyword";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository, Between, Brackets } from "typeorm";
import {
  Resolver,
  Query,
  Args,
  ArgsType,
  Field,
  Int,
  Float,
  registerEnumType,
} from "type-graphql";
import { Min, Max } from "class-validator";
import { DateTime } from "luxon";

enum KeywordOrderBy {
  WEIGHT = "weight",
  COUNT = "count",
}
registerEnumType(KeywordOrderBy, {
  name: "KeywordOrderBy",
  description: "키워드 정렬 기준",
});

@ArgsType()
class KeywordsArgs {
  @Field({ nullable: true, description: "검색 키워드값" })
  value?: string;

  @Field({ nullable: true, description: "시작 날짜" })
  start?: Date;

  @Field({ nullable: true, description: "끝 날짜" })
  end?: Date;

  @Field(() => Int, { description: "가져올 개수" })
  @Min(1)
  @Max(100)
  limit = 10;

  @Field(() => Float, { description: "최소 가중치" })
  @Min(0.0)
  @Max(1.0)
  minWeight = 0.0;

  @Field(() => Float, { description: "최대 가중치" })
  @Min(0.0)
  @Max(1.0)
  maxWeight = 1.0;

  @Field(() => KeywordOrderBy, { description: "정렬기준" })
  order = KeywordOrderBy.COUNT;

  @Field(() => Boolean, { description: "오름차순 정렬" })
  asc = false;
}

@Resolver()
export class KeywordResolver {
  constructor(
    @InjectRepository(Keyword)
    private readonly keywordRepo: Repository<Keyword>
  ) {}

  @Query(() => [Keyword])
  async keywords(
    @Args()
    { value, start, end, minWeight, maxWeight, limit, order, asc }: KeywordsArgs
  ): Promise<Keyword[]> {
    const qb = this.keywordRepo
      .createQueryBuilder("keyword")
      .addSelect("COUNT(keyword.value) as `keyword_count`")
      .where({
        weight: Between(minWeight, maxWeight),
      })
      .groupBy("keyword.value");

    if (value) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where("keyword.value LIKE :mvalue", { mvalue: `%${value}%` })
            .orWhere("keyword.value LIKE :rvalue", { rvalue: `${value}%` })
            .orWhere("keyword.value LIKE :lvalue", { lvalue: `%${value}` });
        })
      );
    }

    qb.andWhere("keyword.createdAt >= :start", {
      start: start || DateTime.local().minus({ day: 1 }).toJSDate(),
    });
    end && qb.andWhere("keyword.createdAt <= :end", { end });

    switch (order) {
      case KeywordOrderBy.WEIGHT:
        qb.orderBy("keyword.weight", asc ? "ASC" : "DESC");
        break;
      case KeywordOrderBy.COUNT:
        qb.orderBy("keyword_count", asc ? "ASC" : "DESC");
        break;
    }
    return qb.take(limit).getMany();
  }
}
