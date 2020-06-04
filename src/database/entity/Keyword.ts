import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { NewsArticle } from "./NewsArticle";
import { ObjectType, Field, Float } from "type-graphql";

@Entity()
@ObjectType({ description: "뉴스 키워드" })
export class Keyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ description: "키워드 값" })
  @Column()
  value: string;

  @Field(() => Float, { description: "키워드 가중치" })
  @Column()
  weight: number;

  @Field({ description: "기사 업로드날짜 ISO포맷 문자열" })
  @Column("datetime")
  createdAt: Date;

  @ManyToOne(() => NewsArticle, (newsArticle) => newsArticle.keywords)
  newsArticle: NewsArticle;
}
