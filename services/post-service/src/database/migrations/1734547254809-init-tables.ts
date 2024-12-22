import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1734547254809 implements MigrationInterface {
    name = 'InitTables1734547254809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blog_post" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "content" character varying NOT NULL, "imageUrl" character varying NOT NULL, "authorId" character varying NOT NULL, CONSTRAINT "PK_694e842ad1c2b33f5939de6fede" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "authorId_index" ON "blog_post" ("authorId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."authorId_index"`);
        await queryRunner.query(`DROP TABLE "blog_post"`);
    }

}
