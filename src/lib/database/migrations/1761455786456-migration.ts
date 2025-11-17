import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1761455786456 implements MigrationInterface {
    name = 'Migration1761455786456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "formmodule" DROP CONSTRAINT "FK_d4ed5752ff6514873e8e382bac6"`);
        await queryRunner.query(`CREATE TABLE "formtemplatemodule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "displayOrder" integer NOT NULL DEFAULT '0', "isRequired" boolean NOT NULL DEFAULT true, "isActive" boolean NOT NULL DEFAULT true, "templateId" uuid, "moduleId" uuid, CONSTRAINT "PK_c3dbfc87cb48134871fb3e617b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "formmodule" DROP COLUMN "displayOrder"`);
        await queryRunner.query(`ALTER TABLE "formmodule" DROP COLUMN "isRequired"`);
        await queryRunner.query(`ALTER TABLE "formmodule" DROP COLUMN "formTemplateId"`);
        await queryRunner.query(`ALTER TABLE "formtemplatemodule" ADD CONSTRAINT "FK_ebd4e7a732057e6d0634fd4b8fa" FOREIGN KEY ("templateId") REFERENCES "formtemplate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "formtemplatemodule" ADD CONSTRAINT "FK_94122696cdf9811f03065329621" FOREIGN KEY ("moduleId") REFERENCES "formmodule"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "formtemplatemodule" DROP CONSTRAINT "FK_94122696cdf9811f03065329621"`);
        await queryRunner.query(`ALTER TABLE "formtemplatemodule" DROP CONSTRAINT "FK_ebd4e7a732057e6d0634fd4b8fa"`);
        await queryRunner.query(`ALTER TABLE "formmodule" ADD "formTemplateId" uuid`);
        await queryRunner.query(`ALTER TABLE "formmodule" ADD "isRequired" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "formmodule" ADD "displayOrder" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE "formtemplatemodule"`);
        await queryRunner.query(`ALTER TABLE "formmodule" ADD CONSTRAINT "FK_d4ed5752ff6514873e8e382bac6" FOREIGN KEY ("formTemplateId") REFERENCES "formtemplate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}

