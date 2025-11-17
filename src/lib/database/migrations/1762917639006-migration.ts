import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1762917639006 implements MigrationInterface {
    name = 'Migration1762917639006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."form_submission_status_enum" RENAME TO "form_submission_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."form_submission_status_enum" AS ENUM('PENDIENTE', 'PROCESANDO', 'PROCESADO', 'ELIMINADO')`);
        await queryRunner.query(`ALTER TABLE "form_submission" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "form_submission" ALTER COLUMN "status" TYPE "public"."form_submission_status_enum" USING "status"::"text"::"public"."form_submission_status_enum"`);
        await queryRunner.query(`ALTER TABLE "form_submission" ALTER COLUMN "status" SET DEFAULT 'PENDIENTE'`);
        await queryRunner.query(`DROP TYPE "public"."form_submission_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."form_submission_status_enum_old" AS ENUM('PENDIENTE', 'PROCESANDO', 'PROCESADO')`);
        await queryRunner.query(`ALTER TABLE "form_submission" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "form_submission" ALTER COLUMN "status" TYPE "public"."form_submission_status_enum_old" USING "status"::"text"::"public"."form_submission_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "form_submission" ALTER COLUMN "status" SET DEFAULT 'PENDIENTE'`);
        await queryRunner.query(`DROP TYPE "public"."form_submission_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."form_submission_status_enum_old" RENAME TO "form_submission_status_enum"`);
    }

}

