import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1762715751227 implements MigrationInterface {
    name = 'Migration1762715751227'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" ADD "redirectUrl" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "otp" ALTER COLUMN "code" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otp" ALTER COLUMN "code" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "redirectUrl"`);
    }

}

