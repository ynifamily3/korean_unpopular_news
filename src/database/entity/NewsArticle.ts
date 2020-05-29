import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
} from "typeorm";
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
@Unique(["aid"])
export class NewsArticle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  aid?: string;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  img?: string;

  @Column("datetime")
  createdAt: Date;

  @OneToMany(() => Keyword, (keyword) => keyword.newsArticle)
  keywords: Keyword[];

  @Column({
    type: "enum",
    enum: Category,
  })
  category: Category;
}
