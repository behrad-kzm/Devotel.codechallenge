import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1734623579450 implements MigrationInterface {
    name = 'InitTables1734623579450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "image_details" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, CONSTRAINT "PK_693670923b4a824a82c565b7310" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "image_details"`);
    }

}
