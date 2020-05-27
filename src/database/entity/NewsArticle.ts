import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Keyword } from "./Keyword";

export enum Category {
  POLITICS = "100",
  ECONOMY = "101",
  SOCIAL = "102",
  LIFE = "103",
  WORLD = "104",
  SCIENCE = "105",
}

@Entity()
export class NewsArticle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column("datetime")
  createdAt: Date;

  @OneToMany((type) => Keyword, (keyword) => keyword.newsArticle)
  keywords: Keyword[];

  @Column({
    type: "enum",
    enum: Category,
  })
  category: Category;
}
