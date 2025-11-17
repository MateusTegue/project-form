import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1762716274660 implements MigrationInterface {
    name = 'Migration1762716274660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" ADD "companySlug" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "UQ_c65c5246ec7dbcecfd24c3e163f" UNIQUE ("companySlug")`);
        await queryRunner.query(`ALTER TABLE "company" ADD "companyInfo" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "companyInfo"`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "UQ_c65c5246ec7dbcecfd24c3e163f"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "companySlug"`);
    }

}

