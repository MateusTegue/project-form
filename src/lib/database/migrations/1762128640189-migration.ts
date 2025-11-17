import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1762128640189 implements MigrationInterface {
    name = 'Migration1762128640189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "formfield" DROP CONSTRAINT "UQ_74c1f0bfc050c93b34ad081dd44"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "formfield" ADD CONSTRAINT "UQ_74c1f0bfc050c93b34ad081dd44" UNIQUE ("fieldKey")`);
    }

}

