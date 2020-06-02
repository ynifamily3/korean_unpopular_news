import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCreateAtToKeyword1591066018088 implements MigrationInterface {
    name = 'AddCreateAtToKeyword1591066018088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `keyword` ADD `createdAt` datetime NOT NULL");
        await queryRunner.query("ALTER TABLE `news_article` CHANGE `aid` `aid` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `news_article` CHANGE `img` `img` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `keyword` DROP FOREIGN KEY `FK_ccb02ca3f709224cd7d5ca41939`");
        await queryRunner.query("ALTER TABLE `keyword` CHANGE `newsArticleId` `newsArticleId` int NULL");
        await queryRunner.query("ALTER TABLE `keyword` ADD CONSTRAINT `FK_ccb02ca3f709224cd7d5ca41939` FOREIGN KEY (`newsArticleId`) REFERENCES `news_article`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `keyword` DROP FOREIGN KEY `FK_ccb02ca3f709224cd7d5ca41939`");
        await queryRunner.query("ALTER TABLE `keyword` CHANGE `newsArticleId` `newsArticleId` int NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `keyword` ADD CONSTRAINT `FK_ccb02ca3f709224cd7d5ca41939` FOREIGN KEY (`newsArticleId`) REFERENCES `news_article`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `news_article` CHANGE `img` `img` varchar(255) NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `news_article` CHANGE `aid` `aid` varchar(255) NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `keyword` DROP COLUMN `createdAt`");
    }

}
