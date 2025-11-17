import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1762647538468 implements MigrationInterface {
    name = 'Migration1762647538468'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("otp");
        const hasCodeColumn = table?.findColumnByName("code");
        
        if (!hasCodeColumn) {
            await queryRunner.query(`ALTER TABLE "otp" ADD "code" character varying(6) NOT NULL DEFAULT ''`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otp" DROP COLUMN "code"`);
    }
}

