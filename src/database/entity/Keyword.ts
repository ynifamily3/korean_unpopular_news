import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { NewsArticle } from "./NewsArticle";

@Entity()
export class Keyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @Column()
  weight: number;

  @ManyToOne(() => NewsArticle, (newsArticle) => newsArticle.keywords)
  newsArticle: NewsArticle;
}
