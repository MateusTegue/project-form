import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1761000626352 implements MigrationInterface {
    name = 'Migration1761000626352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "field_option" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "label" character varying(100) NOT NULL, "value" character varying(100) NOT NULL, "displayOrder" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "formFieldId" uuid, CONSTRAINT "PK_fb215d8058960e188fc6148ebae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."formfield_fieldtype_enum" AS ENUM('TEXT', 'EMAIL', 'NUMBER', 'PHONE', 'DATE', 'SELECT', 'RADIO', 'CHECKBOX', 'TEXTAREA', 'FILE', 'URL')`);
        await queryRunner.query(`CREATE TABLE "formfield" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "label" character varying(200) NOT NULL, "fieldKey" character varying(100) NOT NULL, "fieldType" "public"."formfield_fieldtype_enum" NOT NULL DEFAULT 'TEXT', "placeholder" character varying(255), "helpText" text, "isRequired" boolean NOT NULL DEFAULT false, "displayOrder" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "validations" json, "layoutConfig" json, "formModuleId" uuid, CONSTRAINT "UQ_74c1f0bfc050c93b34ad081dd44" UNIQUE ("fieldKey"), CONSTRAINT "PK_0fc2bb41513333dcb835a3fdb00" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "formmodule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(200) NOT NULL, "description" text, "moduleKey" character varying(50) NOT NULL, "displayOrder" integer NOT NULL DEFAULT '0', "isRequired" boolean NOT NULL DEFAULT true, "isActive" boolean NOT NULL DEFAULT true, "formTemplateId" uuid, CONSTRAINT "UQ_789d76ee5575b6e04db02a45022" UNIQUE ("moduleKey"), CONSTRAINT "PK_7f796d4fd3cab1657c1effae5c6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."formtemplate_templatetype_enum" AS ENUM('PROVEEDOR', 'CLIENTE', 'TERCERO_GENERAL', 'PERSONALIZADO')`);
        await queryRunner.query(`CREATE TYPE "public"."formtemplate_status_enum" AS ENUM('Activo', 'Inactivo')`);
        await queryRunner.query(`CREATE TABLE "formtemplate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(200) NOT NULL, "description" text, "templateType" "public"."formtemplate_templatetype_enum" NOT NULL DEFAULT 'TERCERO_GENERAL', "status" "public"."formtemplate_status_enum" NOT NULL DEFAULT 'Activo', "createdBy" uuid NOT NULL, CONSTRAINT "PK_dfffa6671798372d83cc6877bbd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."companyformassignment_status_enum" AS ENUM('Activo', 'Inactivo')`);
        await queryRunner.query(`CREATE TABLE "companyformassignment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "publicToken" character varying(100) NOT NULL, "publicUrl" character varying(500), "isActive" boolean NOT NULL DEFAULT true, "allowMultipleSubmissions" boolean NOT NULL DEFAULT false, "allowEditAfterSubmit" boolean NOT NULL DEFAULT false, "activatedAt" TIMESTAMP, "expiresAt" TIMESTAMP, "status" "public"."companyformassignment_status_enum" NOT NULL DEFAULT 'Activo', "customConfig" json, "companyId" uuid NOT NULL, "formTemplateId" uuid NOT NULL, CONSTRAINT "UQ_757b52046f4cda57909f7c4ae3c" UNIQUE ("publicToken"), CONSTRAINT "PK_7fad206a41452839540c7734dc7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."form_submission_status_enum" AS ENUM('PENDIENTE', 'PROCESANDO', 'PROCESADO')`);
        await queryRunner.query(`CREATE TABLE "form_submission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "submitterEmail" character varying(100), "submitterName" character varying(200), "submitterPhone" character varying(20), "submitterDocumentId" character varying(50), "ipAddress" character varying(50), "userAgent" text, "status" "public"."form_submission_status_enum" NOT NULL DEFAULT 'PENDIENTE', "reviewNotes" text, "reviewedBy" character varying(100), "reviewedAt" TIMESTAMP, "submittedAt" TIMESTAMP, "companyFormAssignmentId" uuid, CONSTRAINT "PK_afdf6f86e3747141dd75876e027" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "submission_answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "fieldKey" character varying(100) NOT NULL, "textValue" text, "numberValue" numeric(15,2), "dateValue" date, "jsonValue" json, "fileUrl" character varying(500), "formSubmissionId" uuid, "formFieldId" uuid NOT NULL, CONSTRAINT "PK_1692baefb1f7b14f4a2683c66f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "field_option" ADD CONSTRAINT "FK_5a0883f1dab7699e29343350853" FOREIGN KEY ("formFieldId") REFERENCES "formfield"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "formfield" ADD CONSTRAINT "FK_366dbc784718da70fb95b3d8ffc" FOREIGN KEY ("formModuleId") REFERENCES "formmodule"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "formmodule" ADD CONSTRAINT "FK_d4ed5752ff6514873e8e382bac6" FOREIGN KEY ("formTemplateId") REFERENCES "formtemplate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "formtemplate" ADD CONSTRAINT "FK_2cc9ccf408569a75bc9e9a79ae6" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "companyformassignment" ADD CONSTRAINT "FK_fb5de54f590544990f83f865019" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "companyformassignment" ADD CONSTRAINT "FK_8875b4b15345dfb539494de35f3" FOREIGN KEY ("formTemplateId") REFERENCES "formtemplate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "form_submission" ADD CONSTRAINT "FK_b006e28fc4f12cabf767c647e21" FOREIGN KEY ("companyFormAssignmentId") REFERENCES "companyformassignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submission_answer" ADD CONSTRAINT "FK_338a79ad3b8e8b50ac6cc52c166" FOREIGN KEY ("formSubmissionId") REFERENCES "form_submission"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submission_answer" ADD CONSTRAINT "FK_4b4737f17b0291dc42d7a41bec3" FOREIGN KEY ("formFieldId") REFERENCES "formfield"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "submission_answer" DROP CONSTRAINT "FK_4b4737f17b0291dc42d7a41bec3"`);
        await queryRunner.query(`ALTER TABLE "submission_answer" DROP CONSTRAINT "FK_338a79ad3b8e8b50ac6cc52c166"`);
        await queryRunner.query(`ALTER TABLE "form_submission" DROP CONSTRAINT "FK_b006e28fc4f12cabf767c647e21"`);
        await queryRunner.query(`ALTER TABLE "companyformassignment" DROP CONSTRAINT "FK_8875b4b15345dfb539494de35f3"`);
        await queryRunner.query(`ALTER TABLE "companyformassignment" DROP CONSTRAINT "FK_fb5de54f590544990f83f865019"`);
        await queryRunner.query(`ALTER TABLE "formtemplate" DROP CONSTRAINT "FK_2cc9ccf408569a75bc9e9a79ae6"`);
        await queryRunner.query(`ALTER TABLE "formmodule" DROP CONSTRAINT "FK_d4ed5752ff6514873e8e382bac6"`);
        await queryRunner.query(`ALTER TABLE "formfield" DROP CONSTRAINT "FK_366dbc784718da70fb95b3d8ffc"`);
        await queryRunner.query(`ALTER TABLE "field_option" DROP CONSTRAINT "FK_5a0883f1dab7699e29343350853"`);
        await queryRunner.query(`DROP TABLE "submission_answer"`);
        await queryRunner.query(`DROP TABLE "form_submission"`);
        await queryRunner.query(`DROP TYPE "public"."form_submission_status_enum"`);
        await queryRunner.query(`DROP TABLE "companyformassignment"`);
        await queryRunner.query(`DROP TYPE "public"."companyformassignment_status_enum"`);
        await queryRunner.query(`DROP TABLE "formtemplate"`);
        await queryRunner.query(`DROP TYPE "public"."formtemplate_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."formtemplate_templatetype_enum"`);
        await queryRunner.query(`DROP TABLE "formmodule"`);
        await queryRunner.query(`DROP TABLE "formfield"`);
        await queryRunner.query(`DROP TYPE "public"."formfield_fieldtype_enum"`);
        await queryRunner.query(`DROP TABLE "field_option"`);
    }

}

