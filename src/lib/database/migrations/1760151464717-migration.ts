import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1760151464717 implements MigrationInterface {
    name = 'Migration1760151464717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" RENAME COLUMN "role" TO "roleId"`);
        await queryRunner.query(`ALTER TYPE "public"."company_role_enum" RENAME TO "company_roleid_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."company_user_role_enum" RENAME TO "company_user_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."company_user_role_enum" AS ENUM('SUPER_ADMIN', 'ADMIN_ALIADO', 'COMPANY')`);
        await queryRunner.query(`ALTER TABLE "company_user" ALTER COLUMN "role" TYPE "public"."company_user_role_enum" USING "role"::"text"::"public"."company_user_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."company_user_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "roleId"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "roleId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."role_name_enum" RENAME TO "role_name_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."role_name_enum" AS ENUM('SUPER_ADMIN', 'ADMIN_ALIADO', 'COMPANY')`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "name" TYPE "public"."role_name_enum" USING "name"::"text"::"public"."role_name_enum"`);
        await queryRunner.query(`DROP TYPE "public"."role_name_enum_old"`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_8d6e97b0ff7c3d3dae08f51c1b5" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_8d6e97b0ff7c3d3dae08f51c1b5"`);
        await queryRunner.query(`CREATE TYPE "public"."role_name_enum_old" AS ENUM('SUPER_ADMIN', 'ADMIN_ALIADO', 'OPERADOR', 'COMPANY')`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "name" TYPE "public"."role_name_enum_old" USING "name"::"text"::"public"."role_name_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."role_name_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."role_name_enum_old" RENAME TO "role_name_enum"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "roleId"`);
        await queryRunner.query(`ALTER TABLE "company" ADD "roleId" "public"."company_roleid_enum" NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."company_user_role_enum_old" AS ENUM('SUPER_ADMIN', 'ADMIN_ALIADO', 'OPERADOR')`);
        await queryRunner.query(`ALTER TABLE "company_user" ALTER COLUMN "role" TYPE "public"."company_user_role_enum_old" USING "role"::"text"::"public"."company_user_role_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."company_user_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."company_user_role_enum_old" RENAME TO "company_user_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."company_roleid_enum" RENAME TO "company_role_enum"`);
        await queryRunner.query(`ALTER TABLE "company" RENAME COLUMN "roleId" TO "role"`);
    }

}

