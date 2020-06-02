import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
} from "typeorm";
import { Keyword } from "./Keyword";
import { ObjectType, Field, ID, registerEnumType } from "type-graphql";

export enum Category {
  POLITICS = "100",
  ECONOMY = "101",
  SOCIAL = "102",
  LIFE = "103",
  WORLD = "104",
  SCIENCE = "105",
}
registerEnumType(Category, {
  name: "Category",
  description: "뉴스 카테고리",
});

@Entity()
@Unique(["aid"])
@ObjectType({ description: "뉴스 기사" })
export class NewsArticle {
  @Field(() => ID, { description: "고유 ID" })
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ nullable: true })
  aid?: string;

  @Field({ description: "타이틀" })
  @Column()
  title: string;

  @Field({ description: "뉴스 링크" })
  @Column()
  url: string;

  @Field({ description: "뉴스 이미지", nullable: true })
  @Column({ nullable: true })
  img?: string;

  @Field({ description: "기사 업로드날짜 ISO포맷 문자열" })
  @Column("datetime")
  createdAt: Date;

  @Field(() => [Keyword], { description: "키워드 목록" })
  @OneToMany(() => Keyword, (keyword) => keyword.newsArticle)
  keywords: Keyword[];

  @Field(() => Category, { description: "카테고리" })
  @Column({
    type: "enum",
    enum: Category,
  })
  category: Category;
}
