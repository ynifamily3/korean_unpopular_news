import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { NewsArticle } from "./NewsArticle";

@Entity()
export class Keyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @Column()
  weight: number;

  @ManyToOne((type) => NewsArticle, (newsArticle) => newsArticle.keywords)
  newsArticle: NewsArticle;
}
